import React, { useState, useEffect } from 'react';
import type { CarRentalRequest, Vehicle, RequestStatus } from '../../types';
import { storageService } from '../../services/storageService';
import { TrashIcon, PlusIcon, CloseIcon } from '../common/Icons';

export const AdminRental: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'requests' | 'vehicles'>('requests');
  const [requests, setRequests] = useState<CarRentalRequest[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Modal ajout véhicule
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [vehName, setVehName] = useState('');
  const [vehBrand, setVehBrand] = useState('');
  const [vehCategory, setVehCategory] = useState('Berline de luxe');
  const [vehDailyRate, setVehDailyRate] = useState<number | ''>(50000);
  const [vehDescription, setVehDescription] = useState('');
  const [vehImage, setVehImage] = useState('');

  const loadData = () => {
    setRequests(storageService.getRentalRequests());
    setVehicles(storageService.getVehicles());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('ferrari_data_updated', handleUpdate);
    return () => window.removeEventListener('ferrari_data_updated', handleUpdate);
  }, []);

  const handleRequestStatus = (id: string, status: RequestStatus) => {
    storageService.updateRentalStatus(id, status);
    loadData();
  };

  const handleDeleteRequest = (id: string) => {
    if (window.confirm('Supprimer cette demande de location ?')) {
      storageService.deleteRentalRequest(id);
      loadData();
    }
  };

  const handleToggleVehicleAvail = (v: Vehicle) => {
    storageService.saveVehicle({
      id: v.id,
      name: v.name,
      brand: v.brand,
      category: v.category,
      description: v.description,
      features: v.features,
      dailyRate: v.dailyRate,
      image: v.image,
      isAvailable: !v.isAvailable,
    });
    loadData();
  };

  const handleDeleteVehicle = (id: string) => {
    if (window.confirm('Supprimer ce véhicule du catalogue ?')) {
      storageService.deleteVehicle(id);
      loadData();
    }
  };

  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehName.trim() || !vehBrand.trim()) return;

    storageService.saveVehicle({
      name: vehName.trim(),
      brand: vehBrand.trim(),
      category: vehCategory,
      dailyRate: vehDailyRate === '' ? null : Number(vehDailyRate),
      description: vehDescription.trim(),
      features: ['Climatisation', 'Intérieur Cuir', 'Assurance incluse'],
      image: vehImage.trim() || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
    });

    setShowAddVehicle(false);
    setVehName('');
    setVehBrand('');
    setVehDescription('');
    setVehImage('');
    loadData();
  };

  return (
    <div className="admin-module-page">
      <div className="module-page-header">
        <div>
          <h2 className="module-title font-brand">Location de Véhicules de Prestige</h2>
          <p className="module-subtitle">
            Gestion du parc automobile et traitement des demandes de location reçues.
          </p>
        </div>

        <div className="filter-pills">
          <button
            type="button"
            className={`filter-pill ${activeSubTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('requests')}
          >
            Demandes reçues ({requests.length})
          </button>
          <button
            type="button"
            className={`filter-pill ${activeSubTab === 'vehicles' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('vehicles')}
          >
            Catalogue Véhicules ({vehicles.length})
          </button>
        </div>
      </div>

      {/* ================= Onglet Demandes reçues ================= */}
      {activeSubTab === 'requests' && (
        <>
          {requests.length === 0 ? (
            <div className="card-luxury admin-empty-state">
              <p>Aucune donnée pour le moment.</p>
              <span className="empty-subtext">
                Toutes les demandes de location soumises depuis le site public apparaîtront ici.
              </span>
            </div>
          ) : (
            <div className="admin-table-wrapper card-luxury">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Réf. / Date</th>
                    <th>Client</th>
                    <th>Véhicule souhaité</th>
                    <th>Période</th>
                    <th>Chauffeur</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id}>
                      <td>
                        <span className="code-ref">#{req.id.slice(-6)}</span>
                        <span className="date-sub">
                          {new Date(req.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
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
                        <span className="font-semibold text-white">
                          {req.vehicleName || 'Modèle libre'}
                        </span>
                        {req.message && <div className="table-note-pill">Note: {req.message}</div>}
                      </td>
                      <td>
                        <span className="text-gold">
                          Du {req.startDate} au {req.endDate}
                        </span>
                      </td>
                      <td>
                        {req.withDriver ? (
                          <span className="status-badge badge-confirmed">Avec chauffeur</span>
                        ) : (
                          <span className="status-badge badge-pending">Sans chauffeur</span>
                        )}
                      </td>
                      <td>
                        {req.status === 'pending' && (
                          <span className="status-badge badge-pending">En attente</span>
                        )}
                        {req.status === 'confirmed' && (
                          <span className="status-badge badge-confirmed">Confirmée</span>
                        )}
                        {req.status === 'completed' && (
                          <span className="status-badge badge-completed">Terminée</span>
                        )}
                        {req.status === 'cancelled' && (
                          <span className="status-badge badge-cancelled">Annulée</span>
                        )}
                      </td>
                      <td>
                        <div className="table-actions-cell">
                          <select
                            className="status-select-sm"
                            value={req.status}
                            onChange={(e) =>
                              handleRequestStatus(req.id, e.target.value as RequestStatus)
                            }
                          >
                            <option value="pending">En attente</option>
                            <option value="confirmed">Confirmer</option>
                            <option value="completed">Terminée</option>
                            <option value="cancelled">Annuler</option>
                          </select>

                          <button
                            type="button"
                            className="icon-btn-delete"
                            onClick={() => handleDeleteRequest(req.id)}
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
        </>
      )}

      {/* ================= Onglet Véhicules ================= */}
      {activeSubTab === 'vehicles' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="section-sub-title font-brand">Parc Automobile Répertorié</h3>
            <button
              type="button"
              className="btn btn-red btn-sm"
              onClick={() => setShowAddVehicle(true)}
            >
              <PlusIcon size={16} />
              <span>Ajouter un véhicule</span>
            </button>
          </div>

          {vehicles.length === 0 ? (
            <div className="card-luxury admin-empty-state">
              <p>Aucune donnée pour le moment.</p>
              <span className="empty-subtext">
                Aucun véhicule n'est encore enregistré dans la flotte. Cliquez sur « Ajouter un
                véhicule » pour créer votre première fiche.
              </span>
              <button
                type="button"
                className="btn btn-outline-gold btn-sm mt-3"
                onClick={() => setShowAddVehicle(true)}
              >
                + Enregistrer le premier véhicule
              </button>
            </div>
          ) : (
            <div className="admin-cards-grid">
              {vehicles.map((v) => (
                <div key={v.id} className="card-luxury admin-car-card">
                  <div className="admin-car-img-wrap">
                    <img src={v.image} alt={v.name} className="admin-car-img" />
                    <span
                      className={`status-pill ${
                        v.isAvailable ? 'status-avail' : 'status-unavail'
                      }`}
                    >
                      {v.isAvailable ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                  <div className="admin-car-body">
                    <h4 className="font-brand font-bold text-white text-lg">{v.name}</h4>
                    <span className="text-gold text-xs">{v.brand} • {v.category}</span>
                    <p className="text-gray-400 text-sm mt-2">{v.description}</p>
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/10">
                      <span className="font-bold text-white">
                        {v.dailyRate ? `${v.dailyRate.toLocaleString()} FCFA/j` : 'Sur devis'}
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="btn btn-outline-gold btn-xs"
                          onClick={() => handleToggleVehicleAvail(v)}
                        >
                          {v.isAvailable ? 'Rendre Indispo' : 'Rendre Dispo'}
                        </button>
                        <button
                          type="button"
                          className="icon-btn-delete"
                          onClick={() => handleDeleteVehicle(v.id)}
                          title="Supprimer"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal Ajout Véhicule */}
          {showAddVehicle && (
            <div className="admin-modal-overlay" onClick={() => setShowAddVehicle(false)}>
              <div className="admin-modal-box card-luxury" onClick={(e) => e.stopPropagation()}>
                <div className="modal-head">
                  <h3 className="font-brand text-lg text-white">Ajouter un véhicule à la flotte</h3>
                  <button
                    type="button"
                    className="modal-close-btn"
                    onClick={() => setShowAddVehicle(false)}
                  >
                    <CloseIcon size={18} />
                  </button>
                </div>

                <form onSubmit={handleAddVehicleSubmit} className="mt-4">
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">
                        Nom / Modèle <span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Mercedes-Benz Classe S"
                        className="form-input"
                        value={vehName}
                        onChange={(e) => setVehName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Marque <span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Mercedes-Benz"
                        className="form-input"
                        value={vehBrand}
                        onChange={(e) => setVehBrand(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Catégorie</label>
                      <input
                        type="text"
                        placeholder="Ex: Berline Prestige, SUV VIP..."
                        className="form-input"
                        value={vehCategory}
                        onChange={(e) => setVehCategory(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tarif journalier (FCFA)</label>
                      <input
                        type="number"
                        min="0"
                        step="5000"
                        placeholder="Ex: 75000"
                        className="form-input"
                        value={vehDailyRate}
                        onChange={(e) =>
                          setVehDailyRate(e.target.value === '' ? '' : Number(e.target.value))
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description & Atouts</label>
                    <textarea
                      rows={2}
                      placeholder="Confort absolu, vitres teintées, sonorisation Burmester..."
                      className="form-textarea"
                      value={vehDescription}
                      onChange={(e) => setVehDescription(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">URL de la photo</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      className="form-input"
                      value={vehImage}
                      onChange={(e) => setVehImage(e.target.value)}
                    />
                  </div>

                  <div className="modal-actions mt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      className="btn btn-outline-gold btn-sm"
                      onClick={() => setShowAddVehicle(false)}
                    >
                      Annuler
                    </button>
                    <button type="submit" className="btn btn-red btn-sm">
                      Enregistrer le véhicule
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};