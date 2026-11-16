import React, { useState } from 'react';
import type { CustomerReview } from '../../types';
import { storageService } from '../../services/storageService';
import { CheckIcon, ArrowRightIcon } from '../common/Icons';
import './Avis.css';

interface AvisProps {
  reviews: CustomerReview[];
}

export const Avis: React.FC<AvisProps> = ({ reviews }) => {
  // Affiche uniquement les avis réels validés par l'administration
  const approvedReviews = reviews.filter((r) => r.isApproved);

  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      storageService.saveReview({
        authorName: authorName.trim(),
        rating,
        comment: comment.trim(),
        date: new Date().toISOString().split('T')[0],
      });
      setIsSubmitting(false);
      setSubmitted(true);
    }, 500);
  };

  const handleReset = () => {
    setSubmitted(false);
    setAuthorName('');
    setRating(5);
    setComment('');
  };

  return (
    <section id="avis" className="section-wrapper avis-section">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mx-auto avis-header">
          <div className="section-tag">
            <span className="section-tag-dot" />
            <span>Retours d'Expérience</span>
          </div>

          <h2 className="section-title">
            Témoignages & Avis <br />
            <span className="heading-red">de Notre Clientèle</span>
          </h2>

          <p className="section-description mx-auto">
            L'excellence de notre accueil se mesure à travers vos impressions. Découvrez les retours
            vérifiés ou partagez votre propre expérience à Ferrari Lounge 229.
          </p>

          <div className="gold-divider center" />
        </div>

        <div className="avis-layout">
          {/* Reviews List */}
          <div className="avis-list-col">
            <h3 className="avis-col-title font-brand">Avis Clients Vérifiés</h3>

            {approvedReviews.length === 0 ? (
              <div className="card-luxury avis-empty-box">
                <span className="empty-star">⭐</span>
                <h4 className="font-brand">Aucun avis publié pour le moment</h4>
                <p>
                  Les avis sont modérés avant publication. Soyez le premier client à partager votre
                  ressenti sur notre cuisine, notre service et notre ambiance à Akpakpa !
                </p>
              </div>
            ) : (
              <div className="reviews-cards-stack">
                {approvedReviews.map((rev) => (
                  <div key={rev.id} className="card-luxury review-card">
                    <div className="review-head">
                      <div>
                        <strong className="review-author">{rev.authorName}</strong>
                        <span className="review-date">{rev.date}</span>
                      </div>
                      <div className="review-stars">
                        {'★'.repeat(rev.rating)}
                        {'☆'.repeat(5 - rev.rating)}
                      </div>
                    </div>
                    <p className="review-text">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Review Form */}
          <div className="avis-form-col">
            <div className="card-luxury review-form-card">
              <h3 className="form-heading font-brand">Laisser Votre Avis</h3>
              <p className="form-subheading">
                Votre avis sera soumis à notre équipe avant publication sur le site.
              </p>

              {submitted ? (
                <div className="review-success-state">
                  <div className="success-icon-wrap">
                    <CheckIcon size={28} />
                  </div>
                  <h4 className="font-brand">Merci pour votre retour !</h4>
                  <p>
                    Votre avis a été enregistré avec succès et sera visible publiquement après
                    validation par notre administration.
                  </p>
                  <button type="button" className="btn btn-outline-red btn-sm" onClick={handleReset}>
                    Rédiger un autre avis
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="review-form">
                  <div className="form-group">
                    <label className="form-label">
                      Votre Nom ou Prénom <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Paul A."
                      className="form-input"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Votre Note globale</label>
                    <div className="rating-selector">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`star-select-btn ${star <= rating ? 'active' : ''}`}
                          onClick={() => setRating(star)}
                        >
                          ★
                        </button>
                      ))}
                      <span className="rating-label-text">{rating} / 5 étoiles</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Votre Commentaire <span className="req">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Racontez votre expérience (accueil, plats dégustés, ambiance F1)..."
                      className="form-textarea"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-red review-submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span>Envoi en cours...</span>
                    ) : (
                      <>
                        <span>Transmettre mon avis</span>
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
    </section>
  );
};
