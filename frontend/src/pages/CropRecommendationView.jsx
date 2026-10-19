import React, { useState } from 'react';
import {
  Sprout,
  Droplets,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  FlaskConical,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';
import { fetchCropRecommendations } from '../services/api';

export default function CropRecommendationView({ onSelectTab, onSetFertilizerCrop }) {
  const [params, setParams] = useState({
    soil_type: 'Clay Loam',
    n: 90,
    p: 42,
    k: 45,
    ph: 6.8,
    rainfall_mm: 850,
    temperature_c: 28,
    season: 'Kharif',
    location: 'Hyderabad, Telangana',
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    recommended_crops: [
      {
        id: 'rice',
        name: 'Rice (Paddy)',
        variety: 'BPT 5204 (Samba Mahsuri)',
        profitability: 'High Profitability',
        region_match: 'Good for your region',
        duration_days: '125 - 135 days',
        water_requirement: 'High (1100 - 1250 mm)',
        expected_yield: '22 - 28 Quintals/Acre',
        expected_revenue: '₹55,000 - ₹68,000 / Acre',
        suitability_score: 94,
        soil_suitability: 'Ideal in clay loam and alluvial soil with high water holding.',
        image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'maize',
        name: 'Maize (Corn)',
        variety: 'DHM 117 / Pioneer 3396',
        profitability: 'Moderate Profitability',
        region_match: 'Suitable for summer & kharif',
        duration_days: '100 - 110 days',
        water_requirement: 'Moderate (500 - 600 mm)',
        expected_yield: '25 - 32 Quintals/Acre',
        expected_revenue: '₹48,000 - ₹58,000 / Acre',
        suitability_score: 88,
        soil_suitability: 'Well-drained sandy loam or black soil with good aeration.',
        image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'groundnut',
        name: 'Groundnut (Peanut)',
        variety: 'Kadiri 6 / TAG 24',
        profitability: 'Good Profitability',
        region_match: 'Low water requirement',
        duration_days: '105 - 115 days',
        water_requirement: 'Low to Medium (450 - 550 mm)',
        expected_yield: '12 - 16 Quintals/Acre',
        expected_revenue: '₹62,000 - ₹75,000 / Acre',
        suitability_score: 86,
        soil_suitability: 'Sandy loam and red sandy soils for easy peg penetration.',
        image: 'https://images.unsplash.com/photo-1568283096533-078a24930eb8?auto=format&fit=crop&w=600&q=80',
      },
    ],
    why_reasons: [
      { title: 'Suitable soil pH', desc: 'Optimal range (6.0 - 7.5), current: 6.8' },
      { title: 'Good rainfall', desc: 'Adequate zone (500 - 1200 mm), current: 850 mm' },
      { title: 'High market demand', desc: 'Strong APMC procurement and MSP backing in your state' },
    ],
  });

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await fetchCropRecommendations(params);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCropForFertilizer = (cropName) => {
    if (onSetFertilizerCrop) {
      onSetFertilizerCrop(cropName);
    }
    onSelectTab('fertilizer');
  };

  return (
    <div className="content-area">
      <div style={{ marginBottom: '8px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#064e3b' }}>
          🌱 Crop Selection & Agronomic Advisory Engine
        </h2>
        <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
          Intelligent recommendation based on Soil Health Card testing, weather patterns, and regional MSP profitability.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '24px' }}>
        {/* Left: Input Parameters Form */}
        <div className="dashboard-card" style={{ height: 'fit-content' }}>
          <h3 className="card-title" style={{ marginBottom: '16px' }}>
            <Layers size={18} color="#10b981" />
            <span>Farm & Soil Profile</span>
          </h3>

          <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Location / Agro-Climatic Zone
              </label>
              <input
                type="text"
                value={params.location}
                onChange={(e) => setParams({ ...params, location: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.84rem',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Soil Texture / Type
              </label>
              <select
                value={params.soil_type}
                onChange={(e) => setParams({ ...params, soil_type: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.84rem',
                  background: 'white',
                }}
              >
                <option value="Clay Loam">Clay Loam (High Water Retention)</option>
                <option value="Black Cotton Soil">Black Cotton Soil (Regur)</option>
                <option value="Red Sandy Soil">Red Sandy Soil</option>
                <option value="Alluvial Soil">Alluvial Soil (River Basin)</option>
                <option value="Sandy Loam">Sandy Loam</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Season
                </label>
                <select
                  value={params.season}
                  onChange={(e) => setParams({ ...params, season: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    background: 'white',
                  }}
                >
                  <option value="Kharif">Kharif (Monsoon)</option>
                  <option value="Rabi">Rabi (Winter)</option>
                  <option value="Zaid">Zaid / Summer</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Soil pH ({params.ph})
                </label>
                <input
                  type="range"
                  min="5.0"
                  max="9.0"
                  step="0.1"
                  value={params.ph}
                  onChange={(e) => setParams({ ...params, ph: parseFloat(e.target.value) })}
                  style={{ width: '100%', accentColor: '#10b981', marginTop: '8px' }}
                />
              </div>
            </div>

            {/* N-P-K Inputs */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Soil Test Macro-Nutrients (kg/ha)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Nitrogen (N)</span>
                  <input
                    type="number"
                    value={params.n}
                    onChange={(e) => setParams({ ...params, n: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Phosphorus (P)</span>
                  <input
                    type="number"
                    value={params.p}
                    onChange={(e) => setParams({ ...params, p: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Potassium (K)</span>
                  <input
                    type="number"
                    value={params.k}
                    onChange={(e) => setParams({ ...params, k: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Seasonal Rainfall ({params.rainfall_mm} mm)
              </label>
              <input
                type="range"
                min="300"
                max="2000"
                step="50"
                value={params.rainfall_mm}
                onChange={(e) => setParams({ ...params, rainfall_mm: parseInt(e.target.value) })}
                style={{ width: '100%', accentColor: '#10b981' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#10b981',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.86rem',
                padding: '10px',
                borderRadius: '8px',
                marginTop: '6px',
                boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
              }}
            >
              {loading ? 'Evaluating Agronomic Matrices...' : 'Evaluate & Recommend Crops'}
            </button>
          </form>
        </div>

        {/* Right: Recommendation Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Why These Crops Banner */}
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#065f46', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={16} />
              <span>Agronomic Justification & Suitability Analysis</span>
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {results.why_reasons?.map((w, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'white',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.78rem',
                  }}
                >
                  <strong style={{ color: '#065f46', display: 'block' }}>{w.title}</strong>
                  <span style={{ color: '#4b5563' }}>{w.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cards for Ranked Crops */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {results.recommended_crops?.map((crop, idx) => (
              <div
                key={crop.id || idx}
                className="dashboard-card"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '180px 1fr 200px',
                  gap: '20px',
                  alignItems: 'center',
                  padding: '18px',
                }}
              >
                <img
                  src={crop.image}
                  alt={crop.name}
                  style={{
                    width: '100%',
                    height: '130px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                  }}
                />

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{crop.name}</h3>
                    <span
                      style={{
                        background: '#ecfdf5',
                        color: '#059669',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {crop.profitability}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>
                    <strong>Recommended Variety:</strong> {crop.variety}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem', color: '#334155' }}>
                    <div>⏱ Duration: <strong>{crop.duration_days}</strong></div>
                    <div>💧 Water Need: <strong>{crop.water_requirement}</strong></div>
                    <div>🌾 Expected Yield: <strong>{crop.expected_yield}</strong></div>
                    <div>💰 Est. Revenue: <strong>{crop.expected_revenue}</strong></div>
                  </div>

                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>
                    {crop.soil_suitability}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderLeft: '1px solid #e2e8f0',
                    paddingLeft: '16px',
                    gap: '10px',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981' }}>
                      {crop.suitability_score}%
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Suitability Score</span>
                  </div>

                  <button
                    onClick={() => handleSelectCropForFertilizer(crop.name)}
                    style={{
                      width: '100%',
                      background: '#10b981',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.78rem',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                  >
                    <FlaskConical size={14} />
                    <span>Calculate Fertilizer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
