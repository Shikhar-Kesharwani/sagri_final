import { z } from "npm:zod";

// ==================== VALIDATION SCHEMAS ====================

// Auth schemas
export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  role: z.enum(["farmer", "admin"], {
    errorMap: () => ({ message: "Role must be either 'farmer' or 'admin'" }),
  }),
  location: z.string().optional(),
  phone: z.string().optional().refine(
    (val) => !val || val.length === 0 || /^[6-9]\d{9}$/.test(val),
    { message: "Invalid Indian phone number (must be 10 digits starting with 6-9)" }
  ),
});

export const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const updatePasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Prediction schemas
export const predictionSchema = z.object({
  type: z.enum(["disease", "risk", "price", "recommendation"]),
  cropType: z.string().min(1).max(100),
  result: z.any(),
  confidence: z.number().min(0).max(100).optional(),
  imageUrl: z.string().url().optional(),
  location: z.string().optional(),
});

// Community schemas
export const createPostSchema = z.object({
  content: z.string().min(10, "Post must be at least 10 characters").max(2000, "Post is too long"),
  cropType: z.string().optional(),
  tags: z.array(z.string()).max(5).optional(),
});

export const updatePointsSchema = z.object({
  points: z.number().int().min(-1000).max(1000),
  reason: z.string().optional(),
});

// File upload validation
export const imageFileSchema = z.object({
  type: z.string().refine(
    (type) => ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(type),
    "File must be an image (JPEG, PNG, or WebP)"
  ),
  size: z.number().max(10 * 1024 * 1024, "File size must be less than 10MB"),
});

// User update schema
export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  location: z.string().max(200).optional(),
  phone: z.string().optional().refine(
    (val) => !val || val.length === 0 || /^[6-9]\d{9}$/.test(val),
    { message: "Invalid Indian phone number (must be 10 digits starting with 6-9)" }
  ),
});

// ==================== MARKETPLACE SCHEMAS ====================

// Crop listing schemas
export const createCropListingSchema = z.object({
  cropType: z.string().min(1, "Crop type is required"),
  cropName: z.string().min(1, "Crop name is required"),
  quantity: z.number().positive("Quantity must be positive"),
  quality: z.string().min(1, "Quality is required"),
  price: z.number().positive("Price must be positive"),
  location: z.string().min(1, "Location is required"),
  contactPhone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
  description: z.string().max(500).optional(),
  harvestDate: z.string().optional(),
});

export const updateCropListingSchema = z.object({
  quantity: z.number().positive().optional(),
  price: z.number().positive().optional(),
  status: z.enum(['active', 'sold', 'cancelled']).optional(),
  description: z.string().max(500).optional(),
});

// Seed order schemas
export const createSeedOrderSchema = z.object({
  items: z.array(z.object({
    seedId: z.number(),
    name: z.string(),
    quantity: z.number().positive(),
    price: z.number().positive(),
    unit: z.string(),
  })).min(1, "Order must have at least one item"),
  totalAmount: z.number().positive("Total amount must be positive"),
  deliveryAddress: z.string().min(10, "Delivery address is required"),
  contactPhone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
  paymentMethod: z.enum(['cod', 'online']),
});

// Equipment booking schemas
export const createEquipmentBookingSchema = z.object({
  equipmentId: z.number(),
  equipmentName: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  duration: z.number().positive(),
  totalCost: z.number().positive(),
  deliveryAddress: z.string().min(10, "Delivery address is required"),
  contactPhone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
  specialRequirements: z.string().max(500).optional(),
});

// Loan application schemas
export const createLoanApplicationSchema = z.object({
  loanType: z.string().min(1, "Loan type is required"),
  loanName: z.string().min(1, "Loan name is required"),
  amount: z.number().positive("Amount must be positive"),
  purpose: z.string().min(10, "Purpose is required"),
  landSize: z.number().positive().optional(),
  annualIncome: z.number().positive().optional(),
  contactPhone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
  address: z.string().min(10, "Address is required"),
  documents: z.object({
    aadhar: z.boolean().optional(),
    pan: z.boolean().optional(),
    landRecords: z.boolean().optional(),
    incomeProof: z.boolean().optional(),
  }).optional(),
});

// ==================== VALIDATION HELPERS ====================

export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  error?: string;
} {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return {
        success: false,
        error: firstError.message,
      };
    }
    return {
      success: false,
      error: "Validation failed",
    };
  }
}

// Sanitize HTML to prevent XSS
export function sanitizeString(str: string): string {
  return str
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// Validate and sanitize user input
export function sanitizeInput(data: any): any {
  if (typeof data === "string") {
    return sanitizeString(data);
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeInput);
  }
  if (data && typeof data === "object") {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  return data;
}