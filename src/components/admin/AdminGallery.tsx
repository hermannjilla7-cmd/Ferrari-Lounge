import React, { useState, useEffect } from 'react';
import type { GalleryItem } from '../../types';
import { storageService } from '../../services/storageService';
import { TrashIcon, PlusIcon, CloseIcon } from '../common/Icons';

export const AdminGallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GalleryItem['category']>('ambiance');
  const [image, setImage] = useState('');

  const loadData = () => {
    setItems(storageService.getGallery());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('ferrari_data_updated', handleUpdate);
    return () => window.removeEventListener('ferrari_data_updated', handleUpdate);
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Supprimer cette photo de la galerie ?')) {
      storageService.deleteGalleryItem(id);
      loadData();
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image.trim()) return;

    storageService.saveGalleryItem({
      title: title.trim(),
      category,
      image: image.trim(),
    });

    setShowAdd(false);
    setTitle('');
    setImage('');
    loadData();
  };

  return (
    <div className="admin-module-page">
      <div className="module-page-header">
        <div>
          <h2 className="module-title font-brand">Galerie Photos Ferrari Lounge</h2>
          <p className="module-subtitle">
            Gérez les photos exposées dans la galerie publique (ambiance, gastronomie, automobile, soirées).
          </p>
        </div>

        <button
          type="button"
          className="btn btn-red btn-sm"
          onClick={() => setShowAdd(true)}
        >
          <PlusIcon size={16} />
          <span>Ajouter une photo</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="card-luxury admin-empty-state">
          <p>Aucune donnée pour le moment.</p>
          <span className="empty-subtext">
            La galerie est vide. Cliquez sur « Ajouter une photo » pour ajouter un visuel.
          </span>
          <button
            type="button"
            className="btn btn-outline-gold btn-sm mt-3"
            onClick={() => setShowAdd(true)}
          >
            + Ajouter une photo
          </button>
        </div>
      ) : (
        <div className="admin-cards-grid">
          {items.map((item) => (
            <div key={item.id} className="card-luxury admin-gallery-card">
              <div className="admin-gallery-img-wrap">
                <img src={item.image} alt={item.title} className="admin-gallery-img" />
                <button
                  type="button"
                  className="gallery-delete-btn"
                  onClick={() => handleDelete(item.id)}
                  title="Supprimer la photo"
                >
                  <TrashIcon size={14} />
                </button>
              </div>
              <div className="admin-gallery-body">
                <h4 className="font-brand font-bold text-white text-sm">{item.title}</h4>
                <span className="text-gold text-xs uppercase">{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Ajout Photo */}
      {showAdd && (
        <div className="admin-modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="admin-modal-box card-luxury" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3 className="font-brand text-lg text-white">Ajouter une photo à la galerie</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAdd(false)}
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4">
              <div className="form-group">
                <label className="form-label">
                  Titre / Description courte <span className="req">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Bar à cocktails & éclairage tamisé"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Catégorie</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as GalleryItem['category'])
                  }
                >
                  <option value="ambiance">Ambiance & Décor</option>
                  <option value="gastronomie">Cuisine & Cocktails</option>
                  <option value="automobile">Passion Automobile</option>
                  <option value="evenements">Soirées & F1</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  URL de l'image <span className="req">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  className="form-input"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>

              <div className="modal-actions mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  className="btn btn-outline-gold btn-sm"
                  onClick={() => setShowAdd(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-red btn-sm">
                  Ajouter à la galerie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};