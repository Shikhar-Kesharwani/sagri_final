import { Context } from "npm:hono";
import * as kv from "./kv_store.tsx";

// ==================== CROP LISTINGS ====================

export interface CropListing {
  id: string;
  userId: string;
  userName: string;
  cropType: string;
  cropName: string;
  quantity: number;
  quality: string;
  price: number;
  location: string;
  contactPhone: string;
  description?: string;
  harvestDate?: string;
  status: 'active' | 'sold' | 'cancelled';
  views: number;
  interested: number;
  createdAt: string;
  updatedAt: string;
}

export async function createCropListing(
  userId: string,
  userName: string,
  listingData: Omit<CropListing, 'id' | 'userId' | 'userName' | 'status' | 'views' | 'interested' | 'createdAt' | 'updatedAt'>
): Promise<CropListing> {
  const listingId = crypto.randomUUID();
  const now = new Date().toISOString();

  const listing: CropListing = {
    id: listingId,
    userId,
    userName,
    ...listingData,
    status: 'active',
    views: 0,
    interested: 0,
    createdAt: now,
    updatedAt: now,
  };

  // Save listing
  await kv.set(`crop_listing:${listingId}`, listing);

  // Add to user's listings
  const userListings = await kv.get(`user_crop_listings:${userId}`) || [];
  userListings.unshift(listingId);
  await kv.set(`user_crop_listings:${userId}`, userListings);

  // Add to global index
  const allListings = await kv.get('crop_listings_index') || [];
  allListings.unshift(listingId);
  await kv.set('crop_listings_index', allListings.slice(0, 500)); // Keep last 500

  return listing;
}

