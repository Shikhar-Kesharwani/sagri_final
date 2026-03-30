import type { Context } from "npm:hono";

// ==================== RATE LIMITING ====================

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of Object.entries(rateLimitStore)) {
    if (value.resetTime < now) {
      delete rateLimitStore[key];
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

export function rateLimit(options: RateLimitOptions) {
  return async (c: Context, next: () => Promise<void>) => {
    const ip = c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "unknown";
    const path = c.req.path;
    const key = `${ip}:${path}`;
    const now = Date.now();

    if (!rateLimitStore[key] || rateLimitStore[key].resetTime < now) {
      // Initialize or reset
      rateLimitStore[key] = {
        count: 1,
        resetTime: now + options.windowMs,
      };
    } else {
      rateLimitStore[key].count++;
    }

    const limit = rateLimitStore[key];

    // Set rate limit headers
    c.header("X-RateLimit-Limit", options.maxRequests.toString());
    c.header("X-RateLimit-Remaining", Math.max(0, options.maxRequests - limit.count).toString());
    c.header("X-RateLimit-Reset", new Date(limit.resetTime).toISOString());

    if (limit.count > options.maxRequests) {
      console.log(`Rate limit exceeded for ${key}: ${limit.count} requests`);
      return c.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfter: Math.ceil((limit.resetTime - now) / 1000),
        },
        429
      );
    }

    await next();
  };
}

// ==================== AUTHENTICATION MIDDLEWARE ====================

export async function requireAuth(c: Context, next: () => Promise<void>, supabaseAdmin: any) {
  const accessToken = c.req.header("Authorization")?.split(" ")[1];

  if (!accessToken) {
    console.log("Missing authorization header");
    return c.json({ error: "Missing authorization header" }, 401);
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      console.error("Invalid or expired token:", error?.message);
      return c.json({ error: "Invalid or expired token" }, 401);
    }

    // Attach user to context
    c.set("user", user);
    await next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return c.json({ error: "Authentication failed" }, 401);
  }
}

export async function requireAdmin(c: Context, next: () => Promise<void>, kv: any) {
  const user = c.get("user");

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userData = await kv.get(`user:${user.id}`);

  if (userData?.role !== "admin") {
    console.log(`Access denied for non-admin user: ${user.id}`);
    return c.json({ error: "Forbidden: Admin access required" }, 403);
  }

  await next();
}

// ==================== SECURITY HEADERS ====================

export function securityHeaders(c: Context, next: () => Promise<void>) {
  // Add security headers
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("X-XSS-Protection", "1; mode=block");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );

  return next();
}

// ==================== ERROR HANDLER ====================

export function errorHandler(err: Error, c: Context) {
  console.error("Unhandled error:", err);

  // Don't expose internal errors to clients
  const isDev = Deno.env.get("DENO_ENV") === "development";

  return c.json(
    {
      error: "Internal server error",
      message: isDev ? err.message : undefined,
      stack: isDev ? err.stack : undefined,
    },
    500
  );
}

// ==================== REQUEST LOGGING ====================

export function requestLogger(c: Context, next: () => Promise<void>) {
  const start = Date.now();
  const path = c.req.path;
  const method = c.req.method;

  return next().then(() => {
    const duration = Date.now() - start;
    console.log(`${method} ${path} - ${duration}ms`);
  });
}
