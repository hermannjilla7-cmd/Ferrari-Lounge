import React, { useState, useEffect } from 'react';
import type { EventItem } from '../../types';
import { storageService } from '../../services/storageService';
import { TrashIcon, PlusIcon, CloseIcon } from '../common/Icons';

export const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<'f1_grand_prix' | 'soiree_lounge'>('f1_grand_prix');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('20:00');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const loadData = () => {
    setEvents(storageService.getEvents());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('ferrari_data_updated', handleUpdate);
    return () => window.removeEventListener('ferrari_data_updated', handleUpdate);
  }, []);

  const handleToggleActive = (e: EventItem) => {
    storageService.saveEvent({
      id: e.id,
      title: e.title,
      subtitle: e.subtitle,
      category: e.category,
      date: e.date,
      time: e.time,
      description: e.description,
      image: e.image,
      isActive: !e.isActive,
      isFeatured: e.isFeatured,
    });
    loadData();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Supprimer cet événement ?')) {
      storageService.deleteEvent(id);
      loadData();
    }
  };

  const handleAddSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!title.trim() || !date) return;

    storageService.saveEvent({
      title: title.trim(),
      subtitle: subtitle.trim(),
      category,
      date,
      time,
      description: description.trim(),
      image:
        image.trim() ||
        'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      isFeatured: true,
    });

    setShowAdd(false);
    setTitle('');
    setSubtitle('');
    setDescription('');
    setImage('');
    loadData();
  };

  return (
    <div className="admin-module-page">
      <div className="module-page-header">
        <div>
          <h2 className="module-title font-brand">Événements & Soirées F1</h2>
          <p className="module-subtitle">
            Planifiez les retransmissions Grands Prix et les soirées lounge by Auto Craze 229.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-red btn-sm"
          onClick={() => setShowAdd(true)}
        >
          <PlusIcon size={16} />
          <span>Créer un événement</span>
        </button>
      </div>

      {events.length === 0 ? (
        <div className="card-luxury admin-empty-state">
          <p>Aucune donnée pour le moment.</p>
          <span className="empty-subtext">
            Aucun événement n'est programmé. Cliquez sur « Créer un événement » pour en publier un.
          </span>
          <button
            type="button"
            className="btn btn-outline-gold btn-sm mt-3"
            onClick={() => setShowAdd(true)}
          >
            + Programmer un événement
          </button>
        </div>
      ) : (
        <div className="admin-cards-grid">
          {events.map((evt) => (
            <div key={evt.id} className="card-luxury admin-event-card">
              <div className="admin-event-img-wrap">
                <img src={evt.image} alt={evt.title} className="admin-event-img" />
                <span className="event-category-badge badge-red">
                  {evt.category === 'f1_grand_prix' ? 'Grand Prix F1' : 'Soirée Lounge'}
                </span>
              </div>
              <div className="admin-event-body">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-brand font-bold text-white text-lg">{evt.title}</h4>
                  <span
                    className={`status-pill ${
                      evt.isActive ? 'status-avail' : 'status-unavail'
                    }`}
                  >
                    {evt.isActive ? 'Actif' : 'Masqué'}
                  </span>
                </div>
                <div className="text-gold text-xs font-semibold mb-2">
                  📅 {evt.date} à {evt.time}
                </div>
                <p className="text-gray-300 text-sm mb-3">{evt.description}</p>
                <div className="flex justify-between items-center pt-3 border-t border-white/10 mt-auto">
                  <button
                    type="button"
                    className="btn btn-outline-gold btn-xs"
                    onClick={() => handleToggleActive(evt)}
                  >
                    {evt.isActive ? 'Masquer' : 'Activer'}
                  </button>
                  <button
                    type="button"
                    className="icon-btn-delete"
                    onClick={() => handleDelete(evt.id)}
                    title="Supprimer l'événement"
                  >
                    <TrashIcon size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Ajout Événement */}
      {showAdd && (
        <div className="admin-modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="admin-modal-box card-luxury" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3 className="font-brand text-lg text-white">Programmer un événement</h3>
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
                  Titre de l'événement <span className="req">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Grand Prix de Monaco en Direct"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Catégorie</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as 'f1_grand_prix' | 'soiree_lounge')
                    }
                  >
                    <option value="f1_grand_prix">Formule 1 en Direct</option>
                    <option value="soiree_lounge">Soirée DJ & Lounge</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Sous-titre / Thème</label>
                  <input
                    type="text"
                    placeholder="Ex: Écrans géants & Cocktails"
                    className="form-input"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">
                    Date <span className="req">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Heure de début</label>
                  <input
                    type="time"
                    className="form-input"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={2}
                  placeholder="Ambiance, réservation conseillée, formule VIP..."
                  className="form-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL de l'affiche / image</label>
                <input
                  type="url"
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
                  Publier l'événement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};