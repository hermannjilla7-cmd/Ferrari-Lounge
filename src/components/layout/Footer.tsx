import React from 'react';
import type { EstablishmentConfig } from '../../types';
import { MapPinIcon, PhoneIcon, WhatsappIcon } from '../common/Icons';
import './Footer.css';

interface FooterProps {
  establishment: EstablishmentConfig;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ establishment, onNavigate, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanPhone = establishment.phone.replace(/\s+/g, '');
  const cleanWhatsapp = establishment.whatsapp.replace(/\D/g, '');

  return (
    <footer className="site-footer">
      <div className="footer-top-border" />
      <div className="container footer-container">
        {/* Main Footer Grid */}
        <div className="footer-grid">
          {/* Col 1: Brand & Slogan */}
          <div className="footer-col footer-col-brand">
            <div className="footer-brand">
              <img
                src="/ferrari-logo.png"
                alt={establishment.name}
                className="footer-brand-logo"
              />
              <div>
                <span className="footer-brand-name font-brand">{establishment.name}</span>
                <span className="footer-brand-signature">{establishment.signature}</span>
              </div>
            </div>

            <p className="footer-about-text">
              {establishment.description}
            </p>

            <div className="footer-slogan-pill">
              <span className="footer-dot-live" />
              <span className="font-brand">{establishment.slogan}</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="footer-col">
            <h4 className="footer-col-title font-brand">Navigation</h4>
            <ul className="footer-links-list">
              <li>
                <a
                  href="#hero"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('hero');
                  }}
                >
                  Accueil
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('about');
                  }}
                >
                  À propos
                </a>
              </li>
              <li>
                <a
                  href="#menu"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('menu');
                  }}
                >
                  Menu & Carte
                </a>
              </li>
              <li>
                <a
                  href="#reservations"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('reservations');
                  }}
                >
                  Réservations de tables
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('services');
                  }}
                >
                  Nos services
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('contact');
                  }}
                >
                  Contact & Localisation
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Partners & Schedule */}
          <div className="footer-col">
            <h4 className="footer-col-title font-brand">Horaires</h4>
            <ul className="footer-hours-list">
              {establishment.hours.map((h, i) => (
                <li key={i} className="f-hour-item">
                  <span className="f-hour-day font-brand">{h.dayLabel}</span>
                  <span className={`f-hour-time ${h.isClosed ? 'closed' : ''}`}>
                    {h.schedule}
                  </span>
                </li>
              ))}
            </ul>

            <div className="footer-partner-mini">
              <span className="partner-mini-label">Partenariat :</span>
              <img
                src={establishment.partnerLogos.autoCraze}
                alt="Auto Craze 229"
                className="f-partner-badge"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Col 4: Contact & Admin */}
          <div className="footer-col">
            <h4 className="footer-col-title font-brand">Coordonnées</h4>
            <div className="footer-contact-items">
              <div className="f-contact-row">
                <MapPinIcon size={16} className="f-icon" />
                <span>{establishment.address}</span>
              </div>
              <div className="f-contact-row">
                <PhoneIcon size={16} className="f-icon" />
                <a href={`tel:${cleanPhone}`}>{establishment.phone}</a>
              </div>
              <div className="f-contact-row">
                <WhatsappIcon size={16} className="f-icon whatsapp" />
                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {establishment.phone} (WhatsApp)
                </a>
              </div>
            </div>

            <div className="footer-bottom-actions">
              <button
                type="button"
                className="btn btn-outline-gold btn-sm"
                onClick={scrollToTop}
              >
                <span>Haut de page</span>
                <span className="top-arrow">↑</span>
              </button>

              <button
                type="button"
                className="footer-admin-btn"
                onClick={onOpenAdmin}
              >
                Administration FerrariLounge →
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom Strip */}
        <div className="footer-bottom-strip">
          <div className="footer-copy">
            © {new Date().getFullYear()} <strong>{establishment.name}</strong> {establishment.signature}.
            Tous droits réservés. {establishment.city}, {establishment.country}.
          </div>
          <div className="footer-bottom-links">
            <span>Café - Resto - Lounge</span>
            <span className="sep">•</span>
            <span>{establishment.slogan}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
