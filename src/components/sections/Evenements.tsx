import React from 'react';
import type { EventItem } from '../../types';
import { ArrowRightIcon } from '../common/Icons';
import './Evenements.css';

interface EvenementsProps {
  events: EventItem[];
  onReserveForEvent: (eventTitle: string) => void;
}

export const Evenements: React.FC<EvenementsProps> = ({ events, onReserveForEvent }) => {
  const activeEvents = events.filter((e) => e.isActive);

  return (
    <section id="evenements" className="section-wrapper evenements-section">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mx-auto evenements-header">
          <div className="section-tag">
            <span className="section-tag-dot" />
            <span>Race. Eat. Drink. Dance.</span>
          </div>

          <h2 className="section-title">
            Événements & Soirées F1 <br />
            <span className="heading-red">Vibrations Motorsport</span>
          </h2>

          <p className="section-description mx-auto">
            Vivez l'adrénaline des Grands Prix de Formule 1 en direct et prolongez vos soirées au
            rythme des sets DJ et soirées thématiques exclusives.
          </p>

          <div className="gold-divider center" />
        </div>

        {/* Events Cards Grid */}
        <div className="evenements-grid">
          {activeEvents.map((evt) => (
            <article key={evt.id} className="card-luxury event-card">
              <div className="event-img-wrap">
                <img src={evt.image} alt={evt.title} className="event-img" loading="lazy" />
                <div className="event-img-overlay" />
                <span className="event-category-badge badge-red">
                  {evt.category === 'f1_grand_prix' ? 'Formule 1 en Direct' : 'Soirée DJ & Lounge'}
                </span>
              </div>

              <div className="event-content">
                <div className="event-timing-row">
                  <span className="event-date">📅 {evt.date}</span>
                  <span className="event-time">⏰ {evt.time}</span>
                </div>

                <h3 className="event-title font-brand">{evt.title}</h3>
                <p className="event-desc">{evt.description}</p>

                <div className="event-footer">
                  <button
                    type="button"
                    className="btn btn-outline-red btn-sm event-btn"
                    onClick={() => onReserveForEvent(evt.title)}
                  >
                    <span>Réserver pour cet événement</span>
                    <ArrowRightIcon size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
