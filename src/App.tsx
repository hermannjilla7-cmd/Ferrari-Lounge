import { useState, useEffect } from 'react';
import type {
  EstablishmentConfig,
  Reservation,
  TableTheme,
  MenuItem,
  ServiceItem,
  ContactMessage,
  AdminUser,
  DailySpecial,
  EventItem,
  GalleryItem,
  CustomerReview,
  Vehicle,
} from './types';
import { storageService } from './services/storageService';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Menu } from './components/sections/Menu';
import { Livraison } from './components/sections/Livraison';
import { PlatDuJour } from './components/sections/PlatDuJour';
import { ReservationSection } from './components/sections/Reservation';
import { Evenements } from './components/sections/Evenements';
import { Galerie } from './components/sections/Galerie';
import { Avis } from './components/sections/Avis';
import { AutomotiveServices } from './components/sections/AutomotiveServices';
import { Contact } from './components/sections/Contact';
import { ServiceModal } from './components/sections/ServiceModal';

import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';

import './App.css';

type AppView = 'public' | 'admin' | 'admin-login';

function App() {
  const [view, setView] = useState<AppView>('public');
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  const [establishment, setEstablishment] = useState<EstablishmentConfig>(storageService.getEstablishment());
  const [reservations, setReservations] = useState<Reservation[]>(storageService.getReservations());
  const [themes, setThemes] = useState<TableTheme[]>(storageService.getTableThemes());
  const [menuItems, setMenuItems] = useState<MenuItem[]>(storageService.getMenuItems());
  const [services, setServices] = useState<ServiceItem[]>(storageService.getServices());
  const [dailySpecial, setDailySpecial] = useState<DailySpecial>(storageService.getDailySpecial());
  const [events, setEvents] = useState<EventItem[]>(storageService.getEvents());
  const [gallery, setGallery] = useState<GalleryItem[]>(storageService.getGallery());
  const [reviews, setReviews] = useState<CustomerReview[]>(storageService.getReviews());
  const [messages, setMessages] = useState<ContactMessage[]>(storageService.getMessages());
  const [vehicles, setVehicles] = useState<Vehicle[]>(storageService.getVehicles());

  const [selectedServiceModal, setSelectedServiceModal] = useState<ServiceItem | null>(null);

  const refreshData = () => {
    setEstablishment(storageService.getEstablishment());
    setReservations(storageService.getReservations());
    setThemes(storageService.getTableThemes());
    setMenuItems(storageService.getMenuItems());
    setServices(storageService.getServices());
    setDailySpecial(storageService.getDailySpecial());
    setEvents(storageService.getEvents());
    setGallery(storageService.getGallery());
    setReviews(storageService.getReviews());
    setMessages(storageService.getMessages());
    setVehicles(storageService.getVehicles());
  };

  useEffect(() => {
    const session = storageService.getAdminSession();
    if (session) {
      setCurrentUser({ name: session.displayName, username: session.username, role: 'Superadmin' });
    }

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#admin')) {
        const currentSession = storageService.getAdminSession();
        if (currentSession) {
          setCurrentUser({ name: currentSession.displayName, username: currentSession.username, role: 'Superadmin' });
          setView('admin');
        } else {
          setView('admin-login');
        }
      } else {
        setView('public');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('ferrari_data_updated', refreshData);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('ferrari_data_updated', refreshData);
    };
  }, []);

  const scrollToSection = (id: string) => {
    if (view !== 'public') {
      setView('public');
      window.location.hash = `#${id}`;
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAdmin = () => {
    const session = storageService.getAdminSession();
    if (session) {
      setCurrentUser({ name: session.displayName, username: session.username, role: 'Superadmin' });
      setView('admin');
      window.location.hash = '#admin';
    } else {
      setView('admin-login');
      window.location.hash = '#admin/login';
    }
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setCurrentUser(user);
    setView('admin');
    window.location.hash = '#admin';
  };

  const handleLogout = () => {
    storageService.logoutAdmin();
    setCurrentUser(null);
    setView('public');
    window.location.hash = '#';
  };

  const handleBackToPublic = () => {
    setView('public');
    window.location.hash = '#';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view === 'admin-login') {
    return <AdminLogin onSuccess={handleLoginSuccess} onBackToSite={handleBackToPublic} />;
  }

  if (view === 'admin' && currentUser) {
    const stats = storageService.getDashboardStats();
    return (
      <AdminLayout
        user={currentUser}
        stats={stats}
        reservations={reservations}
        themes={themes}
        menuItems={menuItems}
        services={services}
        messages={messages}
        establishment={establishment}
        onLogout={handleLogout}
        onBackToSite={handleBackToPublic}
      />
    );
  }

  return (
    <div className="app-root">
      {/* Barre de navigation avec les 9 liens requis et le numéro de téléphone */}
      <Navbar establishment={establishment} onNavigate={scrollToSection} onOpenAdmin={handleOpenAdmin} />

      <main>
        {/* 1. Accueil */}
        <Hero
          establishment={establishment}
          onDiscover={() => scrollToSection('about')}
          onReserve={() => scrollToSection('reserver')}
        />

        {/* Présentation / Univers Ferrari Lounge */}
        <About
          establishment={establishment}
          onReserveClick={() => scrollToSection('reserver')}
        />

        {/* 2. Menu */}
        <Menu
          items={menuItems}
          onReserveClick={() => scrollToSection('reserver')}
        />

        {/* 3. Livraison */}
        <Livraison menuItems={menuItems} />

        {/* 4. Plat du Jour */}
        <PlatDuJour
          dailySpecial={dailySpecial}
          onOrderClick={() => scrollToSection('livraison')}
          onReserveClick={() => scrollToSection('reserver')}
        />

        {/* 5. Réserver */}
        <ReservationSection themes={themes} />

        {/* 6. Événements */}
        <Evenements
          events={events}
          onReserveForEvent={() => scrollToSection('reserver')}
        />

        {/* 7. Galerie */}
        <Galerie galleryItems={gallery} />

        {/* 8. Avis */}
        <Avis reviews={reviews} />

        {/* Pôle Mobilité & Expertise : Location de voitures & Dépannage */}
        <AutomotiveServices vehicles={vehicles} />

        {/* 9. Contact */}
        <Contact establishment={establishment} />
      </main>

      <Footer
        establishment={establishment}
        onNavigate={scrollToSection}
        onOpenAdmin={handleOpenAdmin}
      />

      {selectedServiceModal && (
        <ServiceModal
          service={selectedServiceModal}
          onClose={() => setSelectedServiceModal(null)}
          onContactClick={() => scrollToSection('reserver')}
        />
      )}
    </div>
  );
}

export default App;