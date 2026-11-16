import React, { useState, useEffect } from 'react';
import type { DailySpecial } from '../../types';
import { storageService } from '../../services/storageService';
import { CheckIcon } from '../common/Icons';

export const AdminDailySpecial: React.FC = () => {
  const [special, setSpecial] = useState<DailySpecial>(storageService.getDailySpecial());
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setSpecial(storageService.getDailySpecial());
    };
    window.addEventListener('ferrari_data_updated', handleUpdate);
    return () => window.removeEventListener('ferrari_data_updated', handleUpdate);
  }, []);

  const handleChange = (field: keyof DailySpecial, value: any) => {
    setSpecial((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveDailySpecial(special);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="admin-module-page">
      <div className="module-page-header">
        <div>
          <h2 className="module-title font-brand">Plat du Jour du Chef</h2>
          <p className="module-subtitle">
            Configurez la suggestion quotidienne mise en valeur sur le site public de Ferrari Lounge 229.
          </p>
        </div>

        {savedNotice && (
          <div className="save-alert-badge">
            <CheckIcon size={16} />
            <span>Modifications enregistrées avec succès !</span>
          </div>
        )}
      </div>

      <div className="admin-two-cols-layout">
        {/* Formulaire de configuration */}
        <form onSubmit={handleSave} className="card-luxury admin-form-card">
          <h3 className="card-subtitle font-brand">Informations du Plat du Jour</h3>

          <div className="form-group">
            <label className="form-label">
              Titre du Plat <span className="req">*</span>
            </label>
            <input
              type="text"
              required
              className="form-input"
              value={special.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Ex: Filet de Capitaine Braisé Sauce Monza"
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">
                Prix (FCFA) <span className="req">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                step="500"
                className="form-input"
                value={special.price}
                onChange={(e) => handleChange('price', Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date de validité</label>
              <input
                type="date"
                className="form-input"
                value={special.availableDate || ''}
                onChange={(e) => handleChange('availableDate', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Description Gastronomique <span className="req">*</span>
            </label>
            <textarea
              rows={3}
              required
              className="form-textarea"
              value={special.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Ingrédients, accompagnements, saveurs..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Note / Recommandation du Chef</label>
            <input
              type="text"
              className="form-input"
              value={special.chefNote || ''}
              onChange={(e) => handleChange('chefNote', e.target.value)}
              placeholder="Ex: Accompagné d'écrasé d'igname et sauce aux herbes fraîches"
            />
          </div>

          <div className="form-group">
            <label className="form-label">URL de l'image de présentation</label>
            <input
              type="url"
              className="form-input"
              value={special.image}
              onChange={(e) => handleChange('image', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label className="checkbox-custom-label">
              <input
                type="checkbox"
                checked={special.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
              />
              <span>Mettre ce plat en avant sur la page d'accueil (Statut Actif)</span>
            </label>
          </div>

          <button type="submit" className="btn btn-red mt-3">
            <span>Enregistrer le Plat du Jour</span>
          </button>
        </form>

        {/* Aperçu en direct */}
        <div className="card-luxury preview-card-box">
          <h3 className="card-subtitle font-brand">Aperçu en Direct sur le Site</h3>
          <div className="plat-preview-wrap">
            <div className="plat-preview-img-box">
              <img src={special.image} alt={special.title} className="plat-preview-img" />
              <div className="plat-preview-badge">
                {special.isActive ? 'Actif sur le site' : 'Inactif / Masqué'}
              </div>
            </div>
            <div className="plat-preview-content">
              <h4 className="font-brand">{special.title || 'Sans titre'}</h4>
              <p className="preview-desc">{special.description || 'Description en attente...'}</p>
              {special.chefNote && (
                <div className="preview-chef-note">👨‍🍳 {special.chefNote}</div>
              )}
              <div className="preview-price-row">
                <span className="price-tag">{special.price.toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};