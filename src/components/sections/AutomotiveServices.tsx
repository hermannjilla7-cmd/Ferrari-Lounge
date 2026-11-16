import React, { useState } from 'react';
import type { Vehicle, AssistanceProblemType } from '../../types';
import { storageService } from '../../services/storageService';
import { CarIcon, PhoneIcon, CheckIcon, ArrowRightIcon } from '../common/Icons';
import './AutomotiveServices.css';

interface AutomotiveServicesProps {
  vehicles: Vehicle[];
}

export const AutomotiveServices: React.FC<AutomotiveServicesProps> = ({ vehicles }) => {
  const [activeTab, setActiveTab] = useState<'location' | 'depannage'>('location');

  // État formulaire Location
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [rentalFullName, setRentalFullName] = useState('');
  const [rentalPhone, setRentalPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [withDriver, setWithDriver] = useState(false);
  const [rentalMessage, setRentalMessage] = useState('');
  const [rentalSubmitted, setRentalSubmitted] = useState(false);
  const [rentalLoading, setRentalLoading] = useState(false);

  // État formulaire Dépannage
  const [assistFullName, setAssistFullName] = useState('');
  const [assistPhone, setAssistPhone] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [problemType, setProblemType] = useState<AssistanceProblemType>('mecanique');
  const [location, setLocation] = useState('');
  const [assistDesc, setAssistDesc] = useState('');
  const [assistSubmitted, setAssistSubmitted] = useState(false);
  const [assistLoading, setAssistLoading] = useState(false);

  const handleRentalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rentalFullName.trim() || !rentalPhone.trim() || !startDate || !endDate) return;

    setRentalLoading(true);
    setTimeout(() => {
      storageService.saveRentalRequest({
        fullName: rentalFullName.trim(),
        phone: rentalPhone.trim(),
        vehicleName: selectedVehicle || 'Véhicule standard / À définir',
        startDate,
        endDate,
        withDriver,
        message: rentalMessage.trim() || undefined,
      });
      setRentalLoading(false);
      setRentalSubmitted(true);
    }, 600);
  };

  const handleAssistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistFullName.trim() || !assistPhone.trim() || !vehicleModel.trim() || !location.trim())
      return;

    setAssistLoading(true);
    setTimeout(() => {
      storageService.saveAssistanceRequest({
        fullName: assistFullName.trim(),
        phone: assistPhone.trim(),
        vehicleModel: vehicleModel.trim(),
        problemType,
        location: location.trim(),
        description: assistDesc.trim() || undefined,
      });
      setAssistLoading(false);
      setAssistSubmitted(true);
    }, 600);
  };

  return (
    <section id="services-auto" className="section-wrapper automotive-section">
      <div className="container">
        {/* Header */}
        <div className="text-center mx-auto automotive-header">
          <div className="section-tag">
            <CarIcon size={14} />
            <span>Pôle Mobilité & Expertise</span>
          </div>

          <h2 className="section-title">
            Services Automobiles <br />
            <span className="heading-red">by Auto Craze 229</span>
          </h2>

          <p className="section-description mx-auto">
            Au-delà de notre lounge et restaurant d'exception, découvrez nos prestations de location
            de prestige et notre assistance automobile rapide à Cotonou et ses environs.
          </p>

          <div className="gold-divider center" />

          {/* Tab Switcher */}
          <div className="auto-tab-nav">
            <button
              type="button"
              className={`auto-tab-btn ${activeTab === 'location' ? 'active' : ''}`}
              onClick={() => setActiveTab('location')}
            >
              <CarIcon size={18} />
              <span>Location de Voitures</span>
            </button>
            <button
              type="button"
              className={`auto-tab-btn ${activeTab === 'depannage' ? 'active' : ''}`}
              onClick={() => setActiveTab('depannage')}
            >
              <PhoneIcon size={18} />
              <span>Dépannage & Assistance 24/7</span>
            </button>
          </div>
        </div>

        {/* ===================== TAB 1 : LOCATION DE VOITURES ===================== */}
        {activeTab === 'location' && (
          <div className="tab-pane-fade">
            <div className="rental-grid">
              {/* Colonne Liste des véhicules */}
              <div className="rental-catalog-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="pane-col-title font-brand">Véhicules Disponibles</h3>
                  <span className="count-badge">{vehicles.length} répertorié(s)</span>
                </div>

                {vehicles.length === 0 ? (
                  <div className="card-luxury zero-auto-box">
                    <div className="zero-icon">🚗</div>
                    <h4 className="font-brand">Aucun véhicule répertorié pour le moment</h4>
                    <p>
                      Notre catalogue de véhicules est en cours d'actualisation par la direction
                      Auto Craze 229.
                    </p>
                    <p className="zero-hint">
                      Vous pouvez soumettre une demande spontanée ci-contre ou nous joindre
                      directement par téléphone pour connaître les modèles actuellement disponibles.
                    </p>
                    <a
                      href="tel:+2290142688837"
                      className="btn btn-outline-gold btn-sm zero-phone-btn"
                    >
                      <PhoneIcon size={14} />
                      <span>Appeler le +229 01 42 68 88 37</span>
                    </a>
                  </div>
                ) : (
                  <div className="vehicles-list-stack">
                    {vehicles.map((v) => (
                      <div
                        key={v.id}
                        className={`card-luxury vehicle-item-card ${
                          selectedVehicle === v.name ? 'selected' : ''
                        }`}
                        onClick={() => setSelectedVehicle(v.name)}
                      >
                        {v.image && (
                          <div className="vehicle-thumb-wrap">
                            <img src={v.image} alt={v.name} className="vehicle-thumb" />
                          </div>
                        )}
                        <div className="vehicle-info">
                          <div className="vehicle-head">
                            <h4 className="vehicle-title font-brand">{v.name}</h4>
                            <span
                              className={`status-pill ${
                                v.isAvailable ? 'status-avail' : 'status-unavail'
                              }`}
                            >
                              {v.isAvailable ? 'Disponible' : 'Réservé'}
                            </span>
                          </div>
                          <span className="vehicle-category">
                            {v.brand} • {v.category}
                          </span>
                          <p className="vehicle-desc">{v.description}</p>
                          <div className="vehicle-foot">
                            {v.dailyRate ? (
                              <span className="vehicle-price">
                                <strong>{v.dailyRate.toLocaleString()} FCFA</strong> / jour
                              </span>
                            ) : (
                              <span className="vehicle-price text-muted">Tarif sur devis</span>
                            )}
                            <button
                              type="button"
                              className={`btn btn-sm ${
                                selectedVehicle === v.name ? 'btn-red' : 'btn-outline-gold'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedVehicle(v.name);
                              }}
                            >
                              {selectedVehicle === v.name ? 'Sélectionné' : 'Choisir ce modèle'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Colonne Formulaire de location */}
              <div className="rental-form-col">
                <div className="card-luxury rental-form-card">
                  <h3 className="form-heading font-brand">Demande de Location</h3>
                  <p className="form-subheading">
                    Transmettez vos dates et préférences. Notre équipe Auto Craze 229 vous
                    recontactera sous peu.
                  </p>

                  {rentalSubmitted ? (
                    <div className="auto-success-state">
                      <div className="success-icon-wrap">
                        <CheckIcon size={28} />
                      </div>
                      <h4 className="font-brand">Demande enregistrée avec succès !</h4>
                      <p>
                        Merci {rentalFullName}. Votre demande pour la période du{' '}
                        <strong>{startDate}</strong> au <strong>{endDate}</strong> a bien été
                        transmise à notre pôle automobile.
                      </p>
                      <button
                        type="button"
                        className="btn btn-outline-red btn-sm mt-3"
                        onClick={() => {
                          setRentalSubmitted(false);
                          setRentalFullName('');
                          setRentalPhone('');
                          setStartDate('');
                          setEndDate('');
                          setWithDriver(false);
                          setSelectedVehicle('');
                          setRentalMessage('');
                        }}
                      >
                        Effectuer une autre demande
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleRentalSubmit} className="auto-form">
                      <div className="form-group">
                        <label className="form-label">
                          Nom complet <span className="req">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Jean-Marc Dossou"
                          className="form-input"
                          value={rentalFullName}
                          onChange={(e) => setRentalFullName(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Téléphone / WhatsApp <span className="req">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+229 97 00 00 00"
                          className="form-input"
                          value={rentalPhone}
                          onChange={(e) => setRentalPhone(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Modèle souhaité</label>
                        <input
                          type="text"
                          placeholder="Ex: SUV Berline, Mercedes, ou modèle choisi"
                          className="form-input"
                          value={selectedVehicle}
                          onChange={(e) => setSelectedVehicle(e.target.value)}
                        />
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label className="form-label">
                            Date de début <span className="req">*</span>
                          </label>
                          <input
                            type="date"
                            required
                            className="form-input"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">
                            Date de fin <span className="req">*</span>
                          </label>
                          <input
                            type="date"
                            required
                            className="form-input"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="checkbox-custom-label">
                          <input
                            type="checkbox"
                            checked={withDriver}
                            onChange={(e) => setWithDriver(e.target.checked)}
                          />
                          <span>Option avec chauffeur professionnel dédié</span>
                        </label>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Précisions supplémentaires</label>
                        <textarea
                          rows={2}
                          placeholder="Itinéraire, besoin particulier, transfert aéroport..."
                          className="form-textarea"
                          value={rentalMessage}
                          onChange={(e) => setRentalMessage(e.target.value)}
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-red w-full mt-2"
                        disabled={rentalLoading}
                      >
                        {rentalLoading ? (
                          <span>Envoi en cours...</span>
                        ) : (
                          <>
                            <span>Envoyer la demande de location</span>
                            <ArrowRightIcon size={16} />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2 : DÉPANNAGE & ASSISTANCE ===================== */}
        {activeTab === 'depannage' && (
          <div className="tab-pane-fade">
            <div className="depannage-layout">
              {/* Infos & Engagement */}
              <div className="depannage-info-col">
                <div className="card-luxury depannage-banner">
                  <div className="banner-tag">Intervention Cotonou & Akpakpa</div>
                  <h3 className="banner-title font-brand">Assistance Rapide & Réparation</h3>
                  <p className="banner-desc">
                    Une panne, une batterie à plat ou un pneu crevé ? L'équipe technique Auto Craze
                    229 se mobilise immédiatement pour vous assister et sécuriser votre véhicule.
                  </p>

                  <div className="hotline-card">
                    <span className="hotline-label">Ligne d'Urgence Immédiate :</span>
                    <a href="tel:+2290142688837" className="hotline-number">
                      <PhoneIcon size={20} />
                      <span>+229 01 42 68 88 37</span>
                    </a>
                    <span className="hotline-note">Disponible 7j/7</span>
                  </div>

                  <ul className="assistance-features-list">
                    <li>
                      <CheckIcon size={16} />
                      <span>Diagnostic mécanique et électronique sur place</span>
                    </li>
                    <li>
                      <CheckIcon size={16} />
                      <span>Démarrage rapide booster batterie 12V</span>
                    </li>
                    <li>
                      <CheckIcon size={16} />
                      <span>Remplacement de roue & dépannage crevaison</span>
                    </li>
                    <li>
                      <CheckIcon size={16} />
                      <span>Remorquage sécurisé vers atelier agréé si nécessaire</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Formulaire Assistance */}
              <div className="depannage-form-col">
                <div className="card-luxury depannage-form-card">
                  <h3 className="form-heading font-brand">Signaler une Urgence / Panne</h3>
                  <p className="form-subheading">
                    Renseignez vos coordonnées et la localisation précise de votre véhicule pour une
                    intervention rapide.
                  </p>

                  {assistSubmitted ? (
                    <div className="auto-success-state">
                      <div className="success-icon-wrap">
                        <CheckIcon size={28} />
                      </div>
                      <h4 className="font-brand">Demande d'assistance reçue !</h4>
                      <p>
                        Notre équipe technique a bien reçu votre signalement pour{' '}
                        <strong>{vehicleModel}</strong> à <strong>{location}</strong>.
                      </p>
                      <p className="text-red-alert mt-2">
                        Un dépanneur vous contactera sur le <strong>{assistPhone}</strong> dans les
                        meilleurs délais.
                      </p>
                      <button
                        type="button"
                        className="btn btn-outline-red btn-sm mt-3"
                        onClick={() => {
                          setAssistSubmitted(false);
                          setAssistFullName('');
                          setAssistPhone('');
                          setVehicleModel('');
                          setLocation('');
                          setAssistDesc('');
                        }}
                      >
                        Nouveau signalement
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleAssistSubmit} className="auto-form">
                      <div className="form-row-2">
                        <div className="form-group">
                          <label className="form-label">
                            Votre Nom complet <span className="req">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: Alain Sètondji"
                            className="form-input"
                            value={assistFullName}
                            onChange={(e) => setAssistFullName(e.target.value)}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">
                            Téléphone d'urgence <span className="req">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="+229 01 00 00 00"
                            className="form-input"
                            value={assistPhone}
                            onChange={(e) => setAssistPhone(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label className="form-label">
                            Véhicule (Marque & Modèle) <span className="req">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: Toyota RAV4, Hyundai Elantra..."
                            className="form-input"
                            value={vehicleModel}
                            onChange={(e) => setVehicleModel(e.target.value)}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">
                            Type de panne <span className="req">*</span>
                          </label>
                          <select
                            className="form-select"
                            value={problemType}
                            onChange={(e) =>
                              setProblemType(e.target.value as AssistanceProblemType)
                            }
                          >
                            <option value="mecanique">Problème Mécanique / Moteur</option>
                            <option value="batterie">Batterie à plat / Déchargée</option>
                            <option value="crevaison">Crevaison / Pneu endommagé</option>
                            <option value="demarrage">Refus de démarrage</option>
                            <option value="autre">Autre panne / Remorquage</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Quartier / Repère précis <span className="req">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Akpakpa, carrefour Ciné Concorde, Cotonou..."
                          className="form-input"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Description du problème constaté</label>
                        <textarea
                          rows={3}
                          placeholder="Bruits suspects, voyant rouge allumé, fumée, situation exacte..."
                          className="form-textarea"
                          value={assistDesc}
                          onChange={(e) => setAssistDesc(e.target.value)}
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-red w-full mt-2"
                        disabled={assistLoading}
                      >
                        {assistLoading ? (
                          <span>Transmission de l'urgence...</span>
                        ) : (
                          <>
                            <span>Déclencher l'assistance technique</span>
                            <ArrowRightIcon size={16} />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};