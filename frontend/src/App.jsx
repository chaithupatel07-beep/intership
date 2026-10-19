import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SourceModal from './components/SourceModal';

// Views
import DashboardView from './pages/DashboardView';
import ChatAssistantView from './pages/ChatAssistantView';
import CropRecommendationView from './pages/CropRecommendationView';
import FertilizerGuidanceView from './pages/FertilizerGuidanceView';
import IrrigationAdviceView from './pages/IrrigationAdviceView';
import PestControlView from './pages/PestControlView';
import GovernmentSchemesView from './pages/GovernmentSchemesView';
import DocumentLibraryView from './pages/DocumentLibraryView';
import SummarizationView from './pages/SummarizationView';
import ProfileSettingsView from './pages/ProfileSettingsView';
import AuthView from './pages/AuthView';

import {
  fetchDocuments,
  fetchMarketPrices,
  fetchRecentQueries,
  fetchSystemStats,
  fetchWeather,
  updateFarmerProfile
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState(null);

  // Multi-User & Farmer Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('agri_farmer_user');
      return saved
        ? JSON.parse(saved)
        : {
            id: 'usr_ramesh',
            name: 'Ramesh Kumar',
            email: 'ramesh@agriai.org',
            role: 'Farmer',
            phone: '+91 98765 43210',
            state: 'Telangana',
            district: 'Hyderabad / Rangareddy',
            acres: 4.5,
            soil_type: 'Clay Loam',
            primary_crops: 'Rice (Paddy), Maize',
            language: 'English',
            avatar_url:
              'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=160&q=80',
          };
    } catch {
      return null;
    }
  });

  const [authToken, setAuthToken] = useState(() => {
    try {
      return localStorage.getItem('agri_farmer_token') || 'demo_token';
    } catch {
      return 'demo_token';
    }
  });

  const [showAuthModal, setShowAuthModal] = useState(false);

  // Global agricultural state
  const [stats, setStats] = useState({
    total_queries: 24,
    documents_processed: 8,
    crop_recommendations: 5,
    pest_alerts: 3,
    irrigation_tips: 6,
  });

  const [weather, setWeather] = useState({
    location: 'Hyderabad',
    temperature_c: 28,
    condition: 'Partly Cloudy',
    humidity_percent: 68,
    wind_speed_kmh: 12,
    rainfall_mm: 0,
  });

  const [marketPrices, setMarketPrices] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [recentQueries, setRecentQueries] = useState([]);

  // Cross-page parameters
  const [fertilizerCrop, setFertilizerCrop] = useState('Rice (Paddy)');
  const [summarizationDoc, setSummarizationDoc] = useState('Rice_Cultivation_Manual.txt');

  useEffect(() => {
    // Fetch initial state from backend
    fetchSystemStats().then(setStats).catch(() => {});
    fetchWeather(currentUser?.state || 'Hyderabad').then(setWeather).catch(() => {});
    fetchMarketPrices().then((res) => setMarketPrices(res.prices || [])).catch(() => {});
    fetchDocuments().then((res) => setDocuments(res.documents || [])).catch(() => {});
    fetchRecentQueries().then((res) => setRecentQueries(res.recent_queries || [])).catch(() => {});
  }, [currentUser]);

  const handleAuthSuccess = (user, token) => {
    setCurrentUser(user);
    setAuthToken(token);
    try {
      localStorage.setItem('agri_farmer_user', JSON.stringify(user));
      localStorage.setItem('agri_farmer_token', token);
    } catch {}
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('agri_farmer_user');
      localStorage.removeItem('agri_farmer_token');
    } catch {}
    setCurrentUser(null);
    setShowAuthModal(true);
  };

  const handleUpdateProfile = async (updatedFields) => {
    const merged = { ...currentUser, ...updatedFields };
    setCurrentUser(merged);
    try {
      localStorage.setItem('agri_farmer_user', JSON.stringify(merged));
      if (merged.id) {
        await updateFarmerProfile(merged.id, updatedFields);
      }
    } catch (err) {
      console.error('Error saving profile to backend:', err);
    }
  };

  const handleSearchSubmit = (query) => {
    setActiveTab('chat');
  };

  const handleAskQuestionFromWidget = (query) => {
    setActiveTab('chat');
  };

  const handleSummarizeDoc = (filename) => {
    setSummarizationDoc(filename);
    setActiveTab('summarization');
  };

  // If user explicitly requests auth or has logged out completely
  if (showAuthModal || !currentUser) {
    return (
      <AuthView
        onAuthSuccess={handleAuthSuccess}
        onCancel={currentUser ? () => setShowAuthModal(false) : null}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Left Navigation Sidebar */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main App Content Viewport */}
      <div className="main-wrapper">
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearchSubmit={handleSearchSubmit}
          weather={weather}
          userProfile={currentUser}
          onOpenProfile={() => setActiveTab('profile')}
          onOpenAuth={() => setShowAuthModal(true)}
          onLogout={handleLogout}
        />

        {activeTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            weather={weather}
            marketPrices={marketPrices}
            documents={documents}
            recentQueries={recentQueries}
            onSelectTab={setActiveTab}
            onSelectSource={setSelectedSource}
            onAskQuestion={handleAskQuestionFromWidget}
            userProfile={currentUser}
          />
        )}

        {activeTab === 'chat' && (
          <ChatAssistantView
            onSelectSource={setSelectedSource}
            userProfile={currentUser}
          />
        )}

        {activeTab === 'crops' && (
          <CropRecommendationView
            onSelectTab={setActiveTab}
            onSetFertilizerCrop={setFertilizerCrop}
            userProfile={currentUser}
          />
        )}

        {activeTab === 'fertilizer' && (
          <FertilizerGuidanceView
            initialCrop={fertilizerCrop}
            userProfile={currentUser}
          />
        )}

        {activeTab === 'irrigation' && (
          <IrrigationAdviceView />
        )}

        {activeTab === 'pests' && (
          <PestControlView
            onAskQuestion={handleAskQuestionFromWidget}
          />
        )}

        {activeTab === 'schemes' && (
          <GovernmentSchemesView
            userProfile={currentUser}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentLibraryView
            onSelectSource={setSelectedSource}
            onSummarizeDoc={handleSummarizeDoc}
          />
        )}

        {activeTab === 'summarization' && (
          <SummarizationView
            preselectedDoc={summarizationDoc}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileSettingsView
            userProfile={currentUser}
            onUpdateProfile={handleUpdateProfile}
            onSwitchAccount={() => setShowAuthModal(true)}
          />
        )}
      </div>

      {/* Grounding Source Citation Inspection Modal */}
      {selectedSource && (
        <SourceModal
          source={selectedSource}
          onClose={() => setSelectedSource(null)}
        />
      )}
    </div>
  );
}
