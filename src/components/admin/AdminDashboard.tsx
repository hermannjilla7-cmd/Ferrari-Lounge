import React from 'react';
import type { AdminDashboardStats, Reservation, ContactMessage } from '../../types';
import { checkDatabaseStatus } from '../../services/supabaseClient';
import {
  CalendarIcon,
  ClockIcon,
  PhoneIcon,
  UtensilsIcon,
  CheckIcon,
} from '../common/Icons';

interface AdminDashboardProps {
  stats: AdminDashboardStats;
  recentReservations: Reservation[];
  recentMessages: ContactMessage[];
  onNavigateTab: (tab: string) => void;
  onUpdateReservationStatus: (id: string, status: Reservation['status']) => void;
  onMarkMessageTreated: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  recentReservations,
  recentMessages,
  onNavigateTab,
  onUpdateReservationStatus,
  onMarkMessageTreated,
}) => {
  const dbStatus = checkDatabaseStatus();

  return (
    <div className="admin-dashboard-view">
      {/* Top Banner / Backend Status */}
      <div className="card-glass admin-status-strip">
        <div className="status-strip-left">
          <div className="status-badge-chip">
            <span className="chip-dot" />
            <span className="chip-title">Fournisseur de données : {dbStatus.provider}</span>
          </div>
          <p className="status-note">{dbStatus.message}</p>
        </div>
        <button
          type="button"
          className="btn btn-outline-gold btn-sm"
          onClick={() => onNavigateTab('settings')}
        >
          Configurer Supabase / Paramètres →
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="admin-kpi-grid">
        <div className="card-luxury kpi-card" onClick={() => onNavigateTab('reservations')}>
          <div className="kpi-icon-wrap gold">
            <CalendarIcon size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-val font-brand">{stats.totalReservations}</span>
            <span className="kpi-label">Demandes de réservation</span>
          </div>
        </div>

        <div className="card-luxury kpi-card warning" onClick={() => onNavigateTab('reservations')}>
          <div className="kpi-icon-wrap red">
            <ClockIcon size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-val font-brand">{stats.pendingReservations}</span>
            <span className="kpi-label">En attente de validation</span>
          </div>
        </div>

        <div className="card-luxury kpi-card success" onClick={() => onNavigateTab('reservations')}>
          <div className="kpi-icon-wrap green">
            <CheckIcon size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-val font-brand">{stats.confirmedReservations}</span>
            <span className="kpi-label">Réservations acceptées</span>
          </div>
        </div>

        <div className="card-luxury kpi-card danger" onClick={() => onNavigateTab('reservations')}>
          <div className="kpi-icon-wrap gray">
            <span className="kpi-sub-icon">✕</span>
          </div>
          <div className="kpi-info">
            <span className="kpi-val font-brand">{stats.rejectedReservations}</span>
            <span className="kpi-label">Réservations refusées</span>
          </div>
        </div>

        <div className="card-luxury kpi-card" onClick={() => onNavigateTab('messages')}>
          <div className="kpi-icon-wrap blue">
            <PhoneIcon size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-val font-brand">{stats.totalMessages}</span>
            <span className="kpi-label">Messages reçus ({stats.unreadMessages} non traités)</span>
          </div>
        </div>

        <div className="card-luxury kpi-card" onClick={() => onNavigateTab('menu')}>
          <div className="kpi-icon-wrap red">
            <UtensilsIcon size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-val font-brand">{stats.activeMenuItems}</span>
            <span className="kpi-label">Plats & cocktails au menu</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Sections */}
      <div className="admin-panels-grid">
        {/* Left: Pending Reservations */}
        <div className="card-luxury admin-panel">
          <div className="admin-panel-head">
            <div>
              <h2 className="admin-panel-title font-brand">Réservations Récentes</h2>
              <p className="admin-panel-sub">Dernières demandes transmises depuis le site</p>
            </div>
            <button
              type="button"
              className="btn btn-outline-red btn-sm"
              onClick={() => onNavigateTab('reservations')}
            >
              Voir toutes ({stats.totalReservations})
            </button>
          </div>

          <div className="admin-table-wrap">
            {recentReservations.length === 0 ? (
              <p className="panel-empty-text">Aucune réservation pour le moment.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Date & Heure</th>
                    <th>Couverts</th>
                    <th>Thème</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReservations.slice(0, 5).map((res) => (
                    <tr key={res.id}>
                      <td>
                        <strong className="client-name">{res.fullName}</strong>
                        <span className="client-phone">{res.phone}</span>
                      </td>
                      <td>
                        <div>{res.date}</div>
                        <span className="table-time-chip">{res.time}</span>
                      </td>
                      <td>{res.guestsCount} pers.</td>
                      <td>
                        <span className="theme-tag">{res.tableTheme}</span>
                      </td>
                      <td>
                        {res.status === 'pending' && (
                          <span className="badge-red">En attente</span>
                        )}
                        {res.status === 'confirmed' && (
                          <span className="badge-green">Confirmée</span>
                        )}
                        {res.status === 'rejected' && (
                          <span className="badge-subtle">Refusée</span>
                        )}
                      </td>
                      <td>
                        <div className="table-row-actions">
                          {res.status === 'pending' && (
                            <>
                              <button
                                type="button"
                                className="action-btn-confirm"
                                onClick={() => onUpdateReservationStatus(res.id, 'confirmed')}
                                title="Accepter la réservation"
                              >
                                Accepter
                              </button>
                              <button
                                type="button"
                                className="action-btn-reject"
                                onClick={() => onUpdateReservationStatus(res.id, 'rejected')}
                                title="Refuser"
                              >
                                Refuser
                              </button>
                            </>
                          )}
                          {res.status !== 'pending' && (
                            <span className="status-processed-label">Traité</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right: Recent Inquiries */}
        <div className="card-luxury admin-panel">
          <div className="admin-panel-head">
            <div>
              <h2 className="admin-panel-title font-brand">Messages de Contact</h2>
              <p className="admin-panel-sub">Questions et demandes d’informations</p>
            </div>
            <button
              type="button"
              className="btn btn-outline-gold btn-sm"
              onClick={() => onNavigateTab('messages')}
            >
              Voir tous ({stats.totalMessages})
            </button>
          </div>

          <div className="recent-messages-stack">
            {recentMessages.length === 0 ? (
              <p className="panel-empty-text">Aucun message pour l’instant.</p>
            ) : (
              recentMessages.slice(0, 4).map((msg) => (
                <div key={msg.id} className="card-glass message-mini-card">
                  <div className="msg-mini-head">
                    <div>
                      <strong className="msg-sender">{msg.fullName}</strong>
                      <span className="msg-contact">{msg.phoneOrEmail}</span>
                    </div>
                    {msg.isTreated ? (
                      <span className="badge-green">Traité</span>
                    ) : (
                      <span className="badge-red">Nouveau</span>
                    )}
                  </div>
                  <div className="msg-subject font-brand">{msg.subject || 'Message'}</div>
                  <p className="msg-body-preview">{msg.message}</p>

                  {!msg.isTreated && (
                    <button
                      type="button"
                      className="btn-mark-treated"
                      onClick={() => onMarkMessageTreated(msg.id)}
                    >
                      ✓ Marquer comme traité
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
