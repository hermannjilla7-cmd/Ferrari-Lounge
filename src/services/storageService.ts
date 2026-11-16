import type {
  Reservation,
  DeliveryOrder,
  DailySpecial,
  MenuItem,
  TableTheme,
  Vehicle,
  CarRentalRequest,
  RoadsideAssistanceRequest,
  AutomotiveService,
  ServiceItem,
  EventItem,
  GalleryItem,
  CustomerReview,
  ContactMessage,
  EstablishmentConfig,
  AdminAccountConfig,
  AdminUserSession,
  RealAdminStats,
  AdminDashboardStats,
} from '../types';

// ============================================================================
// CONFIGURATION OFFICIELLE — FERRARI LOUNGE BY AUTO CRAZE 229
// ============================================================================

export const DEFAULT_ESTABLISHMENT: EstablishmentConfig = {
  name: 'Ferrari Lounge',
  signature: 'by Auto Craze 229',
  slogan: 'Race. Eat. Drink. Dance.',
  activity: 'Café - Resto - Lounge',
  description:
    'Ferrari Lounge 229 est un établissement situé à Akpakpa, Cotonou, au Bénin. Son décor est inspiré de l’univers Ferrari, mêlant caractère automobile et élégance contemporaine.',
  phone: '+229 01 42 68 88 37',
  whatsapp: '+2290142688837',
  address:
    'Akpakpa, Ciné Concorde, 2ème rue à droite en allant vers la Mosquée de Lom-Nava, Cotonou, Bénin',
  city: 'Akpakpa, Cotonou',
  country: 'Bénin',
  mapDirectionsUrl:
    'https://www.google.com/maps/search/?api=1&query=Akpakpa+Cine+Concorde+Mosquee+de+Lom-Nava+Cotonou+Benin',
  hours: [
    { dayLabel: 'Lundi', schedule: 'Fermé', isClosed: true },
    { dayLabel: 'Mardi au Samedi', schedule: '08h30 à 01h00', isClosed: false },
    { dayLabel: 'Dimanche', schedule: '10h00 à 04h00', isClosed: false },
  ],
  partnerLogos: {
    autoCraze: '/logo-auto-craze.jpeg',
    f1: '/logo-f1.jpeg',
    shield: '/logo-ferrari-shield.jpeg',
  },
};

export const DEFAULT_TABLE_THEMES: TableTheme[] = [];

export const DEFAULT_DAILY_SPECIAL: DailySpecial = {
  id: 'daily-special-empty',
  title: 'Aucun plat du jour pour le moment',
  price: 0,
  description: 'Le menu du jour sera publié dès qu’un plat officiel sera validé par l’établissement.',
  image: '',
  chefNote: 'Aucune donnée pour le moment.',
  availableDate: new Date().toISOString().split('T')[0],
  isActive: false,
};

export const DEFAULT_MENU_ITEMS: MenuItem[] = [];

export const DEFAULT_EVENTS: EventItem[] = [];

export const DEFAULT_GALLERY: GalleryItem[] = [];

export const DEFAULT_AUTOMOTIVE_SERVICES: AutomotiveService[] = [];

export const DEFAULT_SERVICES: ServiceItem[] = [];

// ============================================================================
// CLÉS DE PERSISTANCE
// ============================================================================

const STORAGE_KEYS = {
  ESTABLISHMENT: 'ferrari_lounge_establishment_v2',
  RESERVATIONS: 'ferrari_lounge_reservations_v2',
  ORDERS: 'ferrari_lounge_orders_v2',
  DAILY_SPECIAL: 'ferrari_lounge_daily_special_v2',
  MENU: 'ferrari_lounge_menu_v2',
  THEMES: 'ferrari_lounge_themes_v2',
  VEHICLES: 'ferrari_lounge_vehicles_v2',
  RENTAL_REQUESTS: 'ferrari_lounge_rental_requests_v2',
  ASSISTANCE_REQUESTS: 'ferrari_lounge_assistance_requests_v2',
  AUTOMOTIVE_SERVICES: 'ferrari_lounge_auto_services_v2',
  EVENTS: 'ferrari_lounge_events_v2',
  GALLERY: 'ferrari_lounge_gallery_v2',
  REVIEWS: 'ferrari_lounge_reviews_v2',
  MESSAGES: 'ferrari_lounge_messages_v2',
  ADMIN_CONFIG: 'ferrari_lounge_admin_account_v2',
  ADMIN_SESSION: 'ferrari_lounge_admin_session_v2',
};

