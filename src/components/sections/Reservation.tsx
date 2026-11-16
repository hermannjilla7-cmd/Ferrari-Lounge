import React, { useState } from 'react';
import type { TableTheme, Reservation } from '../../types';
import { storageService } from '../../services/storageService';
import { CalendarIcon, CheckIcon, ArrowRightIcon } from '../common/Icons';
import './Reservation.css';

interface ReservationProps {
  themes: TableTheme[];
}

export const ReservationSection: React.FC<ReservationProps> = ({ themes }) => {
  // Thèmes actifs uniquement
  const availableThemes = themes.filter((t) => t.isAvailable);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guestsCount, setGuestsCount] = useState(2);
  const [tableTheme, setTableTheme] = useState(
    availableThemes[0]?.name || 'Ambiance à confirmer'
  );
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReservation, setSubmittedReservation] = useState<Reservation | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !date || !time) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const created = storageService.saveReservation({
        fullName: fullName.trim(),
        phone: phone.trim(),
        date,
        time,
        guestsCount: Number(guestsCount),
        tableTheme,
        additionalNotes: additionalNotes.trim() || undefined,
      });

      setIsSubmitting(false);
      setSubmittedReservation(created);
    }, 600);
  };

  const handleReset = () => {
    setSubmittedReservation(null);
    setFullName('');
    setPhone('');
    setDate('');
    setTime('');
    setGuestsCount(2);
    setAdditionalNotes('');
  };

  return (
    <section id="reserver" className="section-wrapper reservation-section">
      <div id="reservations" style={{ position: 'relative', top: '-100px', visibility: 'hidden' }} />
      <div className="container">
        {/* Section Header */}
        <div className="text-center mx-auto reservation-header">
          <div className="section-tag">
            <CalendarIcon size={14} />
            <span>Réservations & Salons</span>
          </div>

          <h2 className="section-title">
            Réserver Votre Table à <br />
            <span className="heading-red">Ferrari Lounge 229</span>
          </h2>

          <p className="section-description mx-auto">
            Sélectionnez votre date, l'horaire souhaité et choisissez l'ambiance de table qui vous
            inspire. Notre équipe se chargera de valider votre demande.
          </p>

          <div className="gold-divider center" />
        </div>

        <div className="reservation-grid">
          {/* Form Container */}
          <div className="card-luxury reservation-form-card">
            {submittedReservation ? (
              <div className="reservation-success-box">
                <div className="success-badge-icon">
                  <CheckIcon size={32} />
                </div>

                <h3 className="success-heading font-brand">Demande Envoyée avec Succès</h3>

                <p className="success-message">
                  Merci <strong>{submittedReservation.fullName}</strong>. Votre demande de
                  réservation pour <strong>{submittedReservation.guestsCount} personnes</strong> le{' '}
                  <strong>{submittedReservation.date}</strong> à{' '}
                  <strong>{submittedReservation.time}</strong> a bien été enregistrée.
                </p>

                {/* Important Notice */}
                <div className="reservation-status-alert">
                  <div className="status-indicator-dot" />
                  <div>
                    <strong className="status-alert-title">Statut : En attente de confirmation</strong>
                    <p className="status-alert-desc">
                      Conformément à notre protocole, cette réservation n'est pas confirmée
                      automatiquement. Notre équipe vous contactera au{' '}
                      <strong>{submittedReservation.phone}</strong> (par appel ou WhatsApp) pour
                      valider définitivement la disponibilité de votre table.
                    </p>
                  </div>
                </div>

                <div className="ticket-summary card-glass">
                  <div className="ticket-row">
                    <span className="t-label">N° de Référence :</span>
                    <span className="t-val font-brand">{submittedReservation.id}</span>
                  </div>
                  <div className="ticket-row">
                    <span className="t-label">Thème choisi :</span>
                    <span className="t-val">{submittedReservation.tableTheme}</span>
                  </div>
                  {submittedReservation.additionalNotes && (
                    <div className="ticket-row">
                      <span className="t-label">Précisions :</span>
                      <span className="t-val">{submittedReservation.additionalNotes}</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="btn btn-outline-gold"
                  onClick={handleReset}
                >
                  Effectuer une autre réservation
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="reservation-form">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="res-name" className="form-label">
                      Nom et Prénom <span className="req">*</span>
                    </label>
                    <input
                      id="res-name"
                      type="text"
                      required
                      placeholder="Ex: M. Jean-Luc DOSSOU"
                      className="form-input"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="res-phone" className="form-label">
                      Numéro de Téléphone (Bénin / Int.) <span className="req">*</span>
                    </label>
                    <input
                      id="res-phone"
                      type="tel"
                      required
                      placeholder="Ex: +229 01 42 68 88 37"
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label htmlFor="res-date" className="form-label">
                      Date souhaitée <span className="req">*</span>
                    </label>
                    <input
                      id="res-date"
                      type="date"
                      required
                      min={todayStr}
                      className="form-input"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="res-time" className="form-label">
                      Heure souhaitée <span className="req">*</span>
                    </label>
                    <select
                      id="res-time"
                      required
                      className="form-select"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    >
                      <option value="">Sélectionner</option>
                      <optgroup label="Déjeuner">
                        <option value="12:00">12h00</option>
                        <option value="12:30">12h30</option>
                        <option value="13:00">13h00</option>
                        <option value="13:30">13h30</option>
                        <option value="14:00">14h00</option>
                      </optgroup>
                      <optgroup label="Dîner & Soirée">
                        <option value="19:00">19h00</option>
                        <option value="19:30">19h30</option>
                        <option value="20:00">20h00</option>
                        <option value="20:30">20h30</option>
                        <option value="21:00">21h00</option>
                        <option value="21:30">21h30</option>
                        <option value="22:00">22h00</option>
                        <option value="23:00">23h00</option>
                      </optgroup>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="res-guests" className="form-label">
                      Nombre de personnes <span className="req">*</span>
                    </label>
                    <select
                      id="res-guests"
                      className="form-select"
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                    >
                      <option value={1}>1 personne</option>
                      <option value={2}>2 personnes</option>
                      <option value={3}>3 personnes</option>
                      <option value={4}>4 personnes</option>
                      <option value={5}>5 personnes</option>
                      <option value={6}>6 personnes</option>
                      <option value={8}>8 personnes</option>
                      <option value={10}>10 personnes et plus</option>
                    </select>
                  </div>
                </div>

                {/* Table Theme Selection (Dynamically synced from Admin) */}
                <div className="form-group">
                  <label htmlFor="res-theme" className="form-label">
                    Ambiance ou thème de table souhaité
                  </label>
                  {availableThemes.length > 0 ? (
                    <select
                      id="res-theme"
                      className="form-select"
                      value={tableTheme}
                      onChange={(e) => setTableTheme(e.target.value)}
                    >
                      {availableThemes.map((theme) => (
                        <option key={theme.id} value={theme.name}>
                          {theme.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id="res-theme"
                      className="form-input"
                      value={tableTheme}
                      onChange={(e) => setTableTheme(e.target.value)}
                      placeholder="Ambiance à confirmer"
                    />
                  )}
                  <span className="form-hint">
                    Les ambiances sont proposées sous réserve de disponibilité des salons et de confirmation par l'établissement.
                  </span>
                </div>

                <div className="form-group">
                  <label htmlFor="res-notes" className="form-label">
                    Message ou demande particulière (facultatif)
                  </label>
                  <textarea
                    id="res-notes"
                    rows={3}
                    placeholder="Précisez un événement particulier (anniversaire, repas d'affaires, préférence d'emplacement)..."
                    className="form-textarea"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                  />
                </div>

                <div className="reservation-notice-box">
                  <span className="notice-icon">⚠️</span>
                  <p className="notice-text">
                    <strong>Rappel important :</strong> Votre réservation reste soumise à la
                    confirmation téléphonique directe de l'établissement. Aucune réservation n'est
                    considérée comme validée avant confirmation par notre équipe.
                  </p>
                </div>

                <button
                  type="submit"
                  className="btn btn-red reservation-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Transmission en cours...</span>
                  ) : (
                    <>
                      <span>Envoyer la demande de réservation</span>
                      <ArrowRightIcon size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Info Column: Ambiances & Advice */}
          <div className="reservation-info-col">
            <div className="card-glass ambiances-preview-box">
              <h3 className="ambiances-title font-brand">Nos Espaces & Ambiances</h3>
              <p className="ambiances-sub">
                Découvrez les univers configurés pour votre accueil à Akpakpa :
              </p>

              <div className="themes-list">
                {themes.map((theme) => (
                  <div key={theme.id} className="theme-item">
                    <div className="theme-item-head">
                      <span
                        className="theme-dot"
                        style={{ backgroundColor: theme.accentColor || '#E10600' }}
                      />
                      <span className="theme-name font-brand">{theme.name}</span>
                      {theme.isAvailable ? (
                        <span className="badge-green">Disponible</span>
                      ) : (
                        <span className="badge-subtle">Réservé / Indisponible</span>
                      )}
                    </div>
                    <p className="theme-desc">{theme.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-luxury direct-call-box">
              <h4 className="direct-call-title font-brand">Réservation Urgente ?</h4>
              <p className="direct-call-desc">
                Pour une table le jour-même ou une demande immédiate, contactez directement notre
                standard téléphonique.
              </p>
              <a href="tel:+2290142688837" className="btn btn-outline-red btn-sm">
                <span>Appeler le +229 01 42 68 88 37</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
