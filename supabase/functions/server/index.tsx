import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { 
  validateData, 
  signupSchema, 
  signinSchema,
  resetPasswordSchema,
  predictionSchema,
  createPostSchema,
  updatePointsSchema,
  updateUserSchema,
  sanitizeInput,
  createCropListingSchema,
  updateCropListingSchema,
  createSeedOrderSchema,
  createEquipmentBookingSchema,
  createLoanApplicationSchema,
} from "./validation.tsx";
import { 
  rateLimit, 
  requireAuth, 
  requireAdmin,
  securityHeaders,
  errorHandler,
} from "./security.tsx";
import {
  getWeatherData,
  getMarketPrices,
  detectCropDisease,
  predictCropRisk,
} from "./api-integrations.tsx";
import * as marketplace from "./marketplace.tsx";

const app = new Hono();

// Supabase clients
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Enable logger
app.use("*", logger(console.log));

// Security headers
app.use("*", securityHeaders);

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"],
    maxAge: 600,
  })
);

// Initialize storage buckets
async function initializeBuckets() {
  const bucketName = "make-267f669b-crop-images";
  
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = buckets?.some((bucket) => bucket.name === bucketName);
    
    if (!bucketExists) {
      await supabaseAdmin.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 10485760, // 10MB
      });
      console.log(`✅ Created bucket: ${bucketName}`);
    } else {
      console.log(`✅ Bucket exists: ${bucketName}`);
    }
  } catch (error) {
    console.error("❌ Error initializing buckets:", error);
  }
}

// Initialize on startup
initializeBuckets();

console.log("🚀 SAGRI Production Server Starting...");
console.log("📊 Environment:", Deno.env.get("DENO_ENV") || "production");

// ==================== AUTHENTICATION ROUTES ====================

// Sign up new user with email/password
app.post(
  "/make-server-267f669b/auth/signup",
  rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 5 }), // 5 requests per 15 minutes
  async (c) => {
    try {
      const body = await c.req.json();
      console.log("📝 Signup request received:", { email: body.email, name: body.name, role: body.role });
      
      const validation = validateData(signupSchema, body);

      if (!validation.success) {
        console.log("❌ Signup validation failed:", validation.error);
        return c.json({ error: validation.error }, 400);
      }

      const { email, password, name, role, location, phone } = validation.data!;

      console.log("✅ Validation passed, creating user...");

      // Create user with Supabase Auth
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm since email server not configured
        user_metadata: { 
          name, 
          role,
          location: location || (role === 'farmer' ? 'Punjab, India' : undefined),
          phone,
        },
      });

      if (error) {
        // Handle specific error cases
        if (error.message?.includes('already registered') || error.code === 'user_already_exists') {
          console.log(`⚠️ Email ${email} already exists`);
          return c.json({ error: "This email is already registered. Please sign in instead." }, 409);
        }
        console.error("❌ Supabase auth error:", error);
        return c.json({ error: error.message || "Failed to create account" }, 400);
      }

      console.log("✅ User created in Supabase Auth:", data.user.id);

      // Store additional user data in KV
      try {
        await kv.set(`user:${data.user.id}`, {
          id: data.user.id,
          email,
          name,
          role,
          location: location || (role === 'farmer' ? 'Punjab, India' : undefined),
          phone,
          points: role === 'farmer' ? 0 : undefined,
          createdAt: new Date().toISOString(),
        });
        console.log("✅ User data saved to KV store");
      } catch (kvError) {
        console.error("⚠️ KV store error (non-critical):", kvError);
        // Continue even if KV fails
      }

      console.log(`✅ User signup complete: ${email} (${role})`);

      return c.json({ 
        user: data.user,
        message: "Account created successfully! You can now sign in."
      });
    } catch (error) {
      console.error("❌ Error in signup:", error);
      console.error("❌ Error stack:", error instanceof Error ? error.stack : 'No stack trace');
      return c.json({ 
        error: "Internal server error during signup",
        details: error instanceof Error ? error.message : String(error)
      }, 500);
    }
  }
);

