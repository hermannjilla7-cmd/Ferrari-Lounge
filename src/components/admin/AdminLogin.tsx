import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import type { AdminUser } from '../../types';
import { ArrowRightIcon } from '../common/Icons';
import './AdminLogin.css';

interface AdminLoginProps {
  onSuccess: (user: AdminUser) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToSite }) => {
  const isConfigured = storageService.hasAdminAccountConfigured();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('Direction Ferrari Lounge');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (!isConfigured) {
        if (!username.trim() || !password) {
          throw new Error('Veuillez renseigner un identifiant et un mot de passe administrateur.');
        }

        const session = await storageService.setupAdminAccount(username.trim(), password, displayName.trim() || 'Direction Ferrari Lounge');
        onSuccess({ name: session.displayName, username: session.username, role: 'Superadmin' });
        return;
      }

      const session = await storageService.loginAdmin(username.trim(), password);
      if (!session) {
        throw new Error('Identifiants administrateur incorrects.');
      }
      onSuccess({ name: session.displayName, username: session.username, role: 'Superadmin' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card card-luxury">
        <div className="admin-login-brand">
          <img
            src="/ferrari-logo.png"
            alt="Ferrari Lounge 229"
            className="admin-login-logo"
          />
          <h1 className="admin-portal-title font-brand">Administration FerrariLounge</h1>
          <p className="admin-portal-sub">Ferrari Lounge 229 • by Auto Craze 229</p>
        </div>

        <div className="gold-divider center" />

        {error && (
          <div className="admin-login-error">
            <span>⚠️ {error}</span>
          </div>
        )}

        {successMessage && (
          <div className="admin-login-success">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          {!isConfigured && (
            <div className="form-group">
              <label htmlFor="adm-display" className="form-label">
                Nom de l’administrateur
              </label>
              <input
                id="adm-display"
                type="text"
                className="form-input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Direction Ferrari Lounge"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="adm-user" className="form-label">
              {isConfigured ? 'Identifiant Administrateur' : 'Choisir un identifiant'}
            </label>
            <input
              id="adm-user"
              type="text"
              required
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={isConfigured ? 'ex: direction' : 'Choisissez votre identifiant'}
            />
          </div>

          <div className="form-group">
            <label htmlFor="adm-pass" className="form-label">
              {isConfigured ? 'Mot de passe' : 'Créer un mot de passe'}
            </label>
            <input
              id="adm-pass"
              type="password"
              required
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {!isConfigured && (
            <div className="login-demo-hint">
              <span className="hint-label">Premier accès administrateur</span>
              <div className="hint-keys">
                <code>Créez votre propre identifiant et mot de passe.</code>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-red admin-submit-btn" disabled={isLoading}>
            {isLoading ? (
              <span>{isConfigured ? 'Vérification...' : 'Création du compte...'}</span>
            ) : (
              <>
                <span>{isConfigured ? 'Connexion au Tableau de Bord' : 'Créer le compte administrateur'}</span>
                <ArrowRightIcon size={16} />
              </>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <button type="button" className="btn-back-public" onClick={onBackToSite}>
            ← Retourner au site public Ferrari Lounge 229
          </button>
        </div>
      </div>
    </div>
  );
};
