import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Package,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Leaf,
  Info
} from 'lucide-react';
import { calculateFertilizerDose } from '../services/api';

export default function FertilizerGuidanceView({ initialCrop }) {
  const [crop, setCrop] = useState(initialCrop || 'Rice (Paddy)');
  const [acres, setAcres] = useState(2.0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleCalculate(crop, acres);
  }, [crop, acres]);

  const handleCalculate = async (targetCrop, targetAcres) => {
    setLoading(true);
    try {
      const data = await calculateFertilizerDose(targetCrop, targetAcres);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-area">
      <div style={{ marginBottom: '8px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#064e3b' }}>
          🧪 Scientific Fertilizer Dosage & Bag Calculator
        </h2>
        <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
          Translates elemental Recommended Dose of Fertilizers (RDF) into exact commercial bag counts (Urea, DAP, MOP) per acre.
        </p>
      </div>

      {/* Control Bar */}
      <div
        className="dashboard-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '16px 24px',
          background: '#ffffff',
        }}
      >
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
            Target Crop
          </label>
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.86rem',
              background: 'white',
            }}
          >
            <option value="Rice (Paddy)">Rice (Paddy) — 120:60:60 NPK</option>
            <option value="Maize (Corn)">Maize (Corn) — 150:75:75 NPK</option>
            <option value="Cotton">Cotton (Bt Hybrid) — 150:75:75 NPK</option>
            <option value="Groundnut">Groundnut — 25:50:75 NPK + Gypsum</option>
            <option value="Wheat">Wheat — 120:60:40 NPK</option>
          </select>
        </div>

        <div style={{ width: '220px' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
            Land Acreage: <strong>{acres} Acres</strong>
          </label>
          <input
            type="range"
            min="0.5"
            max="20"
            step="0.5"
            value={acres}
            onChange={(e) => setAcres(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#10b981' }}
          />
        </div>
      </div>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Commercial Bags Overview Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {/* Urea */}
            <div
              className="dashboard-card"
              style={{
                borderLeft: '4px solid #10b981',
                padding: '18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>NITROGEN (46% N)</span>
                <Package size={18} color="#10b981" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
                {result.commercial_fertilizers?.urea_45kg_bags} Bags
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Urea (45 kg standard bag) • Total {result.commercial_fertilizers?.urea_kg} kg
              </div>
            </div>

            {/* DAP */}
            <div
              className="dashboard-card"
              style={{
                borderLeft: '4px solid #3b82f6',
                padding: '18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb' }}>PHOSPHORUS (18:46:0)</span>
                <Package size={18} color="#3b82f6" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
                {result.commercial_fertilizers?.dap_50kg_bags} Bags
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                DAP (50 kg bag) • Total {result.commercial_fertilizers?.dap_kg} kg
              </div>
            </div>

            {/* MOP */}
            <div
              className="dashboard-card"
              style={{
                borderLeft: '4px solid #f97316',
                padding: '18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ea580c' }}>POTASSIUM (60% K2O)</span>
                <Package size={18} color="#f97316" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
                {result.commercial_fertilizers?.mop_50kg_bags} Bags
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                MOP (50 kg bag) • Total {result.commercial_fertilizers?.mop_kg} kg
              </div>
            </div>

            {/* Zinc & Organic */}
            <div
              className="dashboard-card"
              style={{
                borderLeft: '4px solid #8b5cf6',
                padding: '18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed' }}>SECONDARY & ORGANIC</span>
                <Leaf size={18} color="#8b5cf6" />
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {result.commercial_fertilizers?.zinc_sulphate_kg} kg Zinc
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                + {result.commercial_fertilizers?.organic_fym_tonnes} Tonnes FYM / Compost
              </div>
            </div>
          </div>

          {/* Split Application Schedule Timeline */}
          <div className="dashboard-card">
            <h3 className="card-title" style={{ marginBottom: '16px' }}>
              <Calendar size={18} color="#10b981" />
              <span>3-Stage Split Application Schedule (Maximizing Nutrient Uptake)</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {result.application_schedule?.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    padding: '14px',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#ecfdf5',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>
                      {item.stage}
                    </h4>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#10b981', marginBottom: '4px' }}>
                      Dosage: {item.composition}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety & Agronomic Warning */}
          <div
            style={{
              background: '#fffbeb',
              border: '1px solid #fef3c7',
              borderRadius: '10px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <AlertTriangle size={24} color="#d97706" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.82rem', color: '#92400e' }}>
              <strong>Critical Caution:</strong> Never mix Zinc Sulphate directly with DAP or SSP during application.
              When combined, they chemically precipitate into insoluble Zinc Phosphate, rendering both nutrients unavailable to roots.
              Keep a 3-5 day gap or apply in separate furrows.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
