import React, { useState } from 'react';
import type { MenuItem, MenuCategory } from '../../types';
import { UtensilsIcon } from '../common/Icons';
import './Menu.css';

interface MenuProps {
  items: MenuItem[];
  onReserveClick: () => void;
}

export const Menu: React.FC<MenuProps> = ({ items, onReserveClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'all'>('all');

  const categories: { id: MenuCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Toute la carte' },
    { id: 'cafe_cocktails', label: 'Café & Cocktails' },
    { id: 'entrees_tapas', label: 'Entrées & Tapas' },
    { id: 'plats_signatures', label: 'Plats Signatures' },
    { id: 'desserts', label: 'Desserts & Douceurs' },
  ];

  // Filtre uniquement les articles activés par l'administrateur
  const activeItems = items.filter((item) => item.isActive);
  const filteredItems =
    selectedCategory === 'all'
      ? activeItems
      : activeItems.filter((item) => item.category === selectedCategory);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  return (
    <section id="menu" className="section-wrapper menu-section">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mx-auto menu-header">
          <div className="section-tag">
            <UtensilsIcon size={14} />
            <span>Café - Resto - Lounge</span>
          </div>

          <h2 className="section-title">
            Notre Carte & <br />
            <span className="heading-red">Créations Culinaires</span>
          </h2>

          <p className="section-description mx-auto">
            Découvrez une sélection de mets raffinés, tapas festifs et cocktails signatures
            élaborés pour sublimer vos moments à Ferrari Lounge 229.
          </p>

          <div className="gold-divider center" />
        </div>

        {/* Categories Tab Navigation */}
        <div className="menu-categories-nav">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`menu-category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Menu Cards Grid */}
        <div className="menu-grid">
          {filteredItems.map((item) => (
            <article key={item.id} className="card-luxury menu-card">
              <div className="menu-card-img-wrap">
                <img
                  src={item.image}
                  alt={item.title}
                  className="menu-card-img"
                  loading="lazy"
                />
                <div className="menu-card-img-overlay" />
                {item.badge && <span className="menu-badge badge-red">{item.badge}</span>}
                {item.isDemo && (
                  <span className="menu-demo-tag" title="Article de démonstration">
                    Démo
                  </span>
                )}
              </div>

              <div className="menu-card-content">
                <div className="menu-card-header">
                  <h3 className="menu-item-title font-brand">{item.title}</h3>
                  <div className="menu-item-price font-brand">{formatPrice(item.price)}</div>
                </div>

                <p className="menu-item-desc">{item.description}</p>
              </div>
            </article>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="menu-empty-state">
            <p>Aucune donnée pour le moment.</p>
          </div>
        )}

        {/* Menu Footer CTA */}
        <div className="menu-footer-cta">
          <p className="menu-cta-text">
            Envie de savourer ces délices dans une ambiance d'exception ?
          </p>
          <button
            type="button"
            className="btn btn-red"
            onClick={onReserveClick}
          >
            <UtensilsIcon size={16} />
            <span>Réserver votre table pour déjeuner ou dîner</span>
          </button>
        </div>
      </div>
    </section>
  );
};
