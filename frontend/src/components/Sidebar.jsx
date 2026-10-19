import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Sprout,
  FlaskConical,
  Droplets,
  Bug,
  Landmark,
  FileText,
  FileCheck,
  User,
  ArrowRight,
  Leaf
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'chat', label: 'Ask AI Assistant', icon: MessageSquare },
  { id: 'crops', label: 'Crop Recommendation', icon: Sprout },
  { id: 'fertilizer', label: 'Fertilizer Guidance', icon: FlaskConical },
  { id: 'irrigation', label: 'Irrigation Advice', icon: Droplets },
  { id: 'pests', label: 'Pest & Disease Control', icon: Bug },
  { id: 'schemes', label: 'Government Schemes', icon: Landmark },
  { id: 'documents', label: 'Document Library', icon: FileText },
  { id: 'summarization', label: 'Summarization', icon: FileCheck },
  { id: 'profile', label: 'Profile & Settings', icon: User },
];

export default function Sidebar({ activeTab, onSelectTab }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-badge">
          <Leaf size={22} strokeWidth={2.5} />
        </div>
        <div className="logo-text">
          <h1>AgriAI</h1>
          <span>Smart Farming Assistant</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <IconComponent size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="promo-card">
          <div className="promo-card-content">
            <h4>Grow Better With AI</h4>
            <p>Smart advice for higher yields and sustainable farming.</p>
            <button
              className="promo-btn"
              onClick={() => onSelectTab('chat')}
            >
              <span>Learn More</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
