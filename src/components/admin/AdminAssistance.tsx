import React, { useState, useEffect } from 'react';
import type { RoadsideAssistanceRequest, RequestStatus } from '../../types';
import { storageService } from '../../services/storageService';
import { TrashIcon } from '../common/Icons';

export const AdminAssistance: React.FC = () => {
  const [requests, setRequests] = useState<RoadsideAssistanceRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  const loadData = () => {
    setRequests(storageService.getAssistanceRequests());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('ferrari_data_updated', handleUpdate);
    return () => window.removeEventListener('ferrari_data_updated', handleUpdate);
  }, []);

  const handleStatusChange = (id: string, status: RequestStatus) => {
    storageService.updateAssistanceStatus(id, status);
    loadData();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Supprimer cette demande de dépannage ?')) {
      storageService.deleteAssistanceRequest(id);
      loadData();
    }
  };

  const filtered =
    filter === 'all' ? requests : requests.filter((r) => r.status === filter);

  const getProblemBadge = (type: RoadsideAssistanceRequest['problemType']) => {
    switch (type) {
      case 'mecanique':
        return <span className="status-badge badge-red">Panne Mécanique</span>;
      case 'batterie':
        return <span className="status-badge badge-gold">Batterie 12V</span>;
      case 'crevaison':
        return <span className="status-badge badge-warning">Crevaison</span>;
      case 'demarrage':
        return <span className="status-badge badge-pending">Refus Démarrage</span>;
      case 'autre':
      default:
        return <span className="status-badge badge-surface">Autre / Remorquage</span>;
    }
  };

  return (
    <div className="admin-module-page">
      <div className="module-page-header">
        <div>
          <h2 className="module-title font-brand">Demandes de Dépannage & Assistance 24/7</h2>
          <p className="module-subtitle">
            Signalements d'urgences automobiles reçus par le pôle Auto Craze 229.
          </p>
        </div>

        <div className="filter-pills">
          <button
            type="button"
            className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Toutes ({requests.length})
          </button>
          <button
            type="button"
            className={`filter-pill ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            En attente ({requests.filter((r) => r.status === 'pending').length})
          </button>
          <button
            type="button"
            className={`filter-pill ${filter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            En cours ({requests.filter((r) => r.status === 'confirmed').length})
          </button>
          <button
            type="button"
            className={`filter-pill ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Résolues ({requests.filter((r) => r.status === 'completed').length})
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card-luxury admin-empty-state">
          <p>Aucune donnée pour le moment.</p>
          <span className="empty-subtext">
            Les demandes d'intervention mécanique et de dépannage soumises apparaîtront ici en direct.
          </span>
        </div>
      ) : (
        <div className="admin-table-wrapper card-luxury">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Réf. / Date</th>
                <th>Client</th>
                <th>Véhicule & Panne</th>
                <th>Localisation</th>
                <th>Description</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((req) => (
                <tr key={req.id}>
                  <td>
                    <span className="code-ref">#{req.id.slice(-6)}</span>
                    <span className="date-sub">
                      {new Date(req.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </td>
                  <td>
                    <strong>{req.fullName}</strong>
                    <a href={`tel:${req.phone}`} className="table-phone-link">
                      {req.phone}
                    </a>
                  </td>
                  <td>
                    <div className="font-semibold text-white mb-1">{req.vehicleModel}</div>
                    {getProblemBadge(req.problemType)}
                  </td>
                  <td>
                    <span className="text-gold font-medium">{req.location}</span>
                  </td>
                  <td>
                    <span className="text-sm text-gray-300">
                      {req.description || 'Non précisé'}
                    </span>
                  </td>
                  <td>
                    {req.status === 'pending' && (
                      <span className="status-badge badge-pending">En attente</span>
                    )}
                    {req.status === 'confirmed' && (
                      <span className="status-badge badge-confirmed">Équipe dépêchée</span>
                    )}
                    {req.status === 'completed' && (
                      <span className="status-badge badge-completed">Dépanné</span>
                    )}
                    {req.status === 'cancelled' && (
                      <span className="status-badge badge-cancelled">Annulé</span>
                    )}
                  </td>
                  <td>
                    <div className="table-actions-cell">
                      <select
                        className="status-select-sm"
                        value={req.status}
                        onChange={(e) =>
                          handleStatusChange(req.id, e.target.value as RequestStatus)
                        }
                      >
                        <option value="pending">En attente</option>
                        <option value="confirmed">Dépêcher équipe</option>
                        <option value="completed">Marquer Résolu</option>
                        <option value="cancelled">Annuler</option>
                      </select>

                      <button
                        type="button"
                        className="icon-btn-delete"
                        onClick={() => handleDelete(req.id)}
                        title="Supprimer la demande"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};