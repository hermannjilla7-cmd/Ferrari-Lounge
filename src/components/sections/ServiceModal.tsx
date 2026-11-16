import React, { useEffect } from 'react';
import type { ServiceItem } from '../../types';
import { CloseIcon, CheckIcon, PhoneIcon } from '../common/Icons';
import './ServiceModal.css';

interface ServiceModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onContactClick: () => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  service,
  onClose,
  onContactClick,
}) => {
  // Gestion de la touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (service) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [service, onClose]);

  if (!service) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content card-luxury"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Fermer la boîte de dialogue"
        >
          <CloseIcon size={20} />
        </button>

        {/* Modal Banner Image */}
        <div className="modal-image-wrap">
          <img
            src={service.image}
            alt={service.title}
            className="modal-image"
          />
          <div className="modal-image-overlay" />
          <div className="modal-badge-wrapper">
            <span className="badge-gold">{service.badge || 'Excellence'}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="modal-header-info">
            <span className="modal-tagline">{service.tagline}</span>
            <h2 className="modal-title font-brand">{service.title}</h2>
          </div>

          <p className="modal-description">{service.fullDescription}</p>

          {/* Highlights */}
          <div className="modal-section-block">
            <h3 className="modal-subtitle">Prestations incluses & garanties :</h3>
            <ul className="modal-features-list">
              {service.highlights.concat(service.features || []).map((feat, idx) => (
                <li key={idx} className="modal-feature-item">
                  <span className="feature-check-icon">
                    <CheckIcon size={14} />
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Statut opérationnel transparent */}
          <div className="operational-alert">
            <div className="alert-icon-ring">ℹ</div>
            <div>
              <strong className="alert-title">Information de réservation :</strong>
              <p className="alert-text">
                {service.operationalNotice || service.notice || 'Prestation proposée par Ferrari Lounge 229 by Auto Craze 229 sous réserve de confirmation.'}
              </p>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-gold"
              onClick={() => {
                onClose();
                onContactClick();
              }}
            >
              <span>Contacter notre standard</span>
              <PhoneIcon size={16} />
            </button>
            <button
              type="button"
              className="btn btn-outline-gold"
              onClick={onClose}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
