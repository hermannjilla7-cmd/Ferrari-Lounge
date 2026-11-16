import React from 'react';
import type { EstablishmentConfig } from '../../types';
import { ShieldCheckIcon, UtensilsIcon, CalendarIcon, CarIcon, ArrowRightIcon } from '../common/Icons';
import './About.css';

interface AboutProps {
  establishment: EstablishmentConfig;
  onReserveClick: () => void;
}

export const About: React.FC<AboutProps> = ({ establishment, onReserveClick }) => {
  const pillars = [
    {
      title: 'Décor & Inspiration Automobile',
      description:
        'Un cadre soigné inspiré de la passion automobile et des paddocks légendaires, alliant finitions contemporaines et ambiance feutrée.',
      icon: <CarIcon size={22} />,
    },
    {
      title: 'Café, Resto & Cocktails',
      description:
        'Une expérience gustative complète : du café matinal aux dîners savoureux, accompagnés d’une sélection de cocktails signatures.',
      icon: <UtensilsIcon size={22} />,
    },
    {
      title: 'Vibration F1 & Soirées Lounge',
      description:
        'Retransmission en direct des courses du championnat de Formule 1 et soirées rythmées par les meilleurs DJ de Cotonou.',
      icon: <CalendarIcon size={22} />,
    },
    {
      title: 'Signature by Auto Craze 229',
      description:
        'Le savoir-faire et l’exigence de notre partenaire Auto Craze 229 au service de la culture automobile et de l’accueil à Akpakpa.',
      icon: <ShieldCheckIcon size={22} />,
    },
  ];

  return (
    <section id="about" className="section-wrapper about-section">
      <div className="about-glow-bg" aria-hidden="true" />
      <div className="container">
        {/* Partner Logos Bar */}
        <div className="partner-strip">
          <span className="partner-label">Partenaires & Inspirations Officielles :</span>
          <div className="partner-logos-group">
            <div className="partner-logo-box">
              <img
                src={establishment.partnerLogos.autoCraze}
                alt="Logo Auto Craze 229"
                className="partner-img"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="partner-subtext">Auto Craze 229</span>
            </div>

            <div className="partner-divider" />

            <div className="partner-logo-box">
              <img
                src={establishment.partnerLogos.f1}
                alt="Logo F1 Formula 1"
                className="partner-img"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="partner-subtext">Passion F1</span>
            </div>
          </div>
        </div>

        <div className="about-grid">
          {/* About Text Left */}
          <div className="about-content">
            <div className="section-tag">
              <span className="section-tag-dot" />
              <span>À Propos de Notre Établissement</span>
            </div>

            <h2 className="section-title">
              L'élégance contemporaine <br />
              <span className="heading-red">au cœur d'Akpakpa</span>
            </h2>

            <div className="gold-divider" />

            <p className="about-lead">
              <strong>Ferrari Lounge 229</strong> est un établissement situé à Akpakpa, Cotonou, au
              Bénin. Son décor est inspiré de l'univers Ferrari, mêlant caractère automobile et
              élégance contemporaine.
            </p>

            <p className="about-body">
              Porté par la signature <strong>by Auto Craze 229</strong> et son mot d'ordre{' '}
              <em>« Race. Eat. Drink. Dance. »</em>, notre espace a été pensé pour réunir en un seul
              lieu les amateurs de bonne chère, de convivialité et de sport automobile. Que vous
              veniez pour un déjeuner professionnel, un verre en terrasse ou une soirée animée,
              notre équipe veille à chaque détail.
            </p>

            <div className="about-cta-wrap">
              <button
                type="button"
                className="btn btn-red"
                onClick={onReserveClick}
              >
                <span>Réserver votre table</span>
                <ArrowRightIcon size={16} />
              </button>
            </div>
          </div>

          {/* About Pillars Grid Right */}
          <div className="about-pillars">
            <div className="pillars-grid">
              {pillars.map((pillar, idx) => (
                <div key={idx} className="card-glass pillar-card">
                  <div className="pillar-icon-box">{pillar.icon}</div>
                  <h3 className="pillar-title font-brand">{pillar.title}</h3>
                  <p className="pillar-desc">{pillar.description}</p>
                </div>
              ))}
            </div>

            {/* Quick Summary Strip */}
            <div className="card-luxury about-stat-strip">
              <div className="strip-item">
                <span className="strip-val font-brand">Akpakpa</span>
                <span className="strip-label">Cotonou, Bénin</span>
              </div>
              <div className="strip-divider" />
              <div className="strip-item">
                <span className="strip-val font-brand">F1 & DJ</span>
                <span className="strip-label">Soirées & Retransmissions</span>
              </div>
              <div className="strip-divider" />
              <div className="strip-item">
                <span className="strip-val font-brand">Auto Craze</span>
                <span className="strip-label">Signature Partenaire</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
