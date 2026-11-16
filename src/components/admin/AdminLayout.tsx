import React, { useState } from 'react';
import type {
  AdminUser,
  AdminDashboardStats,
  Reservation,
  TableTheme,
  MenuItem,
  ServiceItem,
  ContactMessage,
  EstablishmentConfig,
} from '../../types';
import { storageService } from '../../services/storageService';
import { AdminDashboard } from './AdminDashboard';
import { AdminReservations } from './AdminReservations';
import { AdminOrders } from './AdminOrders';
import { AdminMenu } from './AdminMenu';
import { AdminDailySpecial } from './AdminDailySpecial';
import { AdminRental } from './AdminRental';
import { AdminAssistance } from './AdminAssistance';
import { AdminEvents } from './AdminEvents';
import { AdminGallery } from './AdminGallery';
import { AdminReviews } from './AdminReviews';
import { AdminThemes } from './AdminThemes';
import { AdminServices } from './AdminServices';
import { AdminMessages } from './AdminMessages';
import { AdminSettings } from './AdminSettings';
import { MenuIcon, CloseIcon } from '../common/Icons';
import './AdminLayout.css';

interface AdminLayoutProps {
  user: AdminUser;
  stats: AdminDashboardStats;
  reservations: Reservation[];
  themes: TableTheme[];
  menuItems: MenuItem[];
  services: ServiceItem[];
  messages: ContactMessage[];
  establishment: EstablishmentConfig;
  onLogout: () => void;
  onBackToSite: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  user,
  stats,
  reservations,
  themes,
  menuItems,
  services,
  messages,
  establishment,
  onLogout,
  onBackToSite,
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Vue d’ensemble', icon: '📊' },
    {
      id: 'reservations',
      label: 'Réservations',
      icon: '📅',
      badge: stats.pendingReservations > 0 ? stats.pendingReservations : undefined,
      badgeType: 'red',
    },
    {
      id: 'orders',
      label: 'Commandes & Livraisons',
      icon: '🧾',
      badge: stats.pendingOrders > 0 ? stats.pendingOrders : undefined,
      badgeType: 'red',
    },
    { id: 'menu', label: 'Carte & Menu', icon: '🍽' },
    { id: 'daily-special', label: 'Plat du jour', icon: '⭐' },
    { id: 'events', label: 'Événements & F1', icon: '🏎' },
    { id: 'gallery', label: 'Galerie Photos', icon: '🖼' },
    { id: 'reviews', label: 'Avis Clients', icon: '💬' },
    { id: 'cars', label: 'Location de voitures', icon: '🚗' },
    { id: 'assistance', label: 'Dépannage 24/7', icon: '🛠' },
    { id: 'services', label: 'Services automobiles', icon: '⚙' },
    { id: 'themes', label: 'Thèmes de Table', icon: '🛋' },
    {
      id: 'messages',
      label: 'Messages',
      icon: '✉',
      badge: stats.unreadMessages > 0 ? stats.unreadMessages : undefined,
      badgeType: 'gold',
    },
    { id: 'settings', label: 'Paramètres', icon: '⚙' },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  const handleUpdateReservationStatus = (id: string, status: Reservation['status']) => {
    storageService.updateReservationStatus(id, status);
  };

  const handleMarkMessageTreated = (id: string) => {
    storageService.markMessageTreated(id, true);
  };

  return (
    <div className="admin-shell">
      {/* Admin Topbar */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <button
            type="button"
            className="admin-mobile-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Menu latéral"
          >
            {sidebarOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>

          <div className="admin-topbar-brand">
            <img
              src="/logo-ferrari-shield.jpeg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/ferrari-logo.png';
              }}
              alt="Ferrari Lounge"
              className="admin-topbar-logo"
            />
            <div>
              <span className="font-brand admin-brand-name">Administration FerrariLounge</span>
              <span className="admin-brand-sub">Ferrari Lounge 229 • by Auto Craze 229</span>
            </div>
          </div>
        </div>

        <div className="admin-topbar-right">
          <div className="admin-user-pill">
            <span className="user-avatar-circle">👤</span>
            <div className="user-details-mini">
              <span className="user-display-name">{user.name}</span>
              <span className="user-role-tag">Superadmin</span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline-gold btn-sm admin-topbar-btn"
            onClick={onBackToSite}
          >
            <span>Voir le site public</span>
            <span>↗</span>
          </button>

          <button
            type="button"
            className="btn btn-outline-red btn-sm admin-topbar-btn"
            onClick={onLogout}
          >
            <span>Déconnexion</span>
          </button>
        </div>
      </header>

      <div className="admin-main-container">
        {/* Admin Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-section-label">MODULES D'ADMINISTRATION</div>
          <nav className="admin-sidebar-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`sidebar-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
                {tab.badge && (
                  <span className={`tab-counter ${tab.badgeType === 'red' ? 'badge-red' : 'badge-gold'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="sidebar-bottom-info card-glass">
            <span className="info-badge">Akpakpa • Cotonou</span>
            <p className="info-txt">
              Gestion centralisée Ferrari Lounge 229 & Auto Craze 229.
            </p>
            <button
              type="button"
              className="sidebar-quick-site-link"
              onClick={onBackToSite}
            >
              ← Retour au site public
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Content Area */}
        <main className="admin-content-area">
          {activeTab === 'dashboard' && (
            <AdminDashboard
              stats={stats}
              recentReservations={reservations}
              recentMessages={messages}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onUpdateReservationStatus={handleUpdateReservationStatus}
              onMarkMessageTreated={handleMarkMessageTreated}
            />
          )}

          {activeTab === 'reservations' && (
            <AdminReservations reservations={reservations} />
          )}

          {activeTab === 'orders' && <AdminOrders />}

          {activeTab === 'menu' && <AdminMenu menuItems={menuItems} />}

          {activeTab === 'daily-special' && <AdminDailySpecial />}

          {activeTab === 'events' && <AdminEvents />}

          {activeTab === 'gallery' && <AdminGallery />}

          {activeTab === 'reviews' && <AdminReviews />}

          {activeTab === 'cars' && <AdminRental />}

          {activeTab === 'assistance' && <AdminAssistance />}

          {activeTab === 'services' && <AdminServices services={services} />}

          {activeTab === 'themes' && <AdminThemes themes={themes} />}

          {activeTab === 'messages' && <AdminMessages messages={messages} />}

          {activeTab === 'settings' && (
            <AdminSettings establishment={establishment} />
          )}
        </main>
      </div>
    </div>
  );
};