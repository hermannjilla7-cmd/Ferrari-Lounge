import React, { useState, useEffect } from 'react';
import type { EstablishmentConfig } from '../../types';
import { MenuIcon, CloseIcon, ArrowRightIcon, PhoneIcon } from '../common/Icons';
import './Navbar.css';

interface NavbarProps {
  establishment: EstablishmentConfig;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  establishment,
  onNavigate,
  onOpenAdmin,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Exactement les 9 liens requis dans l'ordre strict imposé :
  // 1. Accueil, 2. Menu, 3. Livraison, 4. Plat du Jour, 5. Réserver, 6. Événements, 7. Galerie, 8. Avis, 9. Contact
  const navLinks = [
    { label: 'Accueil', id: 'hero' },
    { label: 'Menu', id: 'menu' },
    { label: 'Livraison', id: 'livraison' },
    { label: 'Plat du Jour', id: 'plat-du-jour' },
    { label: 'Réserver', id: 'reserver' },
    { label: 'Événements', id: 'evenements' },
    { label: 'Galerie', id: 'galerie' },
    { label: 'Avis', id: 'avis' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        {/* Brand Link avec logo officiel Ferrari Lounge */}
        <a
          href="#hero"
          className="brand-link"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('hero');
          }}
          aria-label={`${establishment.name} - Accueil`}
        >
          <img
            src="/logo-ferrari-shield.jpeg"
            onError={(e) => {
              // Secours vers ferrari-logo.png
              (e.target as HTMLImageElement).src = '/ferrari-logo.png';
            }}
            alt={establishment.name}
            className="brand-logo-img"
          />
          <div className="brand-titles">
            <span className="brand-name font-brand">{establishment.name}</span>
            <span className="brand-signature">{establishment.signature}</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Navigation principale">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.id);
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Header Right Actions */}
        <div className="header-actions">
          <a
            href={`tel:${establishment.phone.replace(/\s+/g, '')}`}
            className="header-phone-link"
            title={`Appeler : ${establishment.phone}`}
          >
            <PhoneIcon size={16} />
            <span className="phone-text">{establishment.phone}</span>
          </a>

          <button
            type="button"
            className="btn btn-red btn-sm header-cta"
            onClick={() => handleLinkClick('reserver')}
          >
            <span>Réserver</span>
            <ArrowRightIcon size={14} />
          </button>

          {/* Discreet Admin Portal Button */}
          <button
            type="button"
            className="admin-portal-pill"
            onClick={onOpenAdmin}
            title="Accès Administration FerrariLounge"
          >
            <span className="admin-pill-dot" />
            <span>Admin</span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {mobileMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <div
        className={`mobile-drawer-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden={!mobileMenuOpen}
      >
        <div
          className="mobile-drawer-panel"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="drawer-header">
            <div className="drawer-brand">
              <img
                src="/logo-ferrari-shield.jpeg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/ferrari-logo.png';
                }}
                alt={establishment.name}
                className="drawer-logo-img"
              />
              <div>
                <span className="font-brand drawer-title">{establishment.name}</span>
                <span className="drawer-signature">{establishment.signature}</span>
              </div>
            </div>
            <button
              type="button"
              className="drawer-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Fermer le menu"
            >
              <CloseIcon size={22} />
            </button>
          </div>

          <div className="drawer-slogan-box">
            <span className="drawer-slogan font-brand">{establishment.slogan}</span>
            <span className="drawer-activity">{establishment.activity}</span>
          </div>

          <nav className="mobile-nav" aria-label="Menu mobile">
            <ul className="mobile-nav-list">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="mobile-nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.id);
                    }}
                  >
                    <span>{link.label}</span>
                    <ArrowRightIcon size={16} className="link-arrow" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="drawer-footer">
            <button
              type="button"
              className="btn btn-red drawer-cta"
              onClick={() => handleLinkClick('reserver')}
            >
              <span>Réserver une table</span>
              <ArrowRightIcon size={16} />
            </button>

            <a
              href={`tel:${establishment.phone.replace(/\s+/g, '')}`}
              className="drawer-phone-btn"
            >
              <PhoneIcon size={16} />
              <span>{establishment.phone}</span>
            </a>

            <button
              type="button"
              className="drawer-admin-link"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
            >
              Accéder à l'Administration FerrariLounge →
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};