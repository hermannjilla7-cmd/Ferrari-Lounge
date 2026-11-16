import React from 'react';
import type { ServiceItem } from '../../types';
import { UtensilsIcon, CalendarIcon, CarIcon, ArrowRightIcon } from '../common/Icons';
import './Services.css';

interface ServicesProps {
  services: ServiceItem[];
  onSelectService?: (service: ServiceItem) => void;
  onReserveClick: () => void;
}

export const Services: React.FC<ServicesProps> = ({ services, onSelectService, onReserveClick }) => {
  // Affiche uniquement les services actifs
  const activeServices = services.filter((s) => s.isActive);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'restaurant':
        return <UtensilsIcon size={20} />;
      case 'events':
        return <CalendarIcon size={20} />;
      case 'lounge':
        return <UtensilsIcon size={20} />;
      case 'automotive':
        return <CarIcon size={20} />;
      default:
        return <UtensilsIcon size={20} />;
    }
  };

  return (
    <section id="services" className="section-wrapper services-section">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mx-auto services-header">
          <div className="section-tag">
            <span className="section-tag-dot" />
            <span>Nos Domaines & Expériences</span>
          </div>

          <h2 className="section-title">
            Prestations de Prestige <br />
            <span className="heading-red">by Auto Craze 229</span>
          </h2>

          <p className="section-description mx-auto">
            Une offre modulaire pensée pour conjuguer convivialité, gastronomie, retransmissions
            sportives F1 et accueil d'exception à Akpakpa, Cotonou.
          </p>

          <div className="gold-divider center" />
        </div>

        {activeServices.length === 0 ? (
          <div className="menu-empty-state">
            <p>Aucune donnée pour le moment.</p>
          </div>
        ) : (
          <div className="services-grid">
            {activeServices.map((service) => (
              <article key={service.id} className="card-luxury service-card">
                <div className="service-card-media">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="service-card-img"
                    loading="lazy"
                  />
                  <div className="service-card-overlay" />

                  <div className="service-icon-badge">{getCategoryIcon(service.category)}</div>
                </div>

                <div className="service-card-content">
                  <span className="service-card-tagline">{service.tagline}</span>
                  <h3 className="service-card-title font-brand">{service.title}</h3>
                  <p className="service-card-desc">{service.shortDescription}</p>

                  <ul className="service-highlights-preview">
                    {service.highlights.map((item, idx) => (
                      <li key={idx} className="preview-item">
                        <span className="preview-dot" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {service.notice && (
                    <div className="service-notice-pill">
                      <span>ℹ {service.notice}</span>
                    </div>
                  )}

                  <div className="service-card-footer">
                    <button
                      type="button"
                      className="btn btn-outline-red service-btn"
                      onClick={() => {
                        if (onSelectService) {
                          onSelectService(service);
                        } else {
                          onReserveClick();
                        }
                      }}
                    >
                      <span>En savoir plus / Réserver</span>
                      <ArrowRightIcon size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
