import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Sun,
  MapPin,
  ChevronDown,
  LogOut,
  Users,
  Settings,
  LogIn,
  CheckCircle2
} from 'lucide-react';

export default function Header({
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
  weather,
  userProfile,
  onOpenProfile,
  onOpenAuth,
  onLogout
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      onSearchSubmit(searchTerm);
    }
  };

  return (
    <header className="top-header">
      <div className="header-search">
        <Search size={17} color="#94a3b8" />
        <input
          type="text"
          placeholder="Search for crops, diseases, fertilizers, schemes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="header-right">
        <button className="notif-btn" title="4 new agricultural alerts">
          <Bell size={18} />
          <span className="notif-badge"></span>
        </button>

        <div className="weather-chip">
          <Sun size={17} color="#f59e0b" />
          <span className="temp">{weather?.temperature_c || 28}°C</span>
          <span className="desc">{weather?.condition || 'Partly Cloudy'}</span>
          <span className="loc">
            <MapPin size={13} />
            <span>{userProfile?.state || weather?.location || 'Hyderabad'}</span>
          </span>
        </div>

        {/* User Profile / Multi-Farmer Switcher */}
        {userProfile ? (
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <div
              className="user-profile"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '10px', transition: 'background 0.2s' }}
            >
              <img
                src={
                  userProfile.avatar_url ||
                  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=120&q=80'
                }
                alt={userProfile.name}
                className="user-avatar"
              />
              <div className="user-info">
                <div className="name">{userProfile.name}</div>
                <div className="role">{userProfile.role || 'Farmer'}</div>
              </div>
              <ChevronDown size={14} color="#64748b" style={{ marginLeft: '4px' }} />
            </div>

            {/* Dropdown Card */}
            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '10px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  width: '260px',
                  zIndex: 50,
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '14px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>{userProfile.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{userProfile.email}</div>
                  <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600, marginTop: '4px' }}>
                    {userProfile.acres || 4.5} Acres • {userProfile.state || 'Telangana'}
                  </div>
                </div>

                <div style={{ padding: '6px' }}>
                  <button
                    onClick={() => { setDropdownOpen(false); onOpenProfile(); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#334155',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Settings size={15} color="#64748b" />
                    <span>Farm Profile & Settings</span>
                  </button>

                  <button
                    onClick={() => { setDropdownOpen(false); onOpenAuth(); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#059669',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#ecfdf5')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Users size={15} color="#059669" />
                    <span>Switch Farmer / Sign In</span>
                  </button>

                  <button
                    onClick={() => { setDropdownOpen(false); onLogout(); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#ef4444',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <LogOut size={15} color="#ef4444" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            style={{
              background: '#10b981',
              color: 'white',
              fontSize: '0.82rem',
              fontWeight: 700,
              padding: '8px 16px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
            }}
          >
            <LogIn size={15} />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </header>
  );
}
