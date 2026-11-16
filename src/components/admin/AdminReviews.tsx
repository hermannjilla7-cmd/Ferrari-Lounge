import React, { useState, useEffect } from 'react';
import type { CustomerReview } from '../../types';
import { storageService } from '../../services/storageService';
import { TrashIcon } from '../common/Icons';

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const loadData = () => {
    setReviews(storageService.getReviews());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('ferrari_data_updated', handleUpdate);
    return () => window.removeEventListener('ferrari_data_updated', handleUpdate);
  }, []);

  const handleToggleApprove = (id: string, current: boolean) => {
    storageService.approveReview(id, !current);
    loadData();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Supprimer définitivement cet avis ?')) {
      storageService.deleteReview(id);
      loadData();
    }
  };

  const filtered =
    filter === 'all'
      ? reviews
      : filter === 'pending'
      ? reviews.filter((r) => !r.isApproved)
      : reviews.filter((r) => r.isApproved);

  return (
    <div className="admin-module-page">
      <div className="module-page-header">
        <div>
          <h2 className="module-title font-brand">Modération des Avis Clients</h2>
          <p className="module-subtitle">
            Validez ou refusez les avis soumis par les clients avant affichage sur le site public.
          </p>
        </div>

        <div className="filter-pills">
          <button
            type="button"
            className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tous ({reviews.length})
          </button>
          <button
            type="button"
            className={`filter-pill ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            En attente ({reviews.filter((r) => !r.isApproved).length})
          </button>
          <button
            type="button"
            className={`filter-pill ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            Publiés ({reviews.filter((r) => r.isApproved).length})
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card-luxury admin-empty-state">
          <p>Aucune donnée pour le moment.</p>
          <span className="empty-subtext">
            Dès qu'un client dépose un avis dans la rubrique « Avis », il s'affichera ici pour validation.
          </span>
        </div>
      ) : (
        <div className="admin-cards-grid">
          {filtered.map((rev) => (
            <div key={rev.id} className="card-luxury review-admin-card">
              <div className="review-admin-head">
                <div>
                  <h4 className="font-brand font-bold text-white">{rev.authorName}</h4>
                  <span className="text-xs text-gray-400">{rev.date}</span>
                </div>
                <div className="text-gold text-lg">
                  {'★'.repeat(rev.rating)}
                  {'☆'.repeat(5 - rev.rating)}
                </div>
              </div>

              <p className="review-admin-body">"{rev.comment}"</p>

              <div className="review-admin-foot">
                <span
                  className={`status-pill ${
                    rev.isApproved ? 'status-avail' : 'status-unavail'
                  }`}
                >
                  {rev.isApproved ? 'Visible sur le site' : 'En attente de validation'}
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`btn btn-xs ${
                      rev.isApproved ? 'btn-outline-gold' : 'btn-red'
                    }`}
                    onClick={() => handleToggleApprove(rev.id, rev.isApproved)}
                  >
                    {rev.isApproved ? 'Désactiver' : 'Valider & Publier'}
                  </button>

                  <button
                    type="button"
                    className="icon-btn-delete"
                    onClick={() => handleDelete(rev.id)}
                    title="Supprimer l'avis"
                  >
                    <TrashIcon size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};