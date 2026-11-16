import React, { useState } from 'react';
import type { ContactMessage } from '../../types';
import { storageService } from '../../services/storageService';

interface AdminMessagesProps {
  messages: ContactMessage[];
}

export const AdminMessages: React.FC<AdminMessagesProps> = ({ messages }) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'treated'>('all');

  const filtered = messages.filter((m) => {
    if (filter === 'unread') return !m.isTreated;
    if (filter === 'treated') return m.isTreated;
    return true;
  });

  const handleToggleTreated = (id: string, current: boolean) => {
    storageService.markMessageTreated(id, !current);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Supprimer définitivement ce message ?')) {
      storageService.deleteMessage(id);
    }
  };

  return (
    <div className="admin-module-page">
      <div className="module-page-header">
        <div>
          <h2 className="module-title font-brand">Messages & Contacts Reçus</h2>
          <p className="module-subtitle">
            Consultez les demandes transmises via le formulaire de contact du site
          </p>
        </div>
      </div>

      <div className="card-luxury filters-bar">
        <div className="status-filters">
          <button
            type="button"
            className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tous les messages ({messages.length})
          </button>
          <button
            type="button"
            className={`filter-chip warning ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Non traités ({messages.filter((m) => !m.isTreated).length})
          </button>
          <button
            type="button"
            className={`filter-chip success ${filter === 'treated' ? 'active' : ''}`}
            onClick={() => setFilter('treated')}
          >
            Traités ({messages.filter((m) => m.isTreated).length})
          </button>
        </div>
      </div>

      <div className="admin-messages-list">
        {filtered.length === 0 ? (
          <div className="card-luxury admin-empty-state">
            <p>Aucun message ne correspond à ce filtre.</p>
          </div>
        ) : (
          filtered.map((msg) => (
            <div
              key={msg.id}
              className={`card-luxury admin-message-card ${!msg.isTreated ? 'unread' : ''}`}
            >
              <div className="message-card-header">
                <div className="sender-meta">
                  <strong className="sender-name">{msg.fullName}</strong>
                  <span className="sender-contact">
                    Coordonnées : <strong>{msg.phoneOrEmail}</strong>
                  </span>
                  <span className="message-date">
                    Reçu le : {new Date(msg.createdAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="message-badge-status">
                  {msg.isTreated ? (
                    <span className="badge-green">Traité</span>
                  ) : (
                    <span className="badge-red">Non traité</span>
                  )}
                </div>
              </div>

              <div className="message-subject-badge font-brand">
                Sujet : {msg.subject || 'Renseignement général'}
              </div>

              <div className="message-body-box">
                <p>{msg.message}</p>
              </div>

              <div className="message-actions-bar">
                <button
                  type="button"
                  className={`btn-toggle-treated ${msg.isTreated ? 'treated' : ''}`}
                  onClick={() => handleToggleTreated(msg.id, msg.isTreated)}
                >
                  {msg.isTreated ? '✓ Marqué comme traité' : 'Marquer comme traité'}
                </button>

                <a
                  href={`tel:${msg.phoneOrEmail.replace(/\s+/g, '')}`}
                  className="btn btn-outline-gold btn-sm"
                >
                  Rappeler
                </a>

                <button
                  type="button"
                  className="btn-delete-item"
                  onClick={() => handleDelete(msg.id)}
                  title="Supprimer"
                >
                  🗑 Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
