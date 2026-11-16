import React, { useState } from 'react';
import type { TableTheme } from '../../types';
import { storageService } from '../../services/storageService';
import { CloseIcon } from '../common/Icons';

interface AdminThemesProps {
  themes: TableTheme[];
}

export const AdminThemes: React.FC<AdminThemesProps> = ({ themes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState<TableTheme | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [accentColor, setAccentColor] = useState('#E10600');
  const [isAvailable, setIsAvailable] = useState(true);

  const handleOpenAdd = () => {
    setEditingTheme(null);
    setName('');
    setDescription('');
    setAccentColor('#E10600');
    setIsAvailable(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: TableTheme) => {
    setEditingTheme(t);
    setName(t.name);
    setDescription(t.description);
    setAccentColor(t.accentColor || '#E10600');
    setIsAvailable(t.isAvailable);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    storageService.saveTableTheme({
      id: editingTheme?.id,
      name: name.trim(),
      description: description.trim(),
      accentColor,
      isAvailable,
    });

    setIsModalOpen(false);
  };

  const handleToggle = (id: string) => {
    storageService.toggleTableThemeAvailability(id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette ambiance de table ?')) {
      storageService.deleteTableTheme(id);
    }
  };

  return (
    <div className="admin-module-page">
      <div className="module-page-header">
        <div>
          <h2 className="module-title font-brand">Gestion des Thèmes de Tables</h2>
          <p className="module-subtitle">
            Configurez les univers proposés aux clients lors de leur réservation
          </p>
        </div>
        <button
          type="button"
          className="btn btn-red btn-sm"
          onClick={handleOpenAdd}
        >
          <span>+ Ajouter une ambiance de table</span>
        </button>
      </div>

      <div className="admin-cards-grid">
        {themes.map((theme) => (
          <div key={theme.id} className="card-luxury admin-theme-card">
            <div className="theme-card-head">
              <span
                className="theme-card-color-dot"
                style={{ backgroundColor: theme.accentColor || '#E10600' }}
              />
              <h3 className="theme-card-title font-brand">{theme.name}</h3>
              <span className={`badge ${theme.isAvailable ? 'badge-green' : 'badge-subtle'}`}>
                {theme.isAvailable ? 'Actif & Proposé' : 'Désactivé'}
              </span>
            </div>

            <p className="theme-card-desc">{theme.description}</p>

            <div className="theme-card-foot">
              <button
                type="button"
                className={`btn-toggle-active ${theme.isAvailable ? 'active' : ''}`}
                onClick={() => handleToggle(theme.id)}
              >
                {theme.isAvailable ? 'Désactiver du formulaire' : 'Rendre disponible'}
              </button>

              <button
                type="button"
                className="btn-edit-item"
                onClick={() => handleOpenEdit(theme)}
              >
                Modifier
              </button>

              <button
                type="button"
                className="btn-delete-item"
                onClick={() => handleDelete(theme.id)}
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content card-luxury" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title font-brand">
                {editingTheme ? 'Modifier l’ambiance de table' : 'Ajouter un nouveau thème de table'}
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="modal-body admin-modal-form">
              <div className="form-group">
                <label className="form-label">Nom de l'ambiance ou salon <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ambiance Scuderia Rouge, Salon Paddock VIP..."
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description pour les clients</label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  placeholder="Atmosphère, finitions, capacité recommandée..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Couleur indicative de l'ambiance</label>
                <div className="color-picker-row">
                  <input
                    type="color"
                    className="color-picker-input"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                  />
                  <span className="color-code">{accentColor}</span>
                </div>
              </div>

              <div className="form-checkbox-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                  />
                  <span>Disponible immédiatement dans la liste de réservation publique</span>
                </label>
              </div>

              <div className="modal-actions-bar">
                <button type="submit" className="btn btn-red btn-sm">
                  {editingTheme ? 'Enregistrer' : 'Créer l’ambiance'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-gold btn-sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
