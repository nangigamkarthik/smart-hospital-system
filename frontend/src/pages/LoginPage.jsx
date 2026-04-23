import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  HeartPulse,
  Lock,
  LogIn,
  Shield,
  ShieldCheck,
  Stethoscope,
  User,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../services/AuthContext';
import {
  PORTALS,
  ROLE_LABELS,
  getDefaultRouteForRole,
  isRoleAllowedForPortal,
} from '../utils/permissions';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [selectedPortal, setSelectedPortal] = useState('admin');
  const [loading, setLoading] = useState(false);

  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const result = await login(credentials);

    if (result.success) {
      const savedUser = JSON.parse(localStorage.getItem('user') || 'null');

      if (!isRoleAllowedForPortal(savedUser?.role, selectedPortal)) {
        logout();
        toast.error(
          `This account belongs to the ${ROLE_LABELS[savedUser?.role] || savedUser?.role} area. Please choose the correct portal.`
        );
        setLoading(false);
        return;
      }

      toast.success(`Login successful - ${PORTALS[selectedPortal].label}`);
      navigate(getDefaultRouteForRole(savedUser?.role), { replace: true });
    } else {
      toast.error(result.error || 'Login failed. Please check your credentials.');
    }

    setLoading(false);
  };

  const handlePortalSelect = (portalId) => {
    setSelectedPortal(portalId);
  };

  const handleUseDemo = (portalId) => {
    const portal = PORTALS[portalId];
    setSelectedPortal(portalId);
    setCredentials({
      username: portal.demo.username,
      password: portal.demo.password,
    });
    toast.success(`${portal.label} demo credentials loaded.`);
  };

  const handleChange = (event) => {
    setCredentials((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className="login-shell">
      <div className="login-shell__glow login-shell__glow--one" />
      <div className="login-shell__glow login-shell__glow--two" />

      <div className="login-layout">
        <section className="login-showcase">
          <div className="login-showcase__brand">
            <div className="login-showcase__brand-mark">
              <Building2 size={28} />
            </div>

            <div>
              <div className="login-showcase__eyebrow">Smart Hospital System</div>
              <h1 className="login-showcase__title">A calmer, faster front door for modern care teams.</h1>
            </div>
          </div>

          <p className="login-showcase__copy">
            Coordinate patient intake, appointments, staffing, and clinical records from one focused workspace.
          </p>

          <div className="portal-grid">
            {Object.values(PORTALS).map((portal) => {
              const portalIcons = {
                admin: Shield,
                doctor: Stethoscope,
                user: User,
              };
              const Icon = portalIcons[portal.id];

              return (
                <button
                  className={`portal-card ${portal.accent} ${selectedPortal === portal.id ? 'is-active' : ''}`}
                  key={portal.id}
                  onClick={() => handlePortalSelect(portal.id)}
                  type="button"
                >
                  <div className="portal-card__header">
                    <Icon size={18} />
                    <strong>{portal.label}</strong>
                  </div>
                  <p>{portal.description}</p>
                </button>
              );
            })}
          </div>

          <div className="login-showcase__highlights">
            <div className="login-highlight-card">
              <ShieldCheck size={18} />
              <div>
                <strong>Secure access</strong>
                <span>Role-aware controls for doctors, admin, and reception.</span>
              </div>
            </div>

            <div className="login-highlight-card">
              <HeartPulse size={18} />
              <div>
                <strong>Live operational pulse</strong>
                <span>See appointment flow, occupancy, and care bottlenecks quickly.</span>
              </div>
            </div>
          </div>

          <div className="login-demo-card">
            <div className="login-demo-card__title">Demo credentials</div>
            {Object.values(PORTALS).map((portal) => (
              <button
                className="login-demo-card__row login-demo-card__button"
                key={portal.id}
                onClick={() => handleUseDemo(portal.id)}
                type="button"
              >
                <span>{portal.label}</span>
                <strong>{portal.demo.username} / {portal.demo.password}</strong>
              </button>
            ))}
          </div>
        </section>

        <section className="login-panel">
          <div className="login-panel__header">
            <div className="shell-chip shell-chip--soft">{PORTALS[selectedPortal].label}</div>
            <h2 className="login-panel__title">Sign in to continue</h2>
            <p className="login-panel__subtitle">
              {PORTALS[selectedPortal].description}
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-field">
              <span>Username</span>
              <div className="login-field__control">
                <User size={18} />
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                />
              </div>
            </label>

            <label className="login-field">
              <span>Password</span>
              <div className="login-field__control">
                <Lock size={18} />
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </label>

            <button className="primary-button login-submit" disabled={loading} type="submit">
              {loading ? (
                <>
                  <span className="loading-spinner loading-spinner--small" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Enter workspace</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
