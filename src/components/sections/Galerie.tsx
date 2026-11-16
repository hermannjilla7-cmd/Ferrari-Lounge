import React, { useState } from 'react';
import type { GalleryItem } from '../../types';
import { CloseIcon } from '../common/Icons';
import './Galerie.css';

interface GalerieProps {
  galleryItems: GalleryItem[];
}

export const Galerie: React.FC<GalerieProps> = ({ galleryItems }) => {
  const [selectedCat, setSelectedCat] = useState<'all' | GalleryItem['category']>('all');
  const [lightboxImg, setLightboxImg] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: 'Toutes les photos' },
    { id: 'ambiance', label: 'Ambiance & Décor' },
    { id: 'gastronomie', label: 'Cuisine & Cocktails' },
    { id: 'automobile', label: 'Passion Automobile' },
    { id: 'evenements', label: 'Soirées & F1' },
  ];

  const filtered =
    selectedCat === 'all'
      ? galleryItems
      : galleryItems.filter((g) => g.category === selectedCat);

  return (
    <section id="galerie" className="section-wrapper galerie-section">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mx-auto galerie-header">
          <div className="section-tag">
            <span className="section-tag-dot" />
            <span>Galerie Visuelle</span>
          </div>

          <h2 className="section-title">
            Immersion dans l'Univers <br />
            <span className="heading-red">Ferrari Lounge 229</span>
          </h2>

          <p className="section-description mx-auto">
            Explorez l'atmosphère unique de notre établissement : du raffinement de nos assiettes
            au caractère racé de notre décor à Akpakpa, Cotonou.
          </p>

          <div className="gold-divider center" />
        </div>

        {/* Category Filter Pills */}
        <div className="galerie-nav">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`galerie-filter-btn ${selectedCat === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCat(cat.id as any)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="galerie-grid">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="card-luxury galerie-item"
              onClick={() => setLightboxImg(item)}
            >
              <img src={item.image} alt={item.title} className="galerie-thumb" loading="lazy" />
              <div className="galerie-overlay">
                <span className="galerie-zoom-icon">🔍</span>
                <h4 className="galerie-item-title font-brand">{item.title}</h4>
                {item.caption && <p className="galerie-item-caption">{item.caption}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxImg && (
          <div className="lightbox-backdrop" onClick={() => setLightboxImg(null)}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="lightbox-close-btn"
                onClick={() => setLightboxImg(null)}
                aria-label="Fermer"
              >
                <CloseIcon size={24} />
              </button>
              <img src={lightboxImg.image} alt={lightboxImg.title} className="lightbox-image" />
              <div className="lightbox-caption-box">
                <h3 className="font-brand">{lightboxImg.title}</h3>
                {lightboxImg.caption && <p>{lightboxImg.caption}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
