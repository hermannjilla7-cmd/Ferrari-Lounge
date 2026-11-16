import React, { useState } from 'react';
import type { Reservation } from '../../types';
import { storageService } from '../../services/storageService';
import { CloseIcon } from '../common/Icons';

interface AdminReservationsProps {
  reservations: Reservation[];
}

export const AdminReservations: React.FC<AdminReservationsProps> = ({ reservations }) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNoteResId, setEditingNoteResId] = useState<string | null>(null);
  const [currentNote, setCurrentNote] = useState('');

  const filtered = reservations.filter((r) => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      r.fullName.toLowerCase().includes(q) ||
      r.phone.toLowerCase().includes(q) ||
      r.tableTheme.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (id: string, status: Reservation['status']) => {
    storageService.updateReservationStatus(id, status);
  };

  const handleOpenNoteModal = (res: Reservation) => {
    setEditingNoteResId(res.id);
    setCurrentNote(res.internalNote || '');
  };

  const handleSaveNote = () => {
    if (editingNoteResId) {
      storageService.updateReservationNote(editingNoteResId, currentNote);
      setEditingNoteResId(null);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette réservation ?')) {
      storageService.deleteReservation(id);
    }
  };

  return (
    <div className="admin-module-page">
      <div className="module-page-header">
        <div>
          <h2 className="module-title font-brand">Gestion des Réservations</h2>
          <p className="module-subtitle">
            Consultez, validez ou refusez les demandes de table de Ferrari Lounge 229
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-luxury filters-bar">
        <div className="status-filters">
          <button
            type="button"
            className={`filter-chip ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            Toutes ({reservations.length})
          </button>
          <button
            type="button"
            className={`filter-chip warning ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            En attente ({reservations.filter((r) => r.status === 'pending').length})
          </button>
          <button
            type="button"
            className={`filter-chip success ${statusFilter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('confirmed')}
          >
            Acceptées ({reservations.filter((r) => r.status === 'confirmed').length})
          </button>
          <button
            type="button"
            className={`filter-chip danger ${statusFilter === 'rejected' ? 'active' : ''}`}
            onClick={() => setStatusFilter('rejected')}
          >
            Refusées ({reservations.filter((r) => r.status === 'rejected').length})
          </button>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone, thème..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card-luxury admin-table-container">
        {filtered.length === 0 ? (
          <div className="admin-empty-state">
            <p>Aucune réservation ne correspond à vos critères de recherche.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date & Heure</th>
                <th>Client & Coordonnées</th>
                <th>Couverts</th>
                <th>Thème de Table</th>
                <th>Remarques Client</th>
                <th>Note Interne</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((res) => (
                <tr key={res.id}>
                  <td>
                    <div className="date-main">{res.date}</div>
                    <span className="table-time-chip">{res.time}</span>
                  </td>
                  <td>
                    <strong className="client-name">{res.fullName}</strong>
                    <a href={`tel:${res.phone.replace(/\s+/g, '')}`} className="client-phone-link">
                      {res.phone}
                    </a>
                  </td>
                  <td>
                    <strong>{res.guestsCount}</strong> pers.
                  </td>
                  <td>
                    <span className="theme-tag">{res.tableTheme}</span>
                  </td>
                  <td className="notes-cell">
                    {res.additionalNotes ? (
                      <span>{res.additionalNotes}</span>
                    ) : (
                      <em className="text-dimmed">Aucune</em>
                    )}
                  </td>
                  <td className="notes-cell">
                    {res.internalNote ? (
                      <div className="internal-note-badge">
                        <span>{res.internalNote}</span>
                        <button
                          type="button"
                          className="edit-note-btn"
                          onClick={() => handleOpenNoteModal(res)}
                        >
                          ✎
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="add-note-btn"
                        onClick={() => handleOpenNoteModal(res)}
                      >
                        + Ajouter note
                      </button>
                    )}
                  </td>
                  <td>
                    {res.status === 'pending' && <span className="badge-red">En attente</span>}
                    {res.status === 'confirmed' && <span className="badge-green">Acceptée</span>}
                    {res.status === 'rejected' && <span className="badge-subtle">Refusée</span>}
                  </td>
                  <td>
                    <div className="table-actions-cell">
                      {res.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            className="btn-action-green"
                            onClick={() => handleStatusChange(res.id, 'confirmed')}
                            title="Accepter cette réservation"
                          >
                            Accepter
                          </button>
                          <button
                            type="button"
                            className="btn-action-red"
                            onClick={() => handleStatusChange(res.id, 'rejected')}
                            title="Refuser cette réservation"
                          >
                            Refuser
                          </button>
                        </>
                      )}

                      {res.status === 'confirmed' && (
                        <button
                          type="button"
                          className="btn-action-red"
                          onClick={() => handleStatusChange(res.id, 'rejected')}
                          title="Passer en refusé"
                        >
                          Refuser
                        </button>
                      )}

                      {res.status === 'rejected' && (
                        <button
                          type="button"
                          className="btn-action-green"
                          onClick={() => handleStatusChange(res.id, 'confirmed')}
                          title="Ré-accepter"
                        >
                          Accepter
                        </button>
                      )}

                      <button
                        type="button"
                        className="btn-action-delete"
                        onClick={() => handleDelete(res.id)}
                        title="Supprimer la fiche"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Internal Note Modal */}
      {editingNoteResId && (
        <div className="modal-backdrop" onClick={() => setEditingNoteResId(null)}>
          <div className="modal-content card-luxury" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title font-brand">Note Interne de Réservation</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setEditingNoteResId(null)}
              >
                <CloseIcon size={18} />
              </button>
            </div>
            <div className="modal-body">
              <label htmlFor="note-txt" className="form-label">
                Consigne pour le service / précision sur le client :
              </label>
              <textarea
                id="note-txt"
                rows={4}
                className="form-textarea"
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="Ex: Table numéro 3 réservée. Client régulier, prévoir une bouteille d'eau fraîche."
              />
              <div className="modal-actions-bar">
                <button
                  type="button"
                  className="btn btn-red btn-sm"
                  onClick={handleSaveNote}
                >
                  Enregistrer la note
                </button>
                <button
                  type="button"
                  className="btn btn-outline-gold btn-sm"
                  onClick={() => setEditingNoteResId(null)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
