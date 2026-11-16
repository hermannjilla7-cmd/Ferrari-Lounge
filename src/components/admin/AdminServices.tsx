import React, { useState } from 'react';
import type { ServiceItem } from '../../types';
import { storageService } from '../../services/storageService';
import { CloseIcon } from '../common/Icons';

interface AdminServicesProps {
  services: ServiceItem[];
}

export const AdminServices: React.FC<AdminServicesProps> = ({ services }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState<ServiceItem['category']>('restaurant');
  const [notice, setNotice] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleOpenEdit = (s: ServiceItem) => {
    setEditingService(s);
    setTitle(s.title);
    setTagline(s.tagline);
    setShortDescription(s.shortDescription);
    setFullDescription(s.fullDescription);
    setImage(s.image);
    setCategory(s.category);
    setNotice(s.notice || '');
    setIsActive(s.isActive);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingService(null);
    setTitle('');
    setTagline('');
    setShortDescription('');
    setFullDescription('');
    setImage('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80');
    setCategory('restaurant');
    setNotice('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    storageService.saveService({
      id: editingService?.id,
      title: title.trim(),
      tagline: tagline.trim(),
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      image: image.trim(),
      category,
      notice: notice.trim() || undefined,
      isActive,
      highlights: editingService?.highlights || [
        'Prestation soignée',
        'Accueil personnalisé',
        'Cadre haut de gamme',
      ],
    });

    setIsModalOpen(false);
  };

  const handleToggle = (id: string) => {
    storageService.toggleServiceActive(id);
  };

  return (
    <div className="admin-module-page">
      <div className="module-page-header">
        <div>
          <h2 className="module-title font-brand">Gestion des Services & Pôles</h2>
          <p className="module-subtitle">
            Gérez les cartes de prestations affichées sur la page d’accueil du site
          </p>
        </div>
        <button
          type="button"
          className="btn btn-red btn-sm"
          onClick={handleOpenAdd}
        >
          <span>+ Ajouter une prestation</span>
        </button>
      </div>

      <div className="admin-cards-grid">
        {services.map((srv) => (
          <div key={srv.id} className={`card-luxury admin-service-card ${!srv.isActive ? 'item-disabled' : ''}`}>
            <div className="admin-menu-thumb-wrap">
              <img src={srv.image} alt={srv.title} className="admin-menu-thumb" />
              <span className={`menu-status-pill ${srv.isActive ? 'badge-green' : 'badge-subtle'}`}>
                {srv.isActive ? 'Actif sur le site' : 'Désactivé'}
              </span>
            </div>

            <div className="admin-menu-info">
              <span className="admin-item-tagline">{srv.tagline}</span>
              <h3 className="admin-item-title font-brand">{srv.title}</h3>
              <p className="admin-item-desc">{srv.shortDescription}</p>

              {srv.notice && (
                <div className="admin-notice-preview">
                  <strong>Notice :</strong> {srv.notice}
                </div>
              )}
            </div>

            <div className="admin-item-actions">
              <button
                type="button"
                className={`btn-toggle-active ${srv.isActive ? 'active' : ''}`}
                onClick={() => handleToggle(srv.id)}
              >
                {srv.isActive ? 'Désactiver' : 'Activer'}
              </button>

              <button
                type="button"
                className="btn-edit-item"
                onClick={() => handleOpenEdit(srv)}
              >
                Modifier les détails
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
                {editingService ? 'Modifier la prestation' : 'Créer un nouveau pôle de service'}
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
                <label className="form-label">Titre de la prestation <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Sous-titre / Accroche</label>
                  <input
                    type="text"
                    className="form-input"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Catégorie</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ServiceItem['category'])}
                  >
                    <option value="restaurant">Restauration & Cocktails</option>
                    <option value="events">Événements & F1</option>
                    <option value="lounge">Lounge VIP & Privatisation</option>
                    <option value="automotive">Prestations Mobilité & Auto Craze</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Courte description (carte d'accueil)</label>
                <textarea
                  rows={2}
                  className="form-textarea"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL de l'image de présentation</label>
                <input
                  type="url"
                  className="form-input"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notice ou condition particulière (facultatif)</label>
                <input
                  type="text"
                  placeholder="Ex: Soumis à confirmation avec l'équipe..."
                  className="form-input"
                  value={notice}
                  onChange={(e) => setNotice(e.target.value)}
                />
              </div>

              <div className="form-checkbox-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  <span>Afficher ce service sur le site public</span>
                </label>
              </div>

              <div className="modal-actions-bar">
                <button type="submit" className="btn btn-red btn-sm">
                  Enregistrer
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
