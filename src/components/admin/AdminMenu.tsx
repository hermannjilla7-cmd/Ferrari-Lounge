import React, { useState } from 'react';
import type { MenuItem, MenuCategory } from '../../types';
import { storageService } from '../../services/storageService';
import { CloseIcon } from '../common/Icons';

interface AdminMenuProps {
  menuItems: MenuItem[];
}

export const AdminMenu: React.FC<AdminMenuProps> = ({ menuItems }) => {
  const [selectedCat, setSelectedCat] = useState<MenuCategory | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MenuCategory>('cafe_cocktails');
  const [price, setPrice] = useState<number>(5000);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [badge, setBadge] = useState('');
  const [isActive, setIsActive] = useState(true);

  const categories: { id: MenuCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Tous' },
    { id: 'cafe_cocktails', label: 'Café & Cocktails' },
    { id: 'entrees_tapas', label: 'Entrées & Tapas' },
    { id: 'plats_signatures', label: 'Plats Signatures' },
    { id: 'desserts', label: 'Desserts' },
  ];

  const filtered =
    selectedCat === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCat);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle('');
    setCategory('cafe_cocktails');
    setPrice(5000);
    setDescription('');
    setImage('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80');
    setBadge('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setPrice(item.price);
    setDescription(item.description);
    setImage(item.image);
    setBadge(item.badge || '');
    setIsActive(item.isActive);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || price <= 0) return;

    storageService.saveMenuItem({
      id: editingItem?.id,
      title: title.trim(),
      category,
      price: Number(price),
      description: description.trim(),
      image: image.trim() || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      badge: badge.trim() || undefined,
      isActive,
    });

    setIsModalOpen(false);
  };

  const handleToggleActive = (id: string) => {
    storageService.toggleMenuItemActive(id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet article de la carte ?')) {
      storageService.deleteMenuItem(id);
    }
  };

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('fr-FR').format(p) + ' FCFA';
  };

  return (
    <div className="admin-module-page">
      <div className="module-page-header">
        <div>
          <h2 className="module-title font-brand">Gestion de la Carte & Menu</h2>
          <p className="module-subtitle">
            Configurez les plats, boissons et cocktails affichés sur le site public
          </p>
        </div>
        <button
          type="button"
          className="btn btn-red btn-sm"
          onClick={handleOpenAdd}
        >
          <span>+ Ajouter un plat / boisson</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="card-luxury filters-bar">
        <div className="status-filters">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`filter-chip ${selectedCat === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCat(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of menu cards */}
      <div className="admin-cards-grid">
        {filtered.map((item) => (
          <div key={item.id} className={`card-luxury admin-menu-item-card ${!item.isActive ? 'item-disabled' : ''}`}>
            <div className="admin-menu-thumb-wrap">
              <img src={item.image} alt={item.title} className="admin-menu-thumb" />
              {item.badge && <span className="menu-badge badge-red">{item.badge}</span>}
              <span className={`menu-status-pill ${item.isActive ? 'badge-green' : 'badge-subtle'}`}>
                {item.isActive ? 'Actif au menu' : 'Désactivé'}
              </span>
            </div>

            <div className="admin-menu-info">
              <div className="admin-menu-title-row">
                <h3 className="admin-item-title font-brand">{item.title}</h3>
                <span className="admin-item-price font-brand">{formatPrice(item.price)}</span>
              </div>
              <p className="admin-item-desc">{item.description}</p>
            </div>

            <div className="admin-item-actions">
              <button
                type="button"
                className={`btn-toggle-active ${item.isActive ? 'active' : ''}`}
                onClick={() => handleToggleActive(item.id)}
                title={item.isActive ? 'Désactiver du site' : 'Activer sur le site'}
              >
                {item.isActive ? 'Désactiver' : 'Activer'}
              </button>

              <button
                type="button"
                className="btn-edit-item"
                onClick={() => handleOpenEdit(item)}
              >
                Modifier
              </button>

              <button
                type="button"
                className="btn-delete-item"
                onClick={() => handleDelete(item.id)}
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content card-luxury" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title font-brand">
                {editingItem ? 'Modifier le plat ou cocktail' : 'Ajouter un nouvel article au menu'}
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="modal-body admin-modal-form">
              <div className="form-group">
                <label className="form-label">Titre du plat ou boisson <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cocktail Monza Spritz"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Catégorie <span className="req">*</span></label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as MenuCategory)}
                  >
                    <option value="cafe_cocktails">Café & Cocktails</option>
                    <option value="entrees_tapas">Entrées & Tapas</option>
                    <option value="plats_signatures">Plats Signatures</option>
                    <option value="desserts">Desserts & Douceurs</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Prix (en FCFA) <span className="req">*</span></label>
                  <input
                    type="number"
                    required
                    min={500}
                    step={100}
                    className="form-input"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description ou ingrédients</label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  placeholder="Détails de la recette, accompagnements, origines..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">URL de la photo</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    className="form-input"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Badge promotionnel (facultatif)</label>
                  <input
                    type="text"
                    placeholder="Ex: Signature, Nouveau, Chef..."
                    className="form-input"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-checkbox-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  <span>Rendre immédiatement visible sur le site public</span>
                </label>
              </div>

              <div className="modal-actions-bar">
                <button type="submit" className="btn btn-red btn-sm">
                  {editingItem ? 'Enregistrer les modifications' : 'Ajouter au menu'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-gold btn-sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
