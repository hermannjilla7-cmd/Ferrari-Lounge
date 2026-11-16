import React, { useState, useEffect } from 'react';
import type { DeliveryOrder, RequestStatus } from '../../types';
import { storageService } from '../../services/storageService';
import { TrashIcon } from '../common/Icons';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_delivery' | 'delivered' | 'cancelled'>('all');

  const loadOrders = () => {
    setOrders(storageService.getOrders());
  };

  useEffect(() => {
    loadOrders();
    const handleUpdate = () => loadOrders();
    window.addEventListener('ferrari_data_updated', handleUpdate);
    return () => window.removeEventListener('ferrari_data_updated', handleUpdate);
  }, []);

  const handleStatusChange = (
    id: string,
    status: RequestStatus | 'in_delivery' | 'delivered'
  ) => {
    storageService.updateOrderStatus(id, status);
    loadOrders();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Supprimer cette commande ?')) {
      storageService.deleteOrder(id);
      loadOrders();
    }
  };

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const getStatusBadge = (status: DeliveryOrder['status']) => {
    switch (status) {
      case 'pending':
        return <span className="status-badge badge-pending">En attente</span>;
      case 'confirmed':
        return <span className="status-badge badge-confirmed">Confirmée</span>;
      case 'in_delivery':
        return <span className="status-badge badge-warning">En cours de livraison</span>;
      case 'delivered':
      case 'completed':
        return <span className="status-badge badge-completed">Livrée</span>;
      case 'cancelled':
        return <span className="status-badge badge-cancelled">Annulée</span>;
      default:
        return null;
    }
  };

  return (
    <div className="admin-module-page">
      <div className="module-page-header">
        <div>
          <h2 className="module-title font-brand">Commandes & Livraisons</h2>
          <p className="module-subtitle">
            Suivi des commandes passées en ligne pour livraison à domicile ou à emporter.
          </p>
        </div>

        <div className="filter-pills">
          <button
            type="button"
            className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Toutes ({orders.length})
          </button>
          <button
            type="button"
            className={`filter-pill ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            En attente ({orders.filter((o) => o.status === 'pending').length})
          </button>
          <button
            type="button"
            className={`filter-pill ${filter === 'in_delivery' ? 'active' : ''}`}
            onClick={() => setFilter('in_delivery')}
          >
            En livraison ({orders.filter((o) => o.status === 'in_delivery').length})
          </button>
          <button
            type="button"
            className={`filter-pill ${filter === 'delivered' ? 'active' : ''}`}
            onClick={() => setFilter('delivered')}
          >
            Livrées ({orders.filter((o) => o.status === 'delivered').length})
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="card-luxury admin-empty-state">
          <p>Aucune donnée pour le moment.</p>
          <span className="empty-subtext">
            Les commandes passées depuis la rubrique Livraison apparaîtront automatiquement ici.
          </span>
        </div>
      ) : (
        <div className="admin-table-wrapper card-luxury">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Réf. / Date</th>
                <th>Client</th>
                <th>Articles commandés</th>
                <th>Total</th>
                <th>Adresse de livraison</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((ord) => (
                <tr key={ord.id}>
                  <td>
                    <span className="code-ref">#{ord.id.slice(-6)}</span>
                    <span className="date-sub">
                      {new Date(ord.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </td>
                  <td>
                    <strong>{ord.customerName}</strong>
                    <a href={`tel:${ord.phone}`} className="table-phone-link">
                      {ord.phone}
                    </a>
                  </td>
                  <td>
                    <ul className="table-items-list">
                      {ord.items.map((it, idx) => (
                        <li key={idx}>
                          {it.quantity}x {it.title} ({it.price.toLocaleString()} FCFA)
                        </li>
                      ))}
                    </ul>
                    {ord.notes && <div className="table-note-pill">Note: {ord.notes}</div>}
                  </td>
                  <td>
                    <strong className="text-gold">
                      {ord.totalAmount.toLocaleString()} FCFA
                    </strong>
                  </td>
                  <td>
                    <span className="address-text">{ord.deliveryAddress}</span>
                  </td>
                  <td>{getStatusBadge(ord.status)}</td>
                  <td>
                    <div className="table-actions-cell">
                      <select
                        className="status-select-sm"
                        value={ord.status}
                        onChange={(e) =>
                          handleStatusChange(
                            ord.id,
                            e.target.value as RequestStatus | 'in_delivery' | 'delivered'
                          )
                        }
                      >
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmer</option>
                        <option value="in_delivery">En livraison</option>
                        <option value="delivered">Marquer Livrée</option>
                        <option value="cancelled">Annuler</option>
                      </select>

                      <button
                        type="button"
                        className="icon-btn-delete"
                        onClick={() => handleDelete(ord.id)}
                        title="Supprimer la commande"
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