// ============================================================================
// Types officiels pour FERRARI LOUNGE — BY AUTO CRAZE 229
// ============================================================================

export type RequestStatus = 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';

export interface AdminUser {
  name: string;
  username: string;
  role: string;
}

export interface AdminDashboardStats {
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  rejectedReservations: number;
  totalOrders: number;
  pendingOrders: number;
  totalMessages: number;
  unreadMessages: number;
  activeMenuItems: number;
  totalReviews: number;
  pendingReviews: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  category: 'restaurant' | 'events' | 'lounge' | 'automotive';
  notice?: string;
  isActive: boolean;
  highlights: string[];
  features?: string[];
  operationalNotice?: string;
  badge?: string;
}

export interface Reservation {
  id: string;
  fullName: string;
  phone: string;
  date: string;
  time: string;
  guestsCount: number;
  tableTheme: string;
  additionalNotes?: string;
  status: RequestStatus;
  internalNote?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

export interface DeliveryOrder {
  id: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  items: OrderItem[];
  totalAmount: number;
  notes?: string;
  status: RequestStatus | 'in_delivery' | 'delivered';
  internalNote?: string;
  createdAt: string;
}

export interface DailySpecial {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  chefNote?: string;
  availableDate: string;
  isActive: boolean;
}

export type MenuCategory = 'cafe_cocktails' | 'entrees_tapas' | 'plats_signatures' | 'desserts';

export interface MenuItem {
  id: string;
  title: string;
  category: MenuCategory;
  price: number;
  description: string;
  image: string;
  isActive: boolean;
  badge?: string;
  isDemo?: boolean;
}

export interface TableTheme {
  id: string;
  name: string;
  description: string;
  isAvailable: boolean;
  accentColor?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  features: string[];
  dailyRate: number | null;
  image: string;
  isAvailable: boolean;
  statusNotice?: string;
}

export interface CarRentalRequest {
  id: string;
  fullName: string;
  phone: string;
  vehicleName?: string;
  startDate: string;
  endDate: string;
  withDriver: boolean;
  message?: string;
  status: RequestStatus;
  internalNote?: string;
  createdAt: string;
}

export type AssistanceProblemType = 'mecanique' | 'batterie' | 'crevaison' | 'demarrage' | 'autre';

export interface RoadsideAssistanceRequest {
  id: string;
  fullName: string;
  phone: string;
  vehicleModel: string;
  problemType: AssistanceProblemType;
  location: string;
  description?: string;
  status: RequestStatus;
  internalNote?: string;
  createdAt: string;
}

export interface AutomotiveService {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'location' | 'depannage' | 'assistance' | 'autre';
  isActive: boolean;
  isConfirmedByEstablishment: boolean;
  highlights: string[];
  notice?: string;
}

export interface EventItem {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  time: string;
  category: 'f1_grand_prix' | 'dj_night' | 'theme_party' | 'lounge_exclusive' | 'soiree_lounge';
  description: string;
  image: string;
  isActive: boolean;
  isFeatured?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'ambiance' | 'gastronomie' | 'automobile' | 'evenements';
  image: string;
  caption?: string;
}

export interface CustomerReview {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
  isApproved: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  phoneOrEmail: string;
  subject?: string;
  message: string;
  isTreated: boolean;
  internalNote?: string;
  createdAt: string;
}

export interface OperatingHoursDay {
  dayLabel: string;
  schedule: string;
  isClosed?: boolean;
}

export interface EstablishmentConfig {
  name: string;
  signature: string;
  slogan: string;
  activity: string;
  description: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  country: string;
  mapDirectionsUrl: string;
  hours: OperatingHoursDay[];
  partnerLogos: {
    autoCraze: string;
    f1: string;
    shield: string;
  };
}

export interface AdminAccountConfig {
  isConfigured: boolean;
  username?: string;
  displayName?: string;
  passwordHash?: string;
  salt?: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface AdminUserSession {
  username: string;
  displayName: string;
  token: string;
}

export interface RealAdminStats {
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  rejectedReservations: number;
  totalOrders: number;
  pendingOrders: number;
  totalRentalRequests: number;
  pendingRentalRequests: number;
  totalAssistanceRequests: number;
  pendingAssistanceRequests: number;
  totalMessages: number;
  unreadMessages: number;
  totalReviews: number;
  pendingReviews: number;
  totalVehicles: number;
  activeVehicles: number;
  activeMenuItems: number;
}