export async function getCropListings(limit = 50): Promise<CropListing[]> {
  const listingIds = await kv.get('crop_listings_index') || [];
  const listings = await kv.mget(listingIds.slice(0, limit).map((id: string) => `crop_listing:${id}`));
  
  // Filter only active listings and sort by date
  return listings
    .filter((l: CropListing | null) => l && l.status === 'active')
    .sort((a: CropListing, b: CropListing) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function getUserCropListings(userId: string): Promise<CropListing[]> {
  const listingIds = await kv.get(`user_crop_listings:${userId}`) || [];
  const listings = await kv.mget(listingIds.map((id: string) => `crop_listing:${id}`));
  
  return listings
    .filter((l: CropListing | null) => l !== null)
    .sort((a: CropListing, b: CropListing) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function updateCropListing(
  listingId: string,
  userId: string,
  updates: Partial<CropListing>
): Promise<CropListing | null> {
  const listing = await kv.get(`crop_listing:${listingId}`);
  
  if (!listing || listing.userId !== userId) {
    return null;
  }

  const updatedListing = {
    ...listing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await kv.set(`crop_listing:${listingId}`, updatedListing);
  return updatedListing;
}

export async function deleteCropListing(listingId: string, userId: string): Promise<boolean> {
  const listing = await kv.get(`crop_listing:${listingId}`);
  
  if (!listing || listing.userId !== userId) {
    return false;
  }

  // Mark as cancelled instead of deleting
  await updateCropListing(listingId, userId, { status: 'cancelled' });
  return true;
}

export async function incrementListingViews(listingId: string): Promise<void> {
  const listing = await kv.get(`crop_listing:${listingId}`);
  if (listing) {
    listing.views = (listing.views || 0) + 1;
    await kv.set(`crop_listing:${listingId}`, listing);
  }
}

// ==================== SEED ORDERS ====================

export interface SeedOrder {
  id: string;
  userId: string;
  userName: string;
  items: Array<{
    seedId: number;
    name: string;
    quantity: number;
    price: number;
    unit: string;
  }>;
  totalAmount: number;
  deliveryAddress: string;
  contactPhone: string;
  paymentMethod: 'cod' | 'online';
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export async function createSeedOrder(
  userId: string,
  userName: string,
  orderData: Omit<SeedOrder, 'id' | 'userId' | 'userName' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<SeedOrder> {
  const orderId = crypto.randomUUID();
  const now = new Date().toISOString();

  const order: SeedOrder = {
    id: orderId,
    userId,
    userName,
    ...orderData,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  // Save order
  await kv.set(`seed_order:${orderId}`, order);

  // Add to user's orders
  const userOrders = await kv.get(`user_seed_orders:${userId}`) || [];
  userOrders.unshift(orderId);
  await kv.set(`user_seed_orders:${userId}`, userOrders);

  return order;
}

export async function getUserSeedOrders(userId: string): Promise<SeedOrder[]> {
  const orderIds = await kv.get(`user_seed_orders:${userId}`) || [];
  const orders = await kv.mget(orderIds.map((id: string) => `seed_order:${id}`));
  
  return orders
    .filter((o: SeedOrder | null) => o !== null)
    .sort((a: SeedOrder, b: SeedOrder) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function updateSeedOrderStatus(
  orderId: string,
  userId: string,
  status: SeedOrder['status']
): Promise<SeedOrder | null> {
  const order = await kv.get(`seed_order:${orderId}`);
  
  if (!order || order.userId !== userId) {
    return null;
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();

  await kv.set(`seed_order:${orderId}`, order);
  return order;
}

// ==================== SHOPPING CART ====================

export interface CartItem {
  seedId: number;
  name: string;
  quantity: number;
  price: number;
  unit: string;
}

export async function saveCart(userId: string, items: CartItem[]): Promise<void> {
  await kv.set(`cart:${userId}`, {
    items,
    updatedAt: new Date().toISOString(),
  });
}

export async function getCart(userId: string): Promise<CartItem[]> {
  const cart = await kv.get(`cart:${userId}`);
  return cart?.items || [];
}

export async function clearCart(userId: string): Promise<void> {
  await kv.del(`cart:${userId}`);
}

// ==================== EQUIPMENT BOOKINGS ====================

export interface EquipmentBooking {
  id: string;
  userId: string;
  userName: string;
  equipmentId: number;
  equipmentName: string;
  startDate: string;
  endDate: string;
  duration: number;
  totalCost: number;
  deliveryAddress: string;
  contactPhone: string;
  specialRequirements?: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export async function createEquipmentBooking(
  userId: string,
  userName: string,
  bookingData: Omit<EquipmentBooking, 'id' | 'userId' | 'userName' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<EquipmentBooking> {
  const bookingId = crypto.randomUUID();
  const now = new Date().toISOString();

  const booking: EquipmentBooking = {
    id: bookingId,
    userId,
    userName,
    ...bookingData,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  // Save booking
  await kv.set(`equipment_booking:${bookingId}`, booking);

  // Add to user's bookings
  const userBookings = await kv.get(`user_equipment_bookings:${userId}`) || [];
  userBookings.unshift(bookingId);
  await kv.set(`user_equipment_bookings:${userId}`, userBookings);

  return booking;
}

export async function getUserEquipmentBookings(userId: string): Promise<EquipmentBooking[]> {
  const bookingIds = await kv.get(`user_equipment_bookings:${userId}`) || [];
  const bookings = await kv.mget(bookingIds.map((id: string) => `equipment_booking:${id}`));
  
  return bookings
    .filter((b: EquipmentBooking | null) => b !== null)
    .sort((a: EquipmentBooking, b: EquipmentBooking) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function updateEquipmentBookingStatus(
  bookingId: string,
  userId: string,
  status: EquipmentBooking['status']
): Promise<EquipmentBooking | null> {
  const booking = await kv.get(`equipment_booking:${bookingId}`);
  
  if (!booking || booking.userId !== userId) {
    return null;
  }

  booking.status = status;
  booking.updatedAt = new Date().toISOString();

  await kv.set(`equipment_booking:${bookingId}`, booking);
  return booking;
}

// ==================== LOAN APPLICATIONS ====================

export interface LoanApplication {
  id: string;
  userId: string;
  userName: string;
  loanType: string;
  loanName: string;
  amount: number;
  purpose: string;
  landSize?: number;
  annualIncome?: number;
  contactPhone: string;
  address: string;
  documents?: {
    aadhar?: boolean;
    pan?: boolean;
    landRecords?: boolean;
    incomeProof?: boolean;
  };
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'disbursed';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export async function createLoanApplication(
  userId: string,
  userName: string,
  applicationData: Omit<LoanApplication, 'id' | 'userId' | 'userName' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<LoanApplication> {
  const applicationId = crypto.randomUUID();
  const now = new Date().toISOString();

  const application: LoanApplication = {
    id: applicationId,
    userId,
    userName,
    ...applicationData,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  // Save application
  await kv.set(`loan_application:${applicationId}`, application);

  // Add to user's applications
  const userApplications = await kv.get(`user_loan_applications:${userId}`) || [];
  userApplications.unshift(applicationId);
  await kv.set(`user_loan_applications:${userId}`, userApplications);

  return application;
}

export async function getUserLoanApplications(userId: string): Promise<LoanApplication[]> {
  const applicationIds = await kv.get(`user_loan_applications:${userId}`) || [];
  const applications = await kv.mget(applicationIds.map((id: string) => `loan_application:${id}`));
  
  return applications
    .filter((a: LoanApplication | null) => a !== null)
    .sort((a: LoanApplication, b: LoanApplication) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function updateLoanApplicationStatus(
  applicationId: string,
  status: LoanApplication['status'],
  remarks?: string
): Promise<LoanApplication | null> {
  const application = await kv.get(`loan_application:${applicationId}`);
  
  if (!application) {
    return null;
  }

  application.status = status;
  application.updatedAt = new Date().toISOString();
  if (remarks) {
    application.remarks = remarks;
  }

  await kv.set(`loan_application:${applicationId}`, application);
  return application;
}
