import React from 'react';
import type { DailySpecial } from '../../types';
import { UtensilsIcon, CalendarIcon, ArrowRightIcon } from '../common/Icons';
import './PlatDuJour.css';

interface PlatDuJourProps {
  dailySpecial: DailySpecial;
  onOrderClick: () => void;
  onReserveClick: () => void;
}

export const PlatDuJour: React.FC<PlatDuJourProps> = ({
  dailySpecial,
  onOrderClick,
  onReserveClick,
}) => {
  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('fr-FR').format(p) + ' FCFA';
  };

  const formattedDate = new Date(dailySpecial.availableDate || Date.now()).toLocaleDateString(
    'fr-FR',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );

  return (
    <section id="plat-du-jour" className="section-wrapper plat-section">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mx-auto plat-header">
          <div className="section-tag">
            <UtensilsIcon size={14} />
            <span>Suggestion Quotidienne</span>
          </div>

          <h2 className="section-title">
            Le Plat du Jour du Chef <br />
            <span className="heading-red">Fraîcheur & Excellence</span>
          </h2>

          <p className="section-description mx-auto">
            Chaque jour, nos chefs sélectionnent les meilleurs arrivages du marché pour créer une
            suggestion gastronomique éphémère.
          </p>

          <div className="gold-divider center" />
        </div>

        {dailySpecial.isActive ? (
          <div className="card-luxury plat-card">
            <div className="plat-visual-wrap">
              <img
                src={dailySpecial.image}
                alt={dailySpecial.title}
                className="plat-img"
              />
              <div className="plat-img-overlay" />
              <div className="plat-badge-pill">
                <span className="section-tag-dot" />
                <span>Suggestion du jour • {formattedDate}</span>
              </div>
            </div>

            <div className="plat-content">
              <div className="plat-meta-row">
                <span className="plat-availability-tag badge-green">Disponible ce jour</span>
                <span className="plat-price font-brand">{formatPrice(dailySpecial.price)}</span>
              </div>

              <h3 className="plat-title font-brand">{dailySpecial.title}</h3>

              <p className="plat-desc">{dailySpecial.description}</p>

              {dailySpecial.chefNote && (
                <div className="plat-chef-note card-glass">
                  <span className="chef-icon">👨‍🍳</span>
                  <div>
                    <strong>Le mot du Chef :</strong>
                    <p>{dailySpecial.chefNote}</p>
                  </div>
                </div>
              )}

              <div className="plat-actions-row">
                <button
                  type="button"
                  className="btn btn-red"
                  onClick={onOrderClick}
                >
                  <span>Commander en livraison</span>
                  <ArrowRightIcon size={16} />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-gold"
                  onClick={onReserveClick}
                >
                  <CalendarIcon size={16} />
                  <span>Réserver une table pour ce midi / soir</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card-luxury plat-empty-box">
            <span className="empty-icon">🍽️</span>
            <h3 className="empty-title font-brand">Plat du Jour en Préparation</h3>
            <p className="empty-desc">
              Le Chef annonce la suggestion du jour chaque matin à 10h00. Consultez notre carte
              complète ou contactez notre standard pour connaître la spécialité du moment.
            </p>
            <a href="tel:+2290142688837" className="btn btn-outline-red btn-sm">
              Appeler le standard au +229 01 42 68 88 37
            </a>
          </div>
        )}
      </div>
    </section>
  );
};
