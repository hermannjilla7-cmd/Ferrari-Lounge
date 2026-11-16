import React from 'react';
import type { EstablishmentConfig } from '../../types';
import { ArrowRightIcon, CalendarIcon } from '../common/Icons';
import './Hero.css';

interface HeroProps {
  establishment: EstablishmentConfig;
  onDiscover: () => void;
  onReserve: () => void;
}

export const Hero: React.FC<HeroProps> = ({ establishment, onDiscover, onReserve }) => {
  return (
    <section id="hero" className="hero-section">
      {/* Grand logo Ferrari Lounge en arrière-plan avec effet filigrane et aura rouge course */}
      <div className="hero-bg-logo-wrapper" aria-hidden="true">
        <div className="hero-bg-logo-glow" />
        <img
          src="/logo-ferrari-shield.jpeg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/ferrari-logo.png';
          }}
          alt=""
          className="hero-bg-logo-image"
        />
        <div className="hero-bg-logo-vignette" />
      </div>

      {/* Atmospheric lighting */}
      <div className="hero-glow-top" aria-hidden="true" />
      <div className="hero-glow-gold" aria-hidden="true" />

      <div className="container hero-container">
        <div className="hero-grid">
          {/* Hero Content Left */}
          <div className="hero-content">
            {/* Tag Badge */}
            <div className="section-tag">
              <span className="section-tag-dot" />
              <span>{establishment.activity} • Akpakpa, Cotonou</span>
            </div>

            {/* Signature by Auto Craze 229 */}
            <div className="hero-signature-wrap">
              <span className="signature-prefix">Présenté par</span>
              <span className="signature-brand font-brand">{establishment.signature}</span>
            </div>

            {/* Main Brand Title */}
            <h1 className="hero-title">
              <span className="hero-brand-name">Ferrari <span className="heading-red">Lounge</span></span>
              <span className="hero-slogan-highlight">{establishment.slogan}</span>
            </h1>

            <div className="gold-divider" />

            <p className="hero-description">
              {establishment.description}
            </p>

            {/* CTA Buttons */}
            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-red hero-btn"
                onClick={onReserve}
              >
                <CalendarIcon size={18} />
                <span>Réserver une table</span>
              </button>

              <button
                type="button"
                className="btn btn-outline-gold hero-btn"
                onClick={onDiscover}
              >
                <span>Découvrir l'univers</span>
                <ArrowRightIcon size={18} />
              </button>
            </div>

            {/* Quick Pillars */}
            <div className="hero-features">
              <div className="hero-feature-item">
                <span className="feature-dot" />
                <span>Cuisine & Cocktails</span>
              </div>
              <div className="hero-feature-item">
                <span className="feature-dot" />
                <span>Ambiance F1 & Lounge</span>
              </div>
              <div className="hero-feature-item">
                <span className="feature-dot" />
                <span>Soirées & DJ Sets</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Right: Automobile & Lounge Ambiance */}
          <div className="hero-visual">
            <div className="hero-visual-frame">
              <div className="visual-halo" aria-hidden="true" />

              <div className="car-image-container">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
                  alt="Ambiance Ferrari Lounge 229"
                  className="car-image"
                  loading="eager"
                />
                <div className="car-image-overlay" />
              </div>

              {/* Floating Badge 1: Slogan */}
              <div className="floating-card floating-card-top card-glass">
                <div className="badge-icon-wrap red">
                  <span className="badge-race-icon">🏎️</span>
                </div>
                <div>
                  <div className="floating-label font-brand">Race. Eat. Drink. Dance.</div>
                  <div className="floating-sub">Akpakpa, Cotonou • Bénin</div>
                </div>
              </div>

              {/* Floating Badge 2: Partner */}
              <div className="floating-card floating-card-bottom card-glass">
                <img
                  src="/logo-auto-craze.jpeg"
                  alt="Auto Craze 229"
                  className="partner-floating-logo"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div>
                  <div className="floating-label font-brand">by Auto Craze 229</div>
                  <div className="floating-sub">Signature Motorsport</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
