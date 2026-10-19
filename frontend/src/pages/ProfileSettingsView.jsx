import React, { useState } from 'react';
import {
  User,
  Settings,
  Globe,
  MapPin,
  Save,
  CheckCircle,
  Shield,
  Key
} from 'lucide-react';

export default function ProfileSettingsView({ userProfile, onUpdateProfile }) {
  const [profile, setProfile] = useState(
    userProfile || {
      name: 'Ramesh Kumar',
      role: 'Farmer',
      phone: '+91 98765 43210',
      state: 'Telangana',
      district: 'Hyderabad / Rangareddy',
      acres: 4.5,
      soilType: 'Clay Loam',
      waterSource: 'Borewell + Rainfed',
      language: 'English',
    }
  );
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile(profile);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="content-area" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '8px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#064e3b' }}>
          👤 Farmer Profile & Regional Settings
        </h2>
        <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
          Personalize crop recommendations, language preference, and localized weather advisories.
        </p>
      </div>

      <div className="dashboard-card" style={{ padding: '24px' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=160&q=80"
              alt="Farmer Profile"
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #10b981' }}
            />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{profile.name}</h3>
              <span style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 600 }}>
                Verified Farmer • Kisan ID: TEL-2026-8842
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Registered Mobile Number
              </label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                State / UT
              </label>
              <select
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', background: 'white' }}
              >
                <option value="Telangana">Telangana</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Punjab">Punjab</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Total Farm Acreage (Acres)
              </label>
              <input
                type="number"
                step="0.1"
                value={profile.acres}
                onChange={(e) => setProfile({ ...profile, acres: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Primary Soil Type
              </label>
              <select
                value={profile.soilType}
                onChange={(e) => setProfile({ ...profile, soilType: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', background: 'white' }}
              >
                <option value="Clay Loam">Clay Loam</option>
                <option value="Black Cotton Soil">Black Cotton Soil</option>
                <option value="Red Sandy Soil">Red Sandy Soil</option>
                <option value="Alluvial Soil">Alluvial Soil</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Preferred Assistant Language
              </label>
              <select
                value={profile.language}
                onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', background: 'white' }}
              >
                <option value="English">English</option>
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="Hindi">हिन्दी (Hindi)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
                <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                <option value="Marathi">मराठी (Marathi)</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {saved && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '0.84rem', fontWeight: 600 }}>
                  <CheckCircle size={16} />
                  <span>Profile updated successfully!</span>
                </span>
              )}
              {onSwitchAccount && (
                <button
                  type="button"
                  onClick={onSwitchAccount}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#334155',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Switch / Login as Another Farmer
                </button>
              )}
            </div>

            <button
              type="submit"
              style={{
                background: '#10b981',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.86rem',
                padding: '10px 24px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
              }}
            >
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
