import React, { useState } from 'react';
import type { EstablishmentConfig } from '../../types';
import { storageService } from '../../services/storageService';
import {
  PhoneIcon,
  WhatsappIcon,
  MapPinIcon,
  ClockIcon,
  CheckIcon,
  ArrowRightIcon,
} from '../common/Icons';
import './Contact.css';

interface ContactProps {
  establishment: EstablishmentConfig;
}

export const Contact: React.FC<ContactProps> = ({ establishment }) => {
  const [fullName, setFullName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [subject, setSubject] = useState('Renseignement général');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneOrEmail.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      storageService.saveMessage({
        fullName: fullName.trim(),
        phoneOrEmail: phoneOrEmail.trim(),
        subject,
        message: message.trim(),
      });
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFullName('');
    setPhoneOrEmail('');
    setMessage('');
  };

  const cleanPhone = establishment.phone.replace(/\s+/g, '');
  const cleanWhatsapp = establishment.whatsapp.replace(/\D/g, '');

  return (
    <section id="contact" className="section-wrapper contact-section">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mx-auto contact-header">
          <div className="section-tag">
            <span className="section-tag-dot" />
            <span>Localisation & Contact</span>
          </div>

          <h2 className="section-title">
            Retrouvez-nous à <br />
            <span className="heading-red">Akpakpa, Cotonou</span>
          </h2>

          <p className="section-description mx-auto">
            Une situation privilégiée à Akpakpa. Retrouvez l'ensemble de nos coordonnées officielles
            pour nous joindre, nous rendre visite ou échanger par message.
          </p>

          <div className="gold-divider center" />
        </div>

        {/* Contact Layout */}
        <div className="contact-grid">
          {/* Left Column: Official Contact Slots & Actions */}
          <div className="contact-info-col">
            <h3 className="info-col-title font-brand">Coordonnées Officielles</h3>

            {/* Direct Action Buttons Strip */}
            <div className="direct-actions-bar">
              <a href={`tel:${cleanPhone}`} className="btn btn-red direct-btn">
                <PhoneIcon size={18} />
                <span>Appeler</span>
              </a>

              <a
                href={`https://wa.me/${cleanWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp direct-btn"
              >
                <WhatsappIcon size={18} />
                <span>WhatsApp</span>
              </a>

              <a
                href={establishment.mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-gold direct-btn"
              >
                <MapPinIcon size={18} />
                <span>Itinéraire</span>
              </a>
            </div>

            <div className="contact-cards-stack">
              {/* Téléphone */}
              <div className="card-luxury contact-slot-card">
                <div className="slot-icon-box">
                  <PhoneIcon size={22} />
                </div>
                <div className="slot-details">
                  <span className="slot-label">Standard Téléphonique</span>
                  <a href={`tel:${cleanPhone}`} className="slot-value font-brand">
                    {establishment.phone}
                  </a>
                  <span className="slot-hint">Ligne directe pour réservations et renseignements</span>
                </div>
              </div>

              {/* Adresse */}
              <div className="card-luxury contact-slot-card">
                <div className="slot-icon-box">
                  <MapPinIcon size={22} />
                </div>
                <div className="slot-details">
                  <span className="slot-label">Adresse & Accès</span>
                  <div className="slot-value font-brand">{establishment.address}</div>
                  <span className="slot-hint">Akpakpa, Cotonou — République du Bénin</span>
                </div>
              </div>
            </div>

            {/* Horaires d'ouverture officiels */}
            <div className="card-glass hours-box">
              <div className="hours-header">
                <div className="slot-icon-box sm">
                  <ClockIcon size={18} />
                </div>
                <div>
                  <h4 className="hours-title font-brand">Horaires d'Ouverture</h4>
                  <span className="hours-sub">Accueil Café, Restaurant et Soirées Lounge</span>
                </div>
              </div>

              <div className="hours-list">
                {establishment.hours.map((h, i) => (
                  <div key={i} className="hour-item">
                    <span className="hour-department font-brand">{h.dayLabel} :</span>
                    <span className={`hour-schedule ${h.isClosed ? 'closed' : ''}`}>
                      {h.schedule}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="contact-form-col">
            <div className="card-luxury form-container">
              <div className="form-head">
                <h3 className="form-title font-brand">Nous Écrire un Message</h3>
                <p className="form-subtitle">
                  Remplissez ce formulaire pour formuler une demande particulière, organiser un
                  événement privé ou échanger avec la direction.
                </p>
              </div>

              {submitted ? (
                <div className="form-success-box">
                  <div className="success-icon-wrap">
                    <CheckIcon size={28} />
                  </div>
                  <h4 className="success-title font-brand">Message Enregistré</h4>
                  <p className="success-desc">
                    Merci <strong>{fullName}</strong>. Votre message a bien été transmis à l'équipe de
                    direction de Ferrari Lounge 229.
                  </p>
                  <p className="success-sub">
                    Nous vous répondrons dans les meilleurs délais sur vos coordonnées ({phoneOrEmail}).
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline-red"
                    onClick={handleReset}
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="inquiry-form">
                  <div className="form-group">
                    <label htmlFor="c-name" className="form-label">
                      Nom complet <span className="req">*</span>
                    </label>
                    <input
                      id="c-name"
                      type="text"
                      required
                      placeholder="Ex: M. Aristide K."
                      className="form-input"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="c-contact" className="form-label">
                      Numéro de téléphone ou Email <span className="req">*</span>
                    </label>
                    <input
                      id="c-contact"
                      type="text"
                      required
                      placeholder="Ex: +229 01 42 68 88 37 ou contact@exemple.bj"
                      className="form-input"
                      value={phoneOrEmail}
                      onChange={(e) => setPhoneOrEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="c-subject" className="form-label">
                      Sujet de votre démarche
                    </label>
                    <select
                      id="c-subject"
                      className="form-select"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    >
                      <option value="Renseignement général">Renseignement général</option>
                      <option value="Privatisation & Événement">Privatisation & Événement VIP</option>
                      <option value="Soirée F1 / DJ">Soirée F1 / Retransmission Grand Prix</option>
                      <option value="Partenariat Auto Craze">Partenariat & Mobilité</option>
                      <option value="Autre demande">Autre demande</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="c-msg" className="form-label">
                      Votre Message <span className="req">*</span>
                    </label>
                    <textarea
                      id="c-msg"
                      rows={4}
                      required
                      placeholder="Décrivez votre demande en quelques lignes..."
                      className="form-textarea"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-red form-submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span>Transmission en cours...</span>
                    ) : (
                      <>
                        <span>Transmettre mon message</span>
                        <ArrowRightIcon size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