// ============================================================================
// FONCTIONS CRYPTOGRAPHIQUES SHA-256 SÉCURISÉES (Web Crypto API)
// ============================================================================

async function sha256(str: string): Promise<string> {
  const buf = new TextEncoder().encode(str);
  const hashBuf = await crypto.subtle.digest('SHA-256', buf);
  const hashArr = Array.from(new Uint8Array(hashBuf));
  return hashArr.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function generateSalt(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ============================================================================
// CLASSE DE GESTION DU STOCKAGE
// ============================================================================

class StorageService {
  private notify() {
    window.dispatchEvent(new CustomEvent('ferrari_data_updated'));
  }

  // --- SÉCURITÉ & AUTHENTIFICATION SANS MOT DE PASSE HARDCODÉ ---

  getAdminAccountConfig(): AdminAccountConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ADMIN_CONFIG);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Ignorer
    }
    return { isConfigured: false };
  }

  async setupAdminAccount(
    username: string,
    passwordPlain: string,
    displayName = 'Direction Ferrari Lounge'
  ): Promise<AdminUserSession> {
    const salt = generateSalt();
    const passwordHash = await sha256(salt + passwordPlain);

    const config: AdminAccountConfig = {
      isConfigured: true,
      username: username.trim().toLowerCase(),
      displayName: displayName.trim(),
      passwordHash,
      salt,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.ADMIN_CONFIG, JSON.stringify(config));

    const session: AdminUserSession = {
      username: config.username!,
      displayName: config.displayName!,
      token: 'sess_' + Date.now().toString(36),
    };
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
    this.notify();
    return session;
  }

  async verifyAdminLogin(username: string, passwordPlain: string): Promise<AdminUserSession | null> {
    const config = this.getAdminAccountConfig();
    if (!config.isConfigured || !config.salt || !config.passwordHash) {
      return null;
    }

    if (username.trim().toLowerCase() !== config.username) {
      return null;
    }

    const testHash = await sha256(config.salt + passwordPlain);
    if (testHash === config.passwordHash) {
      config.lastLogin = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.ADMIN_CONFIG, JSON.stringify(config));

      const session: AdminUserSession = {
        username: config.username!,
        displayName: config.displayName || 'Direction Ferrari Lounge',
        token: 'sess_' + Date.now().toString(36),
      };
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
      this.notify();
      return session;
    }

    return null;
  }

  async loginAdmin(username: string, passwordPlain: string): Promise<AdminUserSession | null> {
    return this.verifyAdminLogin(username, passwordPlain);
  }

  hasAdminAccountConfigured(): boolean {
    return this.getAdminAccountConfig().isConfigured;
  }

  getAdminSession(): AdminUserSession | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  logoutAdmin(): void {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    this.notify();
  }

  // --- ÉTABLISSEMENT ---
  getEstablishment(): EstablishmentConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ESTABLISHMENT);
      return data ? JSON.parse(data) : DEFAULT_ESTABLISHMENT;
    } catch {
      return DEFAULT_ESTABLISHMENT;
    }
  }

  saveEstablishment(config: EstablishmentConfig): void {
    localStorage.setItem(STORAGE_KEYS.ESTABLISHMENT, JSON.stringify(config));
    this.notify();
  }

  // --- RÉSERVATIONS DE TABLES (Zéro fausse donnée par défaut) ---
  getReservations(): Reservation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveReservation(r: Omit<Reservation, 'id' | 'createdAt' | 'status'>): Reservation {
    const list = this.getReservations();
    const newRes: Reservation = {
      ...r,
      id: 'res-' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    list.unshift(newRes);
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(list));
    this.notify();
    return newRes;
  }

  updateReservationStatus(id: string, status: Reservation['status'], note?: string): void {
    const list = this.getReservations();
    const idx = list.findIndex((r) => r.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      list[idx].updatedAt = new Date().toISOString();
      if (note !== undefined) list[idx].internalNote = note;
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(list));
      this.notify();
    }
  }

  updateReservationNote(id: string, note: string): void {
    const list = this.getReservations();
    const idx = list.findIndex((r) => r.id === id);
    if (idx !== -1) {
      list[idx].internalNote = note;
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(list));
      this.notify();
    }
  }

  deleteReservation(id: string): void {
    const list = this.getReservations().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(list));
    this.notify();
  }

  // --- COMMANDES ET LIVRAISONS (Zéro fausse donnée par défaut) ---
  getOrders(): DeliveryOrder[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveOrder(o: Omit<DeliveryOrder, 'id' | 'createdAt' | 'status'>): DeliveryOrder {
    const list = this.getOrders();
    const newOrder: DeliveryOrder = {
      ...o,
      id: 'cmd-' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    list.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(list));
    this.notify();
    return newOrder;
  }

  updateOrderStatus(id: string, status: DeliveryOrder['status'], note?: string): void {
    const list = this.getOrders();
    const idx = list.findIndex((o) => o.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      if (note !== undefined) list[idx].internalNote = note;
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(list));
      this.notify();
    }
  }

  deleteOrder(id: string): void {
    const list = this.getOrders().filter((o) => o.id !== id);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(list));
    this.notify();
  }

  // --- PLAT DU JOUR ---
  getDailySpecial(): DailySpecial {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_SPECIAL);
      return data ? JSON.parse(data) : DEFAULT_DAILY_SPECIAL;
    } catch {
      return DEFAULT_DAILY_SPECIAL;
    }
  }

  saveDailySpecial(ds: DailySpecial): void {
    localStorage.setItem(STORAGE_KEYS.DAILY_SPECIAL, JSON.stringify(ds));
    this.notify();
  }

  // --- MENU ---
  getMenuItems(): MenuItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MENU);
      return data ? JSON.parse(data) : DEFAULT_MENU_ITEMS;
    } catch {
      return DEFAULT_MENU_ITEMS;
    }
  }

  saveMenuItem(item: Omit<MenuItem, 'id'> & { id?: string }): MenuItem {
    const list = this.getMenuItems();
    if (item.id) {
      const idx = list.findIndex((m) => m.id === item.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...item };
        localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(list));
        this.notify();
        return list[idx];
      }
    }
    const newItem: MenuItem = {
      ...item,
      id: 'menu-' + Date.now(),
      isActive: item.isActive ?? true,
      isDemo: false,
    };
    list.unshift(newItem);
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(list));
    this.notify();
    return newItem;
  }

  deleteMenuItem(id: string): void {
    const list = this.getMenuItems().filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(list));
    this.notify();
  }

  // --- THÈMES DE TABLE ---
  getTableThemes(): TableTheme[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.THEMES);
      return data ? JSON.parse(data) : DEFAULT_TABLE_THEMES;
    } catch {
      return DEFAULT_TABLE_THEMES;
    }
  }

  saveTableTheme(t: Omit<TableTheme, 'id'> & { id?: string }): TableTheme {
    const list = this.getTableThemes();
    if (t.id) {
      const idx = list.findIndex((item) => item.id === t.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...t };
        localStorage.setItem(STORAGE_KEYS.THEMES, JSON.stringify(list));
        this.notify();
        return list[idx];
      }
    }
    const newTheme: TableTheme = {
      ...t,
      id: 'theme-' + Date.now(),
    };
    list.push(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEMES, JSON.stringify(list));
    this.notify();
    return newTheme;
  }

  deleteTableTheme(id: string): void {
    const list = this.getTableThemes().filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.THEMES, JSON.stringify(list));
    this.notify();
  }

  toggleTableThemeAvailability(id: string): void {
    const list = this.getTableThemes();
    const idx = list.findIndex((t) => t.id === id);
    if (idx !== -1) {
      list[idx].isAvailable = !list[idx].isAvailable;
      localStorage.setItem(STORAGE_KEYS.THEMES, JSON.stringify(list));
      this.notify();
    }
  }

  // --- VÉHICULES (Zéro faux véhicule par défaut) ---
  getVehicles(): Vehicle[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VEHICLES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveVehicle(v: Omit<Vehicle, 'id'> & { id?: string }): Vehicle {
    const list = this.getVehicles();
    if (v.id) {
      const idx = list.findIndex((item) => item.id === v.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...v };
        localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(list));
        this.notify();
        return list[idx];
      }
    }
    const newV: Vehicle = {
      ...v,
      id: 'veh-' + Date.now(),
    };
    list.push(newV);
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(list));
    this.notify();
    return newV;
  }

  deleteVehicle(id: string): void {
    const list = this.getVehicles().filter((v) => v.id !== id);
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(list));
    this.notify();
  }

  // --- DEMANDES DE LOCATION DE VOITURES (Zéro fausse donnée par défaut) ---
  getRentalRequests(): CarRentalRequest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RENTAL_REQUESTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveRentalRequest(r: Omit<CarRentalRequest, 'id' | 'createdAt' | 'status'>): CarRentalRequest {
    const list = this.getRentalRequests();
    const newReq: CarRentalRequest = {
      ...r,
      id: 'loc-' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    list.unshift(newReq);
    localStorage.setItem(STORAGE_KEYS.RENTAL_REQUESTS, JSON.stringify(list));
    this.notify();
    return newReq;
  }

  updateRentalStatus(id: string, status: CarRentalRequest['status'], note?: string): void {
    const list = this.getRentalRequests();
    const idx = list.findIndex((r) => r.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      if (note !== undefined) list[idx].internalNote = note;
      localStorage.setItem(STORAGE_KEYS.RENTAL_REQUESTS, JSON.stringify(list));
      this.notify();
    }
  }

  deleteRentalRequest(id: string): void {
    const list = this.getRentalRequests().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RENTAL_REQUESTS, JSON.stringify(list));
    this.notify();
  }

  // --- DEMANDES DE DÉPANNAGE & ASSISTANCE (Zéro fausse donnée par défaut) ---
  getAssistanceRequests(): RoadsideAssistanceRequest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSISTANCE_REQUESTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveAssistanceRequest(
    a: Omit<RoadsideAssistanceRequest, 'id' | 'createdAt' | 'status'>
  ): RoadsideAssistanceRequest {
    const list = this.getAssistanceRequests();
    const newReq: RoadsideAssistanceRequest = {
      ...a,
      id: 'dep-' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    list.unshift(newReq);
    localStorage.setItem(STORAGE_KEYS.ASSISTANCE_REQUESTS, JSON.stringify(list));
    this.notify();
    return newReq;
  }

  updateAssistanceStatus(id: string, status: RoadsideAssistanceRequest['status'], note?: string): void {
    const list = this.getAssistanceRequests();
    const idx = list.findIndex((a) => a.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      if (note !== undefined) list[idx].internalNote = note;
      localStorage.setItem(STORAGE_KEYS.ASSISTANCE_REQUESTS, JSON.stringify(list));
      this.notify();
    }
  }

  deleteAssistanceRequest(id: string): void {
    const list = this.getAssistanceRequests().filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ASSISTANCE_REQUESTS, JSON.stringify(list));
    this.notify();
  }

  // --- SERVICES AUTOMOBILES MODULAIRES ---
  getAutomotiveServices(): AutomotiveService[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTOMOTIVE_SERVICES);
      return data ? JSON.parse(data) : DEFAULT_AUTOMOTIVE_SERVICES;
    } catch {
      return DEFAULT_AUTOMOTIVE_SERVICES;
    }
  }

  getServices(): ServiceItem[] {
    return [];
  }

  saveService(s: Omit<ServiceItem, 'id'> & { id?: string }): ServiceItem {
    const list = this.getServices();
    if (s.id) {
      const idx = list.findIndex((item) => item.id === s.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...s };
        localStorage.setItem(STORAGE_KEYS.AUTOMOTIVE_SERVICES, JSON.stringify(list));
        this.notify();
        return list[idx];
      }
    }
    const newS: ServiceItem = {
      ...s,
      id: 'srv-' + Date.now(),
    };
    list.push(newS);
    localStorage.setItem(STORAGE_KEYS.AUTOMOTIVE_SERVICES, JSON.stringify(list));
    this.notify();
    return newS;
  }

  toggleServiceActive(id: string): void {
    const list = this.getServices();
    const item = list.find((s) => s.id === id);
    if (item) {
      item.isActive = !item.isActive;
      localStorage.setItem(STORAGE_KEYS.AUTOMOTIVE_SERVICES, JSON.stringify(list));
      this.notify();
    }
  }

  saveAutomotiveService(s: Omit<AutomotiveService, 'id'> & { id?: string }): AutomotiveService {
    const list = this.getAutomotiveServices();
    if (s.id) {
      const idx = list.findIndex((item) => item.id === s.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...s };
        localStorage.setItem(STORAGE_KEYS.AUTOMOTIVE_SERVICES, JSON.stringify(list));
        this.notify();
        return list[idx];
      }
    }
    const newS: AutomotiveService = {
      ...s,
      id: 'srv-' + Date.now(),
    };
    list.push(newS);
    localStorage.setItem(STORAGE_KEYS.AUTOMOTIVE_SERVICES, JSON.stringify(list));
    this.notify();
    return newS;
  }

  deleteAutomotiveService(id: string): void {
    const list = this.getAutomotiveServices().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.AUTOMOTIVE_SERVICES, JSON.stringify(list));
    this.notify();
  }

  toggleMenuItemActive(id: string): void {
    const list = this.getMenuItems();
    const item = list.find((m) => m.id === id);
    if (item) {
      item.isActive = !item.isActive;
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(list));
      this.notify();
    }
  }

  // --- ÉVÉNEMENTS ---
  getEvents(): EventItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return data ? JSON.parse(data) : DEFAULT_EVENTS;
    } catch {
      return DEFAULT_EVENTS;
    }
  }

  saveEvent(e: Omit<EventItem, 'id'> & { id?: string }): EventItem {
    const list = this.getEvents();
    if (e.id) {
      const idx = list.findIndex((item) => item.id === e.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...e };
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(list));
        this.notify();
        return list[idx];
      }
    }
    const newE: EventItem = {
      ...e,
      id: 'evt-' + Date.now(),
    };
    list.push(newE);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(list));
    this.notify();
    return newE;
  }

  deleteEvent(id: string): void {
    const list = this.getEvents().filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(list));
    this.notify();
  }

  // --- GALERIE ---
  getGallery(): GalleryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GALLERY);
      return data ? JSON.parse(data) : DEFAULT_GALLERY;
    } catch {
      return DEFAULT_GALLERY;
    }
  }

  saveGalleryItem(g: Omit<GalleryItem, 'id'> & { id?: string }): GalleryItem {
    const list = this.getGallery();
    if (g.id) {
      const idx = list.findIndex((item) => item.id === g.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...g };
        localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(list));
        this.notify();
        return list[idx];
      }
    }
    const newG: GalleryItem = {
      ...g,
      id: 'gal-' + Date.now(),
    };
    list.push(newG);
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(list));
    this.notify();
    return newG;
  }

  deleteGalleryItem(id: string): void {
    const list = this.getGallery().filter((g) => g.id !== id);
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(list));
    this.notify();
  }

  // --- AVIS CLIENTS (Zéro faux avis par défaut) ---
  getReviews(): CustomerReview[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveReview(r: Omit<CustomerReview, 'id' | 'createdAt' | 'isApproved'>): CustomerReview {
    const list = this.getReviews();
    const newR: CustomerReview = {
      ...r,
      id: 'rev-' + Date.now(),
      isApproved: false, // En attente de validation admin
      createdAt: new Date().toISOString(),
    };
    list.unshift(newR);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(list));
    this.notify();
    return newR;
  }

  updateReviewApproval(id: string, isApproved: boolean): void {
    const list = this.getReviews();
    const idx = list.findIndex((r) => r.id === id);
    if (idx !== -1) {
      list[idx].isApproved = isApproved;
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(list));
      this.notify();
    }
  }

  approveReview(id: string, isApproved: boolean): void {
    this.updateReviewApproval(id, isApproved);
  }

  deleteReview(id: string): void {
    const list = this.getReviews().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(list));
    this.notify();
  }

  // --- MESSAGES DE CONTACT (Zéro faux message par défaut) ---
  getMessages(): ContactMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveMessage(m: Omit<ContactMessage, 'id' | 'createdAt' | 'isTreated'>): ContactMessage {
    const list = this.getMessages();
    const newMsg: ContactMessage = {
      ...m,
      id: 'msg-' + Date.now(),
      isTreated: false,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newMsg);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(list));
    this.notify();
    return newMsg;
  }

  markMessageTreated(id: string, isTreated = true, note?: string): void {
    const list = this.getMessages();
    const msg = list.find((m) => m.id === id);
    if (msg) {
      msg.isTreated = isTreated;
      if (note !== undefined) msg.internalNote = note;
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(list));
      this.notify();
    }
  }

  deleteMessage(id: string): void {
    const list = this.getMessages().filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(list));
    this.notify();
  }

  // --- STATISTIQUES RÉELLES STRICTES (Aucun chiffre inventé) ---
  getRealStats(): RealAdminStats {
    const reservations = this.getReservations();
    const orders = this.getOrders();
    const rentals = this.getRentalRequests();
    const assistance = this.getAssistanceRequests();
    const messages = this.getMessages();
    const reviews = this.getReviews();
    const vehicles = this.getVehicles();
    const menu = this.getMenuItems();

    return {
      totalReservations: reservations.length,
      pendingReservations: reservations.filter((r) => r.status === 'pending').length,
      confirmedReservations: reservations.filter((r) => r.status === 'confirmed').length,
      rejectedReservations: reservations.filter((r) => r.status === 'rejected').length,
      totalOrders: orders.length,
      pendingOrders: orders.filter((o) => o.status === 'pending').length,
      totalRentalRequests: rentals.length,
      pendingRentalRequests: rentals.filter((r) => r.status === 'pending').length,
      totalAssistanceRequests: assistance.length,
      pendingAssistanceRequests: assistance.filter((a) => a.status === 'pending').length,
      totalMessages: messages.length,
      unreadMessages: messages.filter((m) => !m.isTreated).length,
      totalReviews: reviews.length,
      pendingReviews: reviews.filter((r) => !r.isApproved).length,
      totalVehicles: vehicles.length,
      activeVehicles: vehicles.filter((v) => v.isAvailable).length,
      activeMenuItems: menu.filter((m) => m.isActive).length,
    };
  }

  getDashboardStats(): AdminDashboardStats {
    const stats = this.getRealStats();
    return {
      totalReservations: stats.totalReservations,
      pendingReservations: stats.pendingReservations,
      confirmedReservations: stats.confirmedReservations,
      rejectedReservations: stats.rejectedReservations,
      totalOrders: stats.totalOrders,
      pendingOrders: stats.pendingOrders,
      totalMessages: stats.totalMessages,
      unreadMessages: stats.unreadMessages,
      activeMenuItems: stats.activeMenuItems,
      totalReviews: stats.totalReviews,
      pendingReviews: stats.pendingReviews,
    };
  }

  resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.RESERVATIONS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.RENTAL_REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.ASSISTANCE_REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    this.notify();
  }
}

export const storageService = new StorageService();