// Sign in user with email/password
app.post(
  "/make-server-267f669b/auth/signin",
  rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 10 }), // 10 requests per 15 minutes
  async (c) => {
    try {
      const body = await c.req.json();
      const validation = validateData(signinSchema, body);

      if (!validation.success) {
        console.log("Signin validation failed:", validation.error);
        return c.json({ error: validation.error }, 400);
      }

      const { email, password } = validation.data!;

      // Note: In the frontend, use supabase.auth.signInWithPassword() directly
      // This endpoint is for session verification only
      
      // Verify credentials by attempting to get user
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? ""
      );

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log(`Signin failed for ${email}:`, error.message);
        return c.json({ error: "Invalid email or password" }, 401);
      }

      // Get user data from KV
      const userData = await kv.get(`user:${data.user.id}`);

      console.log(`✅ User signed in: ${email}`);

      return c.json({ 
        user: data.user,
        session: data.session,
        profile: userData,
      });
    } catch (error) {
      console.error("❌ Error in signin:", error);
      return c.json({ error: "Internal server error during signin" }, 500);
    }
  }
);

// Sign out user
app.post("/make-server-267f669b/auth/signout", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    
    if (accessToken) {
      await supabaseAdmin.auth.admin.signOut(accessToken);
      console.log("✅ User signed out");
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("❌ Error in signout:", error);
    return c.json({ error: "Internal server error during signout" }, 500);
  }
});

