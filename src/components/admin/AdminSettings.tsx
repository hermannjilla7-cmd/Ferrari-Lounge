import React, { useState } from 'react';
import type { EstablishmentConfig } from '../../types';
import { storageService } from '../../services/storageService';
import { checkDatabaseStatus } from '../../services/supabaseClient';

interface AdminSettingsProps {
  establishment: EstablishmentConfig;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ establishment }) => {
  const [formData, setFormData] = useState<EstablishmentConfig>(establishment);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const dbStatus = checkDatabaseStatus();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveEstablishment(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Attention : ceci réinitialisera toutes les réservations, le menu, les thèmes et les messages aux données de démonstration initiales. Continuer ?'
      )
    ) {
      storageService.resetToDefaults();
      setFormData(storageService.getEstablishment());
      alert('Données réinitialisées avec succès.');
    }
  };

  return (
    <div className="admin-module-page">
      <div className="module-page-header">
        <div>
          <h2 className="module-title font-brand">Paramètres de l'Établissement</h2>
          <p className="module-subtitle">
            Configurez les coordonnées officielles, horaires et l'architecture backend
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="card-glass save-success-banner">
          <span>✓ Paramètres enregistrés et répercutés en direct sur le site public !</span>
        </div>
      )}

      {/* Backend & Supabase Status Box */}
      <div className="card-luxury backend-status-card">
        <div className="backend-card-head">
          <div className="backend-icon">⚡</div>
          <div>
            <h3 className="backend-title font-brand">Architecture Base de Données & Supabase</h3>
            <span className="backend-sub">
              Statut actuel : <strong>{dbStatus.provider}</strong>
            </span>
          </div>
        </div>

        <p className="backend-desc">{dbStatus.message}</p>

        <div className="supabase-guide-box card-glass">
          <h4 className="supabase-guide-title">Comment connecter votre base PostgreSQL Supabase :</h4>
          <ol className="supabase-steps">
            <li>
              Rendez-vous sur <a href="https://supabase.com" target="_blank" rel="noreferrer">supabase.com</a> et créez un projet gratuit.
            </li>
            <li>
              Dans le fichier <code>.env.local</code> de votre projet, renseignez :
              <pre className="env-snippet">
VITE_SUPABASE_URL="https://votresupabase.supabase.co"
VITE_SUPABASE_ANON_KEY="votre-cle-api-anon"
              </pre>
            </li>
            <li>
              Exécutez le script SQL présent dans <code>src/services/supabaseClient.ts</code> pour créer les tables <code>reservations</code>, <code>menu_items</code> et <code>contact_messages</code>.
            </li>
          </ol>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="card-luxury admin-settings-form">
        <h3 className="settings-section-title font-brand">Identité & Informations Générales</h3>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Nom commercial principal</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Signature de marque</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.signature}
              onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Slogan officiel</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.slogan}
              onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Activité déclarée</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.activity}
              onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description officielle de l'établissement</label>
          <textarea
            rows={3}
            className="form-textarea"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="gold-divider" />
        <h3 className="settings-section-title font-brand">Coordonnées & Localisation à Cotonou</h3>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Numéro de Téléphone standard</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Numéro WhatsApp (avec indicatif)</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Adresse physique complète</label>
          <input
            type="text"
            required
            className="form-input"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Lien d'itinéraire Google Maps</label>
          <input
            type="url"
            required
            className="form-input"
            value={formData.mapDirectionsUrl}
            onChange={(e) => setFormData({ ...formData, mapDirectionsUrl: e.target.value })}
          />
        </div>

        <div className="gold-divider" />
        <h3 className="settings-section-title font-brand">Horaires d'Ouverture</h3>

        <div className="hours-edit-stack">
          {formData.hours.map((h, idx) => (
            <div key={idx} className="form-grid-2 hour-edit-row">
              <input
                type="text"
                className="form-input"
                value={h.dayLabel}
                onChange={(e) => {
                  const updated = [...formData.hours];
                  updated[idx].dayLabel = e.target.value;
                  setFormData({ ...formData, hours: updated });
                }}
              />
              <input
                type="text"
                className="form-input"
                value={h.schedule}
                onChange={(e) => {
                  const updated = [...formData.hours];
                  updated[idx].schedule = e.target.value;
                  setFormData({ ...formData, hours: updated });
                }}
              />
            </div>
          ))}
        </div>

        <div className="settings-submit-bar">
          <button type="submit" className="btn btn-red">
            <span>Enregistrer les paramètres</span>
          </button>

          <button
            type="button"
            className="btn btn-outline-gold"
            onClick={handleResetData}
          >
            Réinitialiser les données de démo
          </button>
        </div>
      </form>
    </div>
  );
};
