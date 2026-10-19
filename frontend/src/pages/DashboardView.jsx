import React, { useState, useRef, useEffect } from 'react';
import {
  Leaf,
  FileText,
  Sprout,
  ShieldAlert,
  Droplets,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Send,
  Paperclip,
  FlaskConical,
  Bug,
  Landmark,
  Sun,
  CloudSun,
  MoreVertical,
  Upload,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Info
} from 'lucide-react';
import { sendChatMessage, uploadDocumentFile } from '../services/api';

export default function DashboardView({
  stats,
  weather,
  marketPrices,
  documents,
  recentQueries,
  onSelectTab,
  onSelectSource,
  onAskQuestion,
}) {
  const [heroPrompt, setHeroPrompt] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content:
        "Hello! I'm your AI Farming Assistant. I can help you with crop selection, soil health, fertilizer dosage, irrigation, pest control and government schemes. What would you like to know today?",
      time: '10:24 AM',
    },
    {
      id: 2,
      role: 'user',
      content: 'What is the best fertilizer for paddy crop?',
      time: '10:27 AM',
    },
    {
      id: 3,
      role: 'assistant',
      content:
        'For paddy (rice) crop, urea, DAP and MOP are commonly recommended. The typical dosage is 40-60 kg N, 20-25 kg P2O5 and 20-25 kg K2O per hectare. You can also use organic manure for better soil health. (Source: ICAR - Paddy Manual)',
      time: '10:27 AM',
      sources: [
        {
          document_name: 'Paddy_Cultivation_Guide.pdf',
          page_number: 12,
          section_title: 'Nutrient and Fertilizer Management',
          relevance_score: 0.92,
          content:
            'Recommended dose of fertilizer for paddy: 120:60:60 kg/ha N:P2O5:K2O. Apply entire DAP and 50% MOP basally. Top-dress Urea in two splits at active tillering and panicle initiation.',
        },
        {
          document_name: 'ICAR_Paddy_Manual.pdf',
          page_number: 4,
          section_title: 'Soil Fertility & Balanced Nutrition',
          relevance_score: 0.88,
          content:
            'For medium duration paddy, incorporate 10 tonnes/ha FYM or green manure (Dhaincha) during land preparation. Apply 25 kg/ha Zinc Sulphate in zinc-deficient soils.',
        },
      ],
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatScrollRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await sendChatMessage(text);
      const botMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.answer,
        time: response.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: response.sources || [],
      };
      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content:
          'For paddy crop, urea, DAP and MOP are commonly recommended. Apply 120:60:60 kg/ha NPK with 25 kg/ha Zinc Sulphate. (Source: ICAR - Paddy Manual, Page 4)',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: [
          {
            document_name: 'Rice_Cultivation_Manual.pdf',
            page_number: 4,
            section_title: 'Nutrient & Fertilizer Schedules',
            relevance_score: 0.91,
            content:
              'Nutrient and Fertilizer Management: Recommended NPK ratio is 120:60:60 kg/ha. Apply all DAP, 50% MOP basally, and top-dress Urea at tillering and panicle initiation.',
          },
        ],
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleHeroSubmit = (e) => {
    e.preventDefault();
    if (!heroPrompt.trim()) return;
    handleSendMessage(heroPrompt);
    setHeroPrompt('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadDocumentFile(file);
      alert(`Successfully uploaded and indexed ${file.name}!`);
    } catch (err) {
      alert(`Upload note: ${err.message}`);
    }
  };

  return (
    <div className="content-area">
      {/* 1. Hero Banner */}
      <section className="hero-banner">
        <div className="hero-text">
          <h2>Welcome to AgriAI</h2>
          <div className="subtitle">Your Smart Farming Assistant</div>
          <p>
            Get expert advice on crops, soil, weather, fertilizers, pest control and
            government schemes — all in one place.
          </p>

          <form onSubmit={handleHeroSubmit} className="hero-search-box">
            <Leaf size={18} color="#10b981" />
            <input
              type="text"
              placeholder="Ask anything about farming... (e.g., best crop for black soil, fertilizer dosage, pest control)"
              value={heroPrompt}
              onChange={(e) => setHeroPrompt(e.target.value)}
            />
            <button type="submit" className="hero-search-btn" title="Ask AI">
              <Send size={15} />
            </button>
          </form>
        </div>

        <div className="hero-graphic">
          <div className="hero-tagline">
            <Leaf size={14} color="#10b981" />
            <span>Better Farming, Brighter Future</span>
          </div>
          <img
            src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=480&q=80"
            alt="Farmer in field with tablet"
            className="hero-image"
          />
        </div>
      </section>

      {/* 2. KPI Counter Stats Grid */}
      <section className="stats-grid">
        <div className="stat-card" onClick={() => onSelectTab('chat')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon icon-green">
            <Leaf size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-title">Total Queries</span>
            <span className="stat-value">{stats?.total_queries || 24}</span>
            <span className="stat-trend">
              <TrendingUp size={13} /> ↑ 12% this week
            </span>
          </div>
        </div>

        <div className="stat-card" onClick={() => onSelectTab('documents')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon icon-blue">
            <FileText size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-title">Documents Processed</span>
            <span className="stat-value">{stats?.documents_processed || 8}</span>
            <span className="stat-trend">
              <TrendingUp size={13} /> ↑ 2% this week
            </span>
          </div>
        </div>

        <div className="stat-card" onClick={() => onSelectTab('crops')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon icon-orange">
            <Sprout size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-title">Crop Recommendations</span>
            <span className="stat-value">{stats?.crop_recommendations || 5}</span>
            <span className="stat-trend">
              <TrendingUp size={13} /> ↑ 3% this week
            </span>
          </div>
        </div>

        <div className="stat-card" onClick={() => onSelectTab('pests')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon icon-purple">
            <ShieldAlert size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-title">Pest Alerts</span>
            <span className="stat-value">{stats?.pest_alerts || 3}</span>
            <span className="stat-trend">
              <TrendingUp size={13} /> ↑ 1% this week
            </span>
          </div>
        </div>

        <div className="stat-card" onClick={() => onSelectTab('irrigation')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon icon-cyan">
            <Droplets size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-title">Irrigation Tips</span>
            <span className="stat-value">{stats?.irrigation_tips || 6}</span>
            <span className="stat-trend">
              <TrendingUp size={13} /> ↑ 4% this week
            </span>
          </div>
        </div>
      </section>

      {/* 3. Main Dashboard 2-Column Grid */}
      <div className="dashboard-grid">
        {/* Left Column: Popular Topics + Recent Queries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Popular Topics */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Popular Topics</h3>
              <span className="view-all-link" onClick={() => onSelectTab('chat')}>
                View All <ChevronRight size={14} />
              </span>
            </div>

            <div className="topics-grid">
              <div className="topic-tile" onClick={() => onSelectTab('crops')}>
                <div className="icon-wrap" style={{ background: '#ecfdf5', color: '#10b981' }}>
                  <Sprout size={18} />
                </div>
                <div>
                  <h4>Crop Selection</h4>
                  <p>Best crops for your soil and climate</p>
                </div>
              </div>

              <div className="topic-tile" onClick={() => onSelectTab('crops')}>
                <div className="icon-wrap" style={{ background: '#fef3c7', color: '#d97706' }}>
                  <Leaf size={18} />
                </div>
                <div>
                  <h4>Soil Health</h4>
                  <p>Soil testing & management tips</p>
                </div>
              </div>

              <div className="topic-tile" onClick={() => onSelectTab('irrigation')}>
                <div className="icon-wrap" style={{ background: '#ecfeff', color: '#06b6d4' }}>
                  <Droplets size={18} />
                </div>
                <div>
                  <h4>Irrigation</h4>
                  <p>Water management and scheduling</p>
                </div>
              </div>

              <div className="topic-tile" onClick={() => onSelectTab('fertilizer')}>
                <div className="icon-wrap" style={{ background: '#f0fdf4', color: '#059669' }}>
                  <FlaskConical size={18} />
                </div>
                <div>
                  <h4>Fertilizer</h4>
                  <p>Right fertilizer & dosage</p>
                </div>
              </div>

              <div className="topic-tile" onClick={() => onSelectTab('pests')}>
                <div className="icon-wrap" style={{ background: '#fef2f2', color: '#ef4444' }}>
                  <Bug size={18} />
                </div>
                <div>
                  <h4>Pest Control</h4>
                  <p>Identify and manage pests & diseases</p>
                </div>
              </div>

              <div className="topic-tile" onClick={() => onSelectTab('schemes')}>
                <div className="icon-wrap" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
                  <Landmark size={18} />
                </div>
                <div>
                  <h4>Government Schemes</h4>
                  <p>Subsidies, loans & benefits</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Queries */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Recent Queries</h3>
              <span className="view-all-link" onClick={() => onSelectTab('chat')}>
                View All <ChevronRight size={14} />
              </span>
            </div>

            <div className="queries-list">
              {[
                {
                  text: 'Best fertilizer for paddy crop',
                  time: 'Today, 10:24 AM',
                  icon: Leaf,
                  iconColor: '#10b981',
                  bg: '#ecfdf5',
                },
                {
                  text: 'How to control rice stem borer?',
                  time: 'Yesterday, 04:12 PM',
                  icon: Bug,
                  iconColor: '#ef4444',
                  bg: '#fef2f2',
                },
                {
                  text: 'Drip irrigation setup for tomato',
                  time: 'Yesterday, 11:32 AM',
                  icon: Droplets,
                  iconColor: '#06b6d4',
                  bg: '#ecfeff',
                },
                {
                  text: 'PM-KISAN scheme details',
                  time: '2 days ago',
                  icon: Landmark,
                  iconColor: '#8b5cf6',
                  bg: '#f5f3ff',
                },
                {
                  text: 'Soil pH value for maize',
                  time: '2 days ago',
                  icon: Sprout,
                  iconColor: '#10b981',
                  bg: '#ecfdf5',
                },
              ].map((q, idx) => {
                const Icon = q.icon;
                return (
                  <div
                    key={idx}
                    className="query-row"
                    onClick={() => handleSendMessage(q.text)}
                  >
                    <div className="query-left">
                      <div
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          background: q.bg,
                          color: q.iconColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={16} />
                      </div>
                      <span className="query-text">{q.text}</span>
                    </div>
                    <span className="query-time">{q.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions + Weather + Market Prices */}
        <div className="right-column">
          {/* Quick Actions */}
          <div className="dashboard-card">
            <h3 className="card-title" style={{ marginBottom: '14px' }}>
              Quick Actions
            </h3>
            <button className="quick-action-item" onClick={() => onSelectTab('chat')}>
              <div className="action-left">
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Leaf size={15} />
                </div>
                <span>Ask AI Assistant</span>
              </div>
              <ChevronRight size={16} color="#94a3b8" />
            </button>

            <button className="quick-action-item" onClick={() => onSelectTab('crops')}>
              <div className="action-left">
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sprout size={15} />
                </div>
                <span>Get Crop Recommendation</span>
              </div>
              <ChevronRight size={16} color="#94a3b8" />
            </button>

            <button className="quick-action-item" onClick={() => onSelectTab('fertilizer')}>
              <div className="action-left">
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FlaskConical size={15} />
                </div>
                <span>Fertilizer Guidance</span>
              </div>
              <ChevronRight size={16} color="#94a3b8" />
            </button>

            <button className="quick-action-item" onClick={() => onSelectTab('schemes')}>
              <div className="action-left">
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#faf5ff', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Landmark size={15} />
                </div>
                <span>View Government Schemes</span>
              </div>
              <ChevronRight size={16} color="#94a3b8" />
            </button>
          </div>

          {/* Current Weather */}
          <div className="dashboard-card weather-details-card">
            <div className="card-header" style={{ marginBottom: '4px' }}>
              <h3 className="card-title">Current Weather</h3>
              <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 600 }}>
                {weather?.location || 'Hyderabad'}
              </span>
            </div>

            <div className="weather-main-row">
              <div>
                <div className="weather-temp-big">{weather?.temperature_c || 28}°C</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>
                  {weather?.condition || 'Partly Cloudy'}
                </div>
              </div>
              <Sun size={42} color="#f59e0b" />
            </div>

            <div className="weather-metrics-grid">
              <div className="metric-item">
                <div className="label">Humidity</div>
                <div className="val">{weather?.humidity_percent || 68}%</div>
              </div>
              <div className="metric-item">
                <div className="label">Wind Speed</div>
                <div className="val">{weather?.wind_speed_kmh || 12} km/h</div>
              </div>
              <div className="metric-item">
                <div className="label">Rainfall</div>
                <div className="val">{weather?.rainfall_mm || 0} mm</div>
              </div>
            </div>
          </div>

          {/* Market Prices (Today) */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Market Prices (Today)</h3>
              <span className="view-all-link" onClick={() => onSelectTab('crops')}>
                View All <ChevronRight size={14} />
              </span>
            </div>

            <div className="market-table">
              <div className="market-item">
                <div>
                  <div className="commodity">Rice (Paddy)</div>
                  <div className="variety">Fine Grade</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="price">₹ 2100/qtl</div>
                  <div className="change-up">↑ 1%</div>
                </div>
              </div>

              <div className="market-item">
                <div>
                  <div className="commodity">Cotton</div>
                  <div className="variety">Medium Staple</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="price">₹ 6400/qtl</div>
                  <div className="change-down">↓ 1%</div>
                </div>
              </div>

              <div className="market-item">
                <div>
                  <div className="commodity">Maize</div>
                  <div className="variety">Yellow Hybrid</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="price">₹ 2250/qtl</div>
                  <div className="change-up">↑ 2.1%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid: 4 Core Feature Cards */}
      <div className="bottom-grid">
        {/* Card 1: AI Farming Assistant */}
        <div className="dashboard-card chat-card">
          <div className="card-header" style={{ marginBottom: '8px' }}>
            <h3 className="card-title">
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Leaf size={14} />
              </div>
              <span>AI Farming Assistant</span>
            </h3>
          </div>
          <div className="chat-subhead">
            Ask questions, get expert advice, and learn from trusted agricultural knowledge.
          </div>

          <div className="chat-stream-box" ref={chatScrollRef}>
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`chat-bubble ${msg.role === 'user' ? 'user' : 'bot'}`}>
                <div>{msg.content}</div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="chat-sources-chips">
                    {msg.sources.map((s, sidx) => (
                      <span
                        key={sidx}
                        className="source-chip"
                        onClick={() => onSelectSource(s)}
                        title="Click to view grounding manual passage"
                      >
                        <FileText size={11} color="#059669" />
                        <span>{s.document_name} (Page {s.page_number})</span>
                      </span>
                    ))}
                  </div>
                )}
                <span className="chat-time">{msg.time}</span>
              </div>
            ))}
            {isTyping && (
              <div className="chat-bubble bot">
                <span style={{ fontStyle: 'italic', color: '#64748b' }}>
                  Retrieving trusted agricultural manuals and synthesizing...
                </span>
              </div>
            )}
          </div>

          <div className="chat-input-bar">
            <button
              type="button"
              className="chat-action-btn"
              title="Upload document or photo"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip size={16} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              type="button"
              className="chat-send-btn"
              onClick={() => handleSendMessage()}
            >
              <Send size={14} />
            </button>
          </div>
        </div>

        {/* Card 2: Crop Recommendation */}
        <div className="dashboard-card crop-recom-card">
          <div className="card-header">
            <h3 className="card-title">
              <Sprout size={18} color="#10b981" />
              <span>Crop Recommendation</span>
            </h3>
            <span className="view-all-link" onClick={() => onSelectTab('crops')}>
              View All <ChevronRight size={14} />
            </span>
          </div>

          <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '12px' }}>
            Based on your soil type, climate and market demand, we recommend the following crops:
          </p>

          <div className="crop-mini-cards">
            {/* Rice */}
            <div className="crop-card-item">
              <img
                src="https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=300&q=80"
                alt="Rice"
              />
              <div className="crop-card-body">
                <h4>Rice</h4>
                <div>
                  <span className="crop-badge-green">High Profitability</span>
                </div>
                <div className="crop-subtext">Good for your region</div>
                <button
                  className="crop-details-btn"
                  onClick={() => onSelectTab('crops')}
                >
                  View Details →
                </button>
              </div>
            </div>

            {/* Maize */}
            <div className="crop-card-item">
              <img
                src="https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=300&q=80"
                alt="Maize"
              />
              <div className="crop-card-body">
                <h4>Maize</h4>
                <div>
                  <span className="crop-badge-blue">Moderate Profitability</span>
                </div>
                <div className="crop-subtext">Suitable for summer</div>
                <button
                  className="crop-details-btn"
                  onClick={() => onSelectTab('crops')}
                >
                  View Details →
                </button>
              </div>
            </div>

            {/* Groundnut */}
            <div className="crop-card-item">
              <img
                src="https://images.unsplash.com/photo-1568283096533-078a24930eb8?auto=format&fit=crop&w=300&q=80"
                alt="Groundnut"
              />
              <div className="crop-card-body">
                <h4>Groundnut</h4>
                <div>
                  <span className="crop-badge-green">Good Profitability</span>
                </div>
                <div className="crop-subtext">Low water requirement</div>
                <button
                  className="crop-details-btn"
                  onClick={() => onSelectTab('crops')}
                >
                  View Details →
                </button>
              </div>
            </div>
          </div>

          <div className="why-crops-box">
            <h5>Why these crops?</h5>
            <div className="why-pills">
              <span className="why-pill">
                <Leaf size={11} color="#10b981" /> Suitable soil pH (6.0 - 7.5)
              </span>
              <span className="why-pill">
                <Droplets size={11} color="#06b6d4" /> Good rainfall (500 - 1200 mm)
              </span>
              <span className="why-pill">
                <TrendingUp size={11} color="#059669" /> High market demand in your area
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Field Insights */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <Leaf size={18} color="#10b981" />
              <span>Field Insights</span>
            </h3>
          </div>

          <div className="field-map-preview">
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=500&q=80"
              alt="Farm satellite overview"
            />
            {/* Interactive Pins */}
            <div className="map-pin" style={{ top: '35%', left: '30%' }}>
              <span className="pin-dot pin-green"></span>
              <span>Healthy</span>
            </div>
            <div className="map-pin" style={{ top: '55%', left: '68%' }}>
              <span className="pin-dot pin-orange"></span>
              <span>Water Stress</span>
            </div>
            <div className="map-pin" style={{ top: '75%', left: '45%' }}>
              <span className="pin-dot pin-red"></span>
              <span>Pest Alert</span>
            </div>

            <button
              className="view-map-btn"
              onClick={() => onSelectTab('crops')}
            >
              <span>View Full Map</span>
              <ArrowRight size={10} />
            </button>
          </div>

          <div className="recent-alerts-feed">
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '2px' }}>
              Recent Alerts
            </div>

            <div className="alert-row">
              <div className="alert-icon" style={{ color: '#ef4444' }}>
                <Bug size={14} />
              </div>
              <div className="alert-info">
                <h6>Pest risk detected in 2 fields (Leaf Folder)</h6>
                <span>2 hours ago</span>
              </div>
            </div>

            <div className="alert-row">
              <div className="alert-icon" style={{ color: '#f97316' }}>
                <Droplets size={14} />
              </div>
              <div className="alert-info">
                <h6>Low soil moisture in Field 3</h6>
                <span>5 hours ago</span>
              </div>
            </div>

            <div className="alert-row">
              <div className="alert-icon" style={{ color: '#eab308' }}>
                <Sun size={14} />
              </div>
              <div className="alert-info">
                <h6>High temperature forecast (35°C)</h6>
                <span>1 day ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Document Library */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <FileText size={18} color="#ef4444" />
              <span>Document Library</span>
            </h3>
            <span className="view-all-link" onClick={() => onSelectTab('documents')}>
              View All <ChevronRight size={14} />
            </span>
          </div>

          <div className="doc-list">
            {[
              { name: 'Rice_Cultivation_Manual.pdf', size: '2.4 MB', time: '2 days ago' },
              { name: 'Soil_Health_Guide.pdf', size: '1.8 MB', time: '3 days ago' },
              { name: 'Pest_Management.pdf', size: '3.2 MB', time: '4 days ago' },
              { name: 'Government_Schemes.pdf', size: '1.1 MB', time: '5 days ago' },
              { name: 'Fertilizer_Recommendation.pdf', size: '2.7 MB', time: '6 days ago' },
            ].map((doc, idx) => (
              <div key={idx} className="doc-row">
                <div className="doc-left">
                  <FileText size={16} className="doc-icon" />
                  <div>
                    <div className="doc-name">{doc.name}</div>
                    <div className="doc-meta">{doc.size} • {doc.time}</div>
                  </div>
                </div>
                <MoreVertical size={14} color="#94a3b8" style={{ cursor: 'pointer' }} />
              </div>
            ))}
          </div>

          <div
            className="upload-dropzone"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={18} />
            <p>Upload more documents</p>
            <span>PDF, DOC, DOCX (Max 10MB)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
