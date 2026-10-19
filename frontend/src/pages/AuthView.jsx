import React, { useState, useEffect } from 'react';
import {
  Leaf,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Sprout,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers
} from 'lucide-react';
import { fetchDemoUsers, loginUser, signupUser } from '../services/api';

export default function AuthView({ onAuthSuccess, onCancel }) {
  const [isLogin, setIsLogin] = useState(true);
  const [demoUsers, setDemoUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('ramesh@agriai.org');
  const [loginPassword, setLoginPassword] = useState('farmer123');

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'Farmer',
    state: 'Telangana',
    district: 'Hyderabad',
    acres: 5.0,
    soil_type: 'Clay Loam',
    primary_crops: 'Rice (Paddy), Maize',
    water_source: 'Borewell + Rainfed',
  });

  useEffect(() => {
    fetchDemoUsers()
      .then((res) => setDemoUsers(res.demo_users || []))
      .catch(() => {});
  }, []);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await loginUser(loginEmail, loginPassword);
      onAuthSuccess(res.user, res.token);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!signupData.name || !signupData.email || !signupData.password) {
      setErrorMsg('Please fill in Name, Email, and Password.');
      return;
    }
    setLoading(true);
    try {
      const res = await signupUser(signupData);
      onAuthSuccess(res.user, res.token);
    } catch (err) {
      setErrorMsg(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (user) => {
    setLoginEmail(user.email);
    setLoginPassword('farmer123');
    setLoading(true);
    try {
      const res = await loginUser(user.email, 'farmer123');
      onAuthSuccess(res.user, res.token);
    } catch (err) {
      // Direct pass if local fallback
      onAuthSuccess(user, `token_${user.id}_demo`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #09261c 0%, #0d3829 50%, #061c14 100%)',
        padding: '20px',
        position: 'relative',
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          maxWidth: '1040px',
          width: '100%',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1.05fr 1.25fr',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Left Visual & Value Proposition Pane */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(6, 78, 59, 0.9) 0%, rgba(9, 38, 28, 0.95) 100%), url(https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80) center/cover',
            color: 'white',
            padding: '40px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <Leaf size={22} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1 }}>AgriAI</h1>
                <span style={{ fontSize: '0.74rem', color: '#a7f3d0' }}>Smart Farming Assistant (RAG)</span>
              </div>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '14px' }}>
              Join 50,000+ Farmers Making Scientific Decisions
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#d1fae5', lineHeight: 1.5, marginBottom: '28px' }}>
              Personalized agricultural intelligence grounded in ICAR manuals, Soil Health testing, and precision agronomy.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                'Crop Suitability & Profitability ranking for your exact soil pH',
                'Precision N-P-K fertilizer bag calculations (Urea, DAP, MOP)',
                'Integrated Pest & Disease Management with spray dosage recommendations',
                'Government subsidies & DBT benefits (PM-KISAN, PMFBY, PMKSY)',
              ].map((text, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span style={{ fontSize: '0.8rem', color: '#f0fdf4', lineHeight: 1.4 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              marginTop: '32px',
            }}
          >
            <div style={{ fontSize: '0.74rem', color: '#a7f3d0', fontWeight: 700, marginBottom: '2px' }}>
              GOVERNMENT COMPLIANT & RESEARCH BACKED
            </div>
            <div style={{ fontSize: '0.72rem', color: '#ecfdf5' }}>
              Data sourced directly from ICAR, DA&FW, DPPQS, and State Agricultural Universities.
            </div>
          </div>
        </div>

        {/* Right Form Pane */}
        <div style={{ padding: '36px 40px', display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflowY: 'auto' }}>
          {/* Top Switcher */}
          <div
            style={{
              display: 'flex',
              background: '#f1f5f9',
              borderRadius: '12px',
              padding: '4px',
              marginBottom: '20px',
            }}
          >
            <button
              onClick={() => { setIsLogin(true); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 700,
                background: isLogin ? '#ffffff' : 'transparent',
                color: isLogin ? '#064e3b' : '#64748b',
                boxShadow: isLogin ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              Sign In (Existing Farmer)
            </button>
            <button
              onClick={() => { setIsLogin(false); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 700,
                background: !isLogin ? '#ffffff' : 'transparent',
                color: !isLogin ? '#064e3b' : '#64748b',
                boxShadow: !isLogin ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              Register New Farmer
            </button>
          </div>

          {errorMsg && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                marginBottom: '16px',
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* Quick Demo Profiles Strip */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={13} color="#10b981" />
              <span>OR CLICK A DEMO FARMER TO SIGN IN INSTANTLY:</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {demoUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickDemoLogin(u)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ecfdf5';
                    e.currentTarget.style.borderColor = '#a7f3d0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <img
                    src={u.avatar_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=120&q=80'}
                    alt={u.name}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {u.name}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                      {u.acres} Ac • {u.state}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>MANUAL CREDENTIALS</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
          </div>

          {/* Form Content: Sign In vs Sign Up */}
          {isLogin ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Registered Email / Mobile
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc' }}>
                  <Mail size={16} color="#94a3b8" />
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. ramesh@agriai.org"
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc' }}>
                  <Lock size={16} color="#94a3b8" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.88rem' }}
                  />
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                  Default password for demo accounts: <strong>farmer123</strong>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '10px',
                  background: '#10b981',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  padding: '12px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
                }}
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Farm Dashboard'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Farmer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    placeholder="farmer@example.com"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={signupData.phone}
                    onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    placeholder="Create a password"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Role
                  </label>
                  <select
                    value={signupData.role}
                    onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', background: 'white' }}
                  >
                    <option value="Farmer">Farmer</option>
                    <option value="FPO Lead">FPO Lead</option>
                    <option value="Agronomist">Agronomist</option>
                    <option value="Agri Student">Agri Student</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    State
                  </label>
                  <select
                    value={signupData.state}
                    onChange={(e) => setSignupData({ ...signupData, state: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', background: 'white' }}
                  >
                    <option value="Telangana">Telangana</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Farm (Acres)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={signupData.acres}
                    onChange={(e) => setSignupData({ ...signupData, acres: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Primary Soil
                  </label>
                  <select
                    value={signupData.soil_type}
                    onChange={(e) => setSignupData({ ...signupData, soil_type: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', background: 'white' }}
                  >
                    <option value="Clay Loam">Clay Loam</option>
                    <option value="Black Cotton Soil">Black Cotton Soil</option>
                    <option value="Red Sandy Soil">Red Sandy Soil</option>
                    <option value="Alluvial Soil">Alluvial Soil</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Main Crops
                  </label>
                  <input
                    type="text"
                    value={signupData.primary_crops}
                    onChange={(e) => setSignupData({ ...signupData, primary_crops: e.target.value })}
                    placeholder="e.g. Rice, Maize, Tomato"
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '8px',
                  background: '#10b981',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  padding: '12px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
                }}
              >
                <span>{loading ? 'Creating Farmer Account...' : 'Register & Enter AgriAI'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {onCancel && (
            <button
              onClick={onCancel}
              style={{
                marginTop: '16px',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Continue as Guest / Preview Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
