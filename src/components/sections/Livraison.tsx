import React, { useState } from 'react';
import type { MenuItem, OrderItem } from '../../types';
import { storageService } from '../../services/storageService';
import { CheckIcon, ArrowRightIcon } from '../common/Icons';
import './Livraison.css';

interface LivraisonProps {
  menuItems: MenuItem[];
}

export const Livraison: React.FC<LivraisonProps> = ({ menuItems }) => {
  const activeItems = menuItems.filter((item) => item.isActive);

  const [cart, setCart] = useState<{ [itemId: string]: number }>({});
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);

  const handleQuantityChange = (itemId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      const updated = { ...prev };
      if (next === 0) {
        delete updated[itemId];
      } else {
        updated[itemId] = next;
      }
      return updated;
    });
  };

  const cartEntries = Object.entries(cart).map(([itemId, qty]) => {
    const item = activeItems.find((i) => i.id === itemId);
    return {
      item,
      quantity: qty,
      subtotal: (item?.price || 0) * qty,
    };
  }).filter((entry) => entry.item !== undefined);

  const totalAmount = cartEntries.reduce((sum, entry) => sum + entry.subtotal, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !deliveryAddress.trim() || cartEntries.length === 0) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const orderItems: OrderItem[] = cartEntries.map((e) => ({
        id: e.item!.id,
        title: e.item!.title,
        price: e.item!.price,
        quantity: e.quantity,
      }));

      const newOrder = storageService.saveOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        items: orderItems,
        totalAmount,
        notes: notes.trim() || undefined,
      });

      setIsSubmitting(false);
      setSubmittedOrderId(newOrder.id);
      setCart({});
    }, 600);
  };

  const handleReset = () => {
    setSubmittedOrderId(null);
    setCustomerName('');
    setPhone('');
    setDeliveryAddress('');
    setNotes('');
    setCart({});
  };

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('fr-FR').format(p) + ' FCFA';
  };

  return (
    <section id="livraison" className="section-wrapper livraison-section">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mx-auto livraison-header">
          <div className="section-tag">
            <span className="section-tag-dot" />
            <span>Livraison & À Emporter</span>
          </div>

          <h2 className="section-title">
            Commandes & Livraison à Domicile <br />
            <span className="heading-red">sur Cotonou & Akpakpa</span>
          </h2>

          <p className="section-description mx-auto">
            Sélectionnez vos mets et cocktails favoris, renseignez votre adresse de livraison et
            transmettez votre commande. Notre équipe vous contactera pour valider la préparation.
          </p>

          <div className="gold-divider center" />
        </div>

        {submittedOrderId ? (
          <div className="card-luxury livraison-success-card">
            <div className="success-icon-badge">
              <CheckIcon size={34} />
            </div>
            <h3 className="success-title font-brand">Commande Transmise avec Succès</h3>
            <p className="success-desc">
              Merci <strong>{customerName}</strong>. Votre commande <strong>N° {submittedOrderId}</strong>{' '}
              a bien été enregistrée dans notre système.
            </p>

            <div className="order-status-notice card-glass">
              <span className="notice-dot" />
              <div>
                <strong>Statut : En attente de confirmation téléphonique</strong>
                <p>
                  Notre standard vous appellera sous peu au <strong>{phone}</strong> pour confirmer
                  votre adresse à <em>{deliveryAddress}</em> et le délai estimé de livraison.
                </p>
              </div>
            </div>

            <button type="button" className="btn btn-outline-red" onClick={handleReset}>
              Passer une autre commande
            </button>
          </div>
        ) : (
          <div className="livraison-grid">
            {/* Left: Menu Items Selector */}
            <div className="livraison-menu-col">
              <h3 className="col-title font-brand">1. Choisissez vos plats et boissons</h3>

              <div className="livraison-items-list">
                {activeItems.map((item) => {
                  const qty = cart[item.id] || 0;
                  return (
                    <div key={item.id} className="card-luxury delivery-item-card">
                      <img src={item.image} alt={item.title} className="delivery-item-thumb" />

                      <div className="delivery-item-info">
                        <div className="delivery-item-head">
                          <h4 className="delivery-item-title font-brand">{item.title}</h4>
                          <span className="delivery-item-price font-brand">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                        <p className="delivery-item-desc">{item.description}</p>
                      </div>

                      <div className="quantity-controls">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={qty === 0}
                          aria-label="Diminuer"
                        >
                          -
                        </button>
                        <span className="qty-count">{qty}</span>
                        <button
                          type="button"
                          className="qty-btn add"
                          onClick={() => handleQuantityChange(item.id, 1)}
                          aria-label="Augmenter"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Cart Summary & Checkout Form */}
            <div className="livraison-checkout-col">
              <div className="card-luxury checkout-card">
                <h3 className="col-title font-brand">2. Récapitulatif & Coordonnées</h3>

                {cartEntries.length === 0 ? (
                  <div className="empty-cart-box">
                    <p>Votre panier est actuellement vide.</p>
                    <span>Sélectionnez un ou plusieurs plats à gauche pour commander.</span>
                  </div>
                ) : (
                  <>
                    <div className="cart-summary-items">
                      {cartEntries.map((e) => (
                        <div key={e.item!.id} className="cart-row">
                          <span className="cart-row-title">
                            {e.item!.title} × {e.quantity}
                          </span>
                          <span className="cart-row-sub font-brand">
                            {formatPrice(e.subtotal)}
                          </span>
                        </div>
                      ))}

                      <div className="cart-total-row">
                        <span className="total-label font-brand">TOTAL COMMANDE :</span>
                        <span className="total-val font-brand">{formatPrice(totalAmount)}</span>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="delivery-form">
                      <div className="form-group">
                        <label className="form-label">
                          Votre Nom complet <span className="req">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: M. Aristide K."
                          className="form-input"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Numéro de Téléphone (Bénin / Int.) <span className="req">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="Ex: +229 01 42 68 88 37"
                          className="form-input"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Adresse exacte de livraison à Cotonou <span className="req">*</span>
                        </label>
                        <textarea
                          rows={2}
                          required
                          placeholder="Quartier, rue, repère connu (ex: Akpakpa, près de Ciné Concorde)..."
                          className="form-textarea"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Instructions ou cuisson (facultatif)</label>
                        <input
                          type="text"
                          placeholder="Ex: Sans piment, sauce à part..."
                          className="form-input"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </div>

                      <div className="payment-notice-pill">
                        <span>Paiement à la livraison (Espèces ou Mobile Money après confirmation)</span>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-red submit-order-btn"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span>Transmission de la commande...</span>
                        ) : (
                          <>
                            <span>Confirmer la commande ({formatPrice(totalAmount)})</span>
                            <ArrowRightIcon size={16} />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
