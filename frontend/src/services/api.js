/**
 * API Service for AgriAI Smart Farming Assistant Frontend.
 * Provides typed, clean methods to communicate with the FastAPI backend.
 */

const API_BASE = '/api';

export async function sendChatMessage(message, sessionId = 'default_session', filterDocId = null) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      session_id: sessionId,
      filter_doc_id: filterDocId,
    }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to send chat message');
  }
  return response.json();
}

export async function fetchChatHistory(sessionId = 'default_session') {
  const response = await fetch(`${API_BASE}/chat/history?session_id=${encodeURIComponent(sessionId)}`);
  if (!response.ok) throw new Error('Failed to fetch chat history');
  return response.json();
}

export async function clearChatHistory(sessionId = 'default_session') {
  const response = await fetch(`${API_BASE}/chat/history?session_id=${encodeURIComponent(sessionId)}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to clear chat history');
  return response.json();
}

export async function fetchRecentQueries() {
  const response = await fetch(`${API_BASE}/chat/recent-queries`);
  if (!response.ok) throw new Error('Failed to fetch recent queries');
  return response.json();
}

export async function fetchSystemStats() {
  const response = await fetch(`${API_BASE}/chat/stats`);
  if (!response.ok) throw new Error('Failed to fetch system stats');
  return response.json();
}

export async function fetchCropRecommendations(params = {}) {
  const response = await fetch(`${API_BASE}/crops/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!response.ok) throw new Error('Failed to fetch crop recommendations');
  return response.json();
}

export async function calculateFertilizerDose(crop, acres) {
  const response = await fetch(`${API_BASE}/crops/fertilizer-calc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ crop, acres }),
  });
  if (!response.ok) throw new Error('Failed to calculate fertilizer dosage');
  return response.json();
}

export async function fetchPests() {
  const response = await fetch(`${API_BASE}/crops/pests`);
  if (!response.ok) throw new Error('Failed to fetch pest directory');
  return response.json();
}

export async function fetchSchemes() {
  const response = await fetch(`${API_BASE}/crops/schemes`);
  if (!response.ok) throw new Error('Failed to fetch government schemes');
  return response.json();
}

export async function fetchMarketPrices() {
  const response = await fetch(`${API_BASE}/crops/market-prices`);
  if (!response.ok) throw new Error('Failed to fetch market prices');
  return response.json();
}

export async function fetchWeather(location = 'Hyderabad') {
  const response = await fetch(`${API_BASE}/crops/weather?location=${encodeURIComponent(location)}`);
  if (!response.ok) throw new Error('Failed to fetch weather');
  return response.json();
}

export async function fetchFieldInsights() {
  const response = await fetch(`${API_BASE}/crops/field-insights`);
  if (!response.ok) throw new Error('Failed to fetch field insights');
  return response.json();
}

export async function fetchDocuments() {
  const response = await fetch(`${API_BASE}/documents`);
  if (!response.ok) throw new Error('Failed to fetch documents');
  return response.json();
}

export async function uploadDocumentFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE}/documents/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to upload document');
  }
  return response.json();
}

export async function summarizeDocument(payload) {
  const response = await fetch(`${API_BASE}/documents/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to summarize document');
  return response.json();
}

// ---------------- Authentication & Multi-Farmer API ----------------

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Invalid email or password');
  }
  return response.json();
}

export async function signupUser(userData) {
  const response = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create farmer account');
  }
  return response.json();
}

export async function fetchDemoUsers() {
  const response = await fetch(`${API_BASE}/auth/demo-users`);
  if (!response.ok) throw new Error('Failed to fetch demo users');
  return response.json();
}

export async function fetchCurrentFarmer(userId, token) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(`${API_BASE}/auth/me?user_id=${encodeURIComponent(userId || '')}`, { headers });
  if (!response.ok) throw new Error('Failed to fetch user details');
  return response.json();
}

export async function updateFarmerProfile(userId, profileData) {
  const response = await fetch(`${API_BASE}/auth/profile?user_id=${encodeURIComponent(userId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData),
  });
  if (!response.ok) throw new Error('Failed to update profile');
  return response.json();
}