// Request password reset
app.post(
  "/make-server-267f669b/auth/reset-password",
  rateLimit({ windowMs: 60 * 60 * 1000, maxRequests: 3 }), // 3 requests per hour
  async (c) => {
    try {
      const body = await c.req.json();
      const validation = validateData(resetPasswordSchema, body);

      if (!validation.success) {
        return c.json({ error: validation.error }, 400);
      }

      const { email } = validation.data!;

      // Generate password reset link
      const { data, error } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email,
      });

      if (error) {
        console.error("Password reset error:", error);
        // Don't reveal if email exists
        return c.json({ success: true, message: "If the email exists, a reset link will be sent." });
      }

      console.log(`✅ Password reset requested for: ${email}`);
      
      // In production with email configured, this would send an email
      // For now, return success
      return c.json({ 
        success: true, 
        message: "Password reset instructions sent to your email.",
        // In development, include the reset link
        resetLink: Deno.env.get("DENO_ENV") === "development" ? data.properties.action_link : undefined,
      });
    } catch (error) {
      console.error("❌ Error in password reset:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// Get user profile
app.get("/make-server-267f669b/auth/profile", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    
    if (!accessToken) {
      return c.json({ error: "No authorization token provided" }, 401);
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      console.error("Get user error:", error);
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get additional user data from KV
    const userData = await kv.get(`user:${user.id}`);

    return c.json({ 
      user: {
        ...user,
        ...userData,
      }
    });
  } catch (error) {
    console.error("❌ Error getting profile:", error);
    return c.json({ error: "Internal server error getting profile" }, 500);
  }
});

// Update user profile
app.put("/make-server-267f669b/auth/profile", async (c) => {
  try {
    await requireAuth(c, async () => {}, supabaseAdmin);
    const user = c.get("user");
    
    const body = await c.req.json();
    const validation = validateData(updateUserSchema, body);

    if (!validation.success) {
      return c.json({ error: validation.error }, 400);
    }

    const updates = sanitizeInput(validation.data!);

    // Get current user data
    const userData = await kv.get(`user:${user.id}`) || {};

    // Update user data in KV
    await kv.set(`user:${user.id}`, {
      ...userData,
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    // Update user metadata in Supabase Auth
    if (updates.name) {
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        user_metadata: {
          ...user.user_metadata,
          ...updates,
        },
      });
    }

    console.log(`✅ Profile updated for user: ${user.id}`);

    return c.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ==================== FARMER ROUTES ====================

// Update farmer points
app.post(
  "/make-server-267f669b/farmer/points",
  rateLimit({ windowMs: 60 * 1000, maxRequests: 30 }), // 30 requests per minute
  async (c) => {
    try {
      await requireAuth(c, async () => {}, supabaseAdmin);
      const user = c.get("user");

      const body = await c.req.json();
      const validation = validateData(updatePointsSchema, body);

      if (!validation.success) {
        return c.json({ error: validation.error }, 400);
      }

      const { points, reason } = validation.data!;

      const userData = await kv.get(`user:${user.id}`) || {};
      const updatedPoints = (userData?.points || 0) + points;

      await kv.set(`user:${user.id}`, {
        ...userData,
        points: Math.max(0, updatedPoints), // Prevent negative points
        lastPointsUpdate: new Date().toISOString(),
      });

      console.log(`✅ Points updated for ${user.id}: ${points} (${reason || 'no reason'})`);

      return c.json({ points: updatedPoints });
    } catch (error) {
      console.error("❌ Error updating points:", error);
      return c.json({ error: "Internal server error updating points" }, 500);
    }
  }
);

// Save prediction result
app.post(
  "/make-server-267f669b/predictions",
  rateLimit({ windowMs: 60 * 1000, maxRequests: 20 }), // 20 requests per minute
  async (c) => {
    try {
      await requireAuth(c, async () => {}, supabaseAdmin);
      const user = c.get("user");

      const body = await c.req.json();
      const validation = validateData(predictionSchema, body);

      if (!validation.success) {
        return c.json({ error: validation.error }, 400);
      }

      const predictionData = sanitizeInput(validation.data!);

      const predictionId = crypto.randomUUID();
      const prediction = {
        id: predictionId,
        userId: user.id,
        ...predictionData,
        createdAt: new Date().toISOString(),
      };

      await kv.set(`prediction:${predictionId}`, prediction);
      
      // Also store in user's predictions list
      const userPredictions = await kv.get(`user_predictions:${user.id}`) || [];
      userPredictions.unshift(predictionId);
      await kv.set(`user_predictions:${user.id}`, userPredictions.slice(0, 100)); // Keep last 100

      console.log(`✅ Prediction saved for ${user.id}: ${predictionData.type}`);

      return c.json({ prediction });
    } catch (error) {
      console.error("❌ Error saving prediction:", error);
      return c.json({ error: "Internal server error saving prediction" }, 500);
    }
  }
);

// Get user predictions
app.get(
  "/make-server-267f669b/predictions",
  rateLimit({ windowMs: 60 * 1000, maxRequests: 60 }), // 60 requests per minute
  async (c) => {
    try {
      await requireAuth(c, async () => {}, supabaseAdmin);
      const user = c.get("user");

      const predictionIds = await kv.get(`user_predictions:${user.id}`) || [];
      const predictions = await kv.mget(predictionIds.map((id: string) => `prediction:${id}`));

      return c.json({ predictions: predictions.filter(Boolean) });
    } catch (error) {
      console.error("❌ Error getting predictions:", error);
      return c.json({ error: "Internal server error getting predictions" }, 500);
    }
  }
);

// Upload crop image
app.post(
  "/make-server-267f669b/upload-image",
  rateLimit({ windowMs: 60 * 1000, maxRequests: 10 }), // 10 uploads per minute
  async (c) => {
    try {
      await requireAuth(c, async () => {}, supabaseAdmin);
      const user = c.get("user");

      const formData = await c.req.formData();
      const file = formData.get("file") as File;

      if (!file) {
        return c.json({ error: "No file uploaded" }, 400);
      }

      // Validate file
      if (!file.type.startsWith('image/')) {
        return c.json({ error: "File must be an image" }, 400);
      }

      if (file.size > 10 * 1024 * 1024) {
        return c.json({ error: "File size must be less than 10MB" }, 400);
      }

      const fileName = `${user.id}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const bucketName = "make-267f669b-crop-images";

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from(bucketName)
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return c.json({ error: uploadError.message }, 400);
      }

      // Create signed URL (valid for 7 days)
      const { data: signedData } = await supabaseAdmin.storage
        .from(bucketName)
        .createSignedUrl(fileName, 3600 * 24 * 7);

      console.log(`✅ Image uploaded for ${user.id}: ${fileName}`);

      return c.json({ 
        path: fileName, 
        url: signedData?.signedUrl 
      });
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      return c.json({ error: "Internal server error uploading image" }, 500);
    }
  }
);

// AI Disease Detection
app.post(
  "/make-server-267f669b/ai/detect-disease",
  rateLimit({ windowMs: 60 * 1000, maxRequests: 10 }), // 10 requests per minute
  async (c) => {
    try {
      await requireAuth(c, async () => {}, supabaseAdmin);
      const user = c.get("user");

      const { imageUrl, cropType } = await c.req.json();

      if (!imageUrl || !cropType) {
        return c.json({ error: "imageUrl and cropType are required" }, 400);
      }

      // Call AI disease detection service
      const result = await detectCropDisease(imageUrl, cropType);

      console.log(`✅ Disease detection for ${user.id}: ${result.disease}`);

      return c.json(result);
    } catch (error) {
      console.error("❌ Error in disease detection:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// AI Risk Prediction
app.post(
  "/make-server-267f669b/ai/predict-risk",
  rateLimit({ windowMs: 60 * 1000, maxRequests: 10 }), // 10 requests per minute
  async (c) => {
    try {
      await requireAuth(c, async () => {}, supabaseAdmin);
      const user = c.get("user");

      const { cropType, location } = await c.req.json();

      if (!cropType) {
        return c.json({ error: "cropType is required" }, 400);
      }

      const userData = await kv.get(`user:${user.id}`);
      const userLocation = location || userData?.location || "Punjab, India";

      // Call AI risk prediction service
      const result = await predictCropRisk(cropType, userLocation);

      console.log(`✅ Risk prediction for ${user.id}: ${result.riskLevel}`);

      return c.json(result);
    } catch (error) {
      console.error("❌ Error in risk prediction:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// ==================== ADMIN ROUTES ====================

// Get admin analytics
app.get(
  "/make-server-267f669b/admin/analytics",
  rateLimit({ windowMs: 60 * 1000, maxRequests: 30 }), // 30 requests per minute
  async (c) => {
    try {
      await requireAuth(c, async () => {}, supabaseAdmin);
      await requireAdmin(c, async () => {}, kv);

      // Get all users with 'user:' prefix
      const allUsers = await kv.getByPrefix("user:");
      const farmers = allUsers.filter((u: any) => u.role === 'farmer');
      
      // Get all predictions
      const allPredictions = await kv.getByPrefix("prediction:");

      // Calculate analytics
      const today = new Date().toISOString().split('T')[0];
      const activeToday = allPredictions.filter((p: any) => 
        p.createdAt?.startsWith(today)
      ).length;

      return c.json({
        totalUsers: allUsers.length,
        totalFarmers: farmers.length,
        totalAdmins: allUsers.length - farmers.length,
        totalPredictions: allPredictions.length,
        activeToday,
        avgPointsPerFarmer: Math.round(
          farmers.reduce((sum: number, f: any) => sum + (f.points || 0), 0) / (farmers.length || 1)
        ),
      });
    } catch (error) {
      console.error("❌ Error getting analytics:", error);
      return c.json({ error: "Internal server error getting analytics" }, 500);
    }
  }
);

// Get all users (admin only)
app.get(
  "/make-server-267f669b/admin/users",
  rateLimit({ windowMs: 60 * 1000, maxRequests: 20 }), // 20 requests per minute
  async (c) => {
    try {
      await requireAuth(c, async () => {}, supabaseAdmin);
      await requireAdmin(c, async () => {}, kv);

      const allUsers = await kv.getByPrefix("user:");

      // Remove sensitive data
      const sanitizedUsers = allUsers.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        location: u.location,
        points: u.points,
        createdAt: u.createdAt,
      }));

      return c.json({ users: sanitizedUsers });
    } catch (error) {
      console.error("❌ Error getting users:", error);
      return c.json({ error: "Internal server error getting users" }, 500);
    }
  }
);

// ==================== DATA ROUTES ====================

// Get weather data
app.get(
  "/make-server-267f669b/weather",
  rateLimit({ windowMs: 60 * 1000, maxRequests: 30 }), // 30 requests per minute
  async (c) => {
    try {
      const location = c.req.query("location") || "Ludhiana, Punjab";
      const weather = await getWeatherData(location);
      
      return c.json(weather);
    } catch (error) {
      console.error("❌ Error getting weather:", error);
      return c.json({ error: "Internal server error getting weather" }, 500);
    }
  }
);

// Get market prices
app.get(
  "/make-server-267f669b/market-prices",
  rateLimit({ windowMs: 60 * 1000, maxRequests: 30 }), // 30 requests per minute
  async (c) => {
    try {
      const location = c.req.query("location");
      const prices = await getMarketPrices(location);
      
      return c.json({ prices });
    } catch (error) {
      console.error("❌ Error getting market prices:", error);
      return c.json({ error: "Internal server error getting prices" }, 500);
    }
  }
);

// ==================== COMMUNITY ROUTES ====================

// Get community posts
app.get(
  "/make-server-267f669b/community/posts",
  rateLimit({ windowMs: 60 * 1000, maxRequests: 60 }), // 60 requests per minute
  async (c) => {
    try {
      const posts = await kv.getByPrefix("post:");
      
      // Sort by creation date
      const sortedPosts = posts.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return c.json({ posts: sortedPosts.slice(0, 100) }); // Return latest 100
    } catch (error) {
      console.error("❌ Error getting posts:", error);
      return c.json({ error: "Internal server error getting posts" }, 500);
    }
  }
);

// Create community post
app.post(
  "/make-server-267f669b/community/posts",
  rateLimit({ windowMs: 60 * 1000, maxRequests: 10 }), // 10 posts per minute
  async (c) => {
    try {
      await requireAuth(c, async () => {}, supabaseAdmin);
      const user = c.get("user");

      const body = await c.req.json();
      const validation = validateData(createPostSchema, body);

      if (!validation.success) {
        return c.json({ error: validation.error }, 400);
      }

      const { content, cropType, tags } = sanitizeInput(validation.data!);

      const userData = await kv.get(`user:${user.id}`);
      const postId = crypto.randomUUID();

      const post = {
        id: postId,
        author: userData?.name || "Anonymous",
        userId: user.id,
        content,
        cropType,
        tags: tags || [],
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
      };

      await kv.set(`post:${postId}`, post);

      console.log(`✅ Post created by ${user.id}`);

      return c.json({ post });
    } catch (error) {
      console.error("❌ Error creating post:", error);
      return c.json({ error: "Internal server error creating post" }, 500);
    }
  }
);

// ==================== MARKETPLACE ROUTES ====================

// Create crop listing
app.post(
  "/make-server-267f669b/marketplace/crop-listings",
  rateLimit({ windowMs: 60 * 1000, maxRequests: 10 }), // 10 listings per minute
  async (c) => {
    try {
      await requireAuth(c, async () => {}, supabaseAdmin);
      const user = c.get("user");

      const body = await c.req.json();
      const validation = validateData(createCropListingSchema, body);

      if (!validation.success) {
        return c.json({ error: validation.error }, 400);
      }

      const listingData = sanitizeInput(validation.data!);
      const userData = await kv.get(`user:${user.id}`);

      const listing = await marketplace.createCropListing(
        user.id,
        userData?.name || "Anonymous",
        listingData
      );

      console.log(`✅ Crop listing created by ${user.id}`);

      return c.json({ listing });
    } catch (error) {
      console.error("❌ Error creating crop listing:", error);
      return c.json({ error: "Internal server error creating crop listing" }, 500);
    }
  }
);

// Get all active crop listings
app.get(
  "/make-server-267f669b/marketplace/crop-listings/all",
  rateLimit({ windowMs: 60 * 1000, maxRequests: 60 }), // 60 requests per minute
  async (c) => {
    try {
      const limit = parseInt(c.req.query("limit") || "50");
      const listings = await marketplace.getCropListings(limit);
      return c.json({ listings });
    } catch (error) {
      console.error("❌ Error getting crop listings:", error);
      return c.json({ error: "Internal server error getting crop listings" }, 500);
    }
  }
);

// Get user's crop listings
app.get(
  "/make-server-267f669b/marketplace/crop-listings/my",
  rateLimit({ windowMs: 60 * 1000, maxRequests: 60 }), // 60 requests per minute
  async (c) => {
    try {
      await requireAuth(c, async () => {}, supabaseAdmin);
      const user = c.get("user");

      const listings = await marketplace.getUserCropListings(user.id);
      return c.json({ listings });
    } catch (error) {
      console.error("❌ Error getting user crop listings:", error);
      return c.json({ error: "Internal server error getting crop listings" }, 500);
    }
  }
);

// Update crop listing
app.put(
  "/make-server-267f669b/marketplace/crop-listings/:id",
  rateLimit({ windowMs: 60 * 1000, maxRequests: 20 }), // 20 updates per minute
  async (c) => {
    try {
      await requireAuth(c, async () => {}, supabaseAdmin);
      const user = c.get("user");
      const listingId = c.req.param("id");

      const body = await c.req.json();
      const validation = validateData(updateCropListingSchema, body);

      if (!validation.success) {
        return c.json({ error: validation.error }, 400);
      }

      const updates = sanitizeInput(validation.data!);
      const updatedListing = await marketplace.updateCropListing(listingId, user.id, updates);

      if (!updatedListing) {
        return c.json({ error: "Listing not found or unauthorized" }, 404);
      }

      console.log(`✅ Crop listing updated: ${listingId}`);

      return c.json({ listing: updatedListing });
    } catch (error) {
      console.error("❌ Error updating crop listing:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// Delete crop listing
app.delete(
  "/make-server-267f669b/marketplace/crop-listings/:id",
  rateLimit({ windowMs: 60 * 1000, maxRequests: 20 }), // 20 deletes per minute
  async (c) => {
    try {
      await requireAuth(c, async () => {}, supabaseAdmin);
      const user = c.get("user");
      const listingId = c.req.param("id");

      const success = await marketplace.deleteCropListing(listingId, user.id);

      if (!success) {
        return c.json({ error: "Listing not found or unauthorized" }, 404);
      }

      console.log(`✅ Crop listing deleted: ${listingId}`);

      return c.json({ success: true, message: "Listing deleted successfully" });
    } catch (error) {
      console.error("❌ Error deleting crop listing:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// Create seed order
app.post(
  "/make-server-267f669b/marketplace/seed-orders",
  rateLimit({ windowMs: 60 * 1000, maxRequests: 10 }), // 10 orders per minute
  async (c) => {
    try {
      await requireAuth(c, async () => {}, supabaseAdmin);
      const user = c.get("user");

      const body = await c.req.json();
      const validation = validateData(createSeedOrderSchema, body);

      if (!validation.success) {
        return c.json({ error: validation.error }, 400);
      }

      const orderData = sanitizeInput(validation.data!);
      const userData = await kv.get(`user:${user.id}`);

      const order = await marketplace.createSeedOrder(
        user.id,
        userData?.name || "Anonymous",
        orderData
      );

      // Clear cart after successful order
      await marketplace.clearCart(user.id);

      console.log(`✅ Seed order created: ${order.id}`);

      return c.json({ order });
    } catch (error) {
      console.error("❌ Error creating seed order:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// Get user's seed orders
app.get(
  "/make-server-267f669b/marketplace/seed-orders",
  rateLimit({ windowMs: 60 * 1000, maxRequests: 60 }), // 60 requests per minute
  async (c) => {
    try {
      await requireAuth(c, async () => {}, supabaseAdmin);
      const user = c.get("user");

      const orders = await marketplace.getUserSeedOrders(user.id);
      return c.json({ orders });
    } catch (error) {
      console.error("❌ Error getting seed orders:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// Save shopping cart
app.post(
  "/make-server-267f669b/marketplace/cart",
  rateLimit({ windowMs: 60 * 1000, maxRequests: 30 }), // 30 requests per minute
  async (c) => {
    try {
      await requireAuth(c, async () => {}, supabaseAdmin);
      const user = c.get("user");

      const { items } = await c.req.json();
      await marketplace.saveCart(user.id, items);

      return c.json({ success: true });
    } catch (error) {
      console.error("❌ Error saving cart:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// Get shopping cart
app.get(
  "/make-server-267f669b/marketplace/cart",
  rateLimit({ windowMs: 60 * 1000, maxRequests: 60 }), // 60 requests per minute
  async (c) => {
    try {
      await requireAuth(c, async () => {}, supabaseAdmin);
      const user = c.get("user");

      const items = await marketplace.getCart(user.id);
      return c.json({ items });
    } catch (error) {
      console.error("❌ Error getting cart:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// Create equipment booking
app.post(
  "/make-server-267f669b/marketplace/equipment-bookings",
  rateLimit({ windowMs: 60 * 1000, maxRequests: 10 }), // 10 bookings per minute
  async (c) => {
    try {
      await requireAuth(c, async () => {}, supabaseAdmin);
      const user = c.get("user");

      const body = await c.req.json();
      const validation = validateData(createEquipmentBookingSchema, body);

      if (!validation.success) {
        return c.json({ error: validation.error }, 400);
      }

      const bookingData = sanitizeInput(validation.data!);
      const userData = await kv.get(`user:${user.id}`);

      const booking = await marketplace.createEquipmentBooking(
        user.id,
        userData?.name || "Anonymous",
        bookingData
      );

      console.log(`✅ Equipment booking created: ${booking.id}`);

      return c.json({ booking });
    } catch (error) {
      console.error("❌ Error creating equipment booking:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// Get user's equipment bookings
app.get(
  "/make-server-267f669b/marketplace/equipment-bookings",
  rateLimit({ windowMs: 60 * 1000, maxRequests: 60 }), // 60 requests per minute
  async (c) => {
    try {
      await requireAuth(c, async () => {}, supabaseAdmin);
      const user = c.get("user");

      const bookings = await marketplace.getUserEquipmentBookings(user.id);
      return c.json({ bookings });
    } catch (error) {
      console.error("❌ Error getting equipment bookings:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// Create loan application
app.post(
  "/make-server-267f669b/marketplace/loan-applications",
  rateLimit({ windowMs: 60 * 1000, maxRequests: 5 }), // 5 applications per minute
  async (c) => {
    try {
      await requireAuth(c, async () => {}, supabaseAdmin);
      const user = c.get("user");

      const body = await c.req.json();
      const validation = validateData(createLoanApplicationSchema, body);

      if (!validation.success) {
        return c.json({ error: validation.error }, 400);
      }

      const applicationData = sanitizeInput(validation.data!);
      const userData = await kv.get(`user:${user.id}`);

      const application = await marketplace.createLoanApplication(
        user.id,
        userData?.name || "Anonymous",
        applicationData
      );

      console.log(`✅ Loan application created: ${application.id}`);

      return c.json({ application });
    } catch (error) {
      console.error("❌ Error creating loan application:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// Get user's loan applications
app.get(
  "/make-server-267f669b/marketplace/loan-applications",
  rateLimit({ windowMs: 60 * 1000, maxRequests: 60 }), // 60 requests per minute
  async (c) => {
    try {
      await requireAuth(c, async () => {}, supabaseAdmin);
      const user = c.get("user");

      const applications = await marketplace.getUserLoanApplications(user.id);
      return c.json({ applications });
    } catch (error) {
      console.error("❌ Error getting loan applications:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// ==================== GENERAL ROUTES ====================

// Health check endpoint
app.get("/make-server-267f669b/health", (c) => {
  return c.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    environment: Deno.env.get("DENO_ENV") || "production",
  });
});

// Error handling
app.onError((err, c) => {
  return errorHandler(err, c);
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Route not found" }, 404);
});

Deno.serve(app.fetch);

console.log("✅ SAGRI Production Server Ready!");
console.log("📡 Health check: /make-server-267f669b/health");