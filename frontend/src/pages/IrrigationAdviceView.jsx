import React, { useState } from 'react';
import {
  Droplets,
  Gauge,
  CheckCircle,
  AlertCircle,
  Wrench,
  Percent,
  Compass
} from 'lucide-react';

export default function IrrigationAdviceView() {
  const [selectedCrop, setSelectedCrop] = useState('paddy');

  const cropData = {
    paddy: {
      name: 'Paddy (Rice)',
      waterReq: '1100 - 1250 mm',
      method: 'Alternate Wetting and Drying (AWD) / Shallow submergence (2-3 cm)',
      savings: '25% water savings using perforated pani-pipe without yield loss',
      criticalStages: [
        { stage: 'Panicle Initiation (35-45 DAT)', importance: 'High', advice: 'Maintain 5 cm water depth. Moisture stress causes severe spikelet sterility.' },
        { stage: 'Flowering & Anthesis', importance: 'Critical', advice: 'Do not allow standing water to dry out completely.' },
        { stage: 'Maturity / Pre-harvest (10 days before cut)', importance: 'Medium', advice: 'Completely drain water to encourage uniform golden ripening.' }
      ],
    },
    maize: {
      name: 'Maize (Corn)',
      waterReq: '500 - 600 mm',
      method: 'Furrow or Drip Irrigation (Emitter spacing 40-50 cm)',
      savings: '40% water savings under drip fertigation',
      criticalStages: [
        { stage: 'Knee-high Stage (30-35 DAS)', importance: 'Medium', advice: 'Provide steady irrigation for rapid vegetative expansion.' },
        { stage: 'Tasseling & Silking', importance: 'Critical', advice: 'Water stress during pollination cuts kernel count by up to 50%.' },
        { stage: 'Early Dough Stage', importance: 'High', advice: 'Ensures plump, heavy grain filling.' }
      ],
    },
    tomato: {
      name: 'Tomato & Horticultural Vegetables',
      waterReq: '400 - 600 mm',
      method: 'Inline Drip System (1.2 to 1.5 lph discharge rate)',
      savings: '50% water savings + 30% yield boost over surface flooding',
      criticalStages: [
        { stage: 'Transplant Establishment (First 10 days)', importance: 'High', advice: 'Light daily drip pulses to prevent root shock.' },
        { stage: 'Flowering & Fruit Set', importance: 'Critical', advice: 'Maintain constant soil moisture to prevent Blossom End Rot.' },
        { stage: 'Fruit Sizing & Maturation', importance: 'High', advice: 'Avoid irregular moisture fluctuations that cause skin cracking.' }
      ],
    },
  };

  const active = cropData[selectedCrop];

  return (
    <div className="content-area">
      <div style={{ marginBottom: '8px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#064e3b' }}>
          💧 Smart Irrigation & Precision Water Scheduling
        </h2>
        <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
          Optimize watering schedules, reduce pumping power costs, and maximize water-use efficiency (WUE).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* Left Column: Crop Water Scheduler */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="dashboard-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 className="card-title">
                <Compass size={18} color="#06b6d4" />
                <span>Crop Water Requirement Matrix</span>
              </h3>
              <div style={{ display: 'flex', gap: '6px' }}>
                {Object.keys(cropData).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCrop(key)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      background: selectedCrop === key ? '#10b981' : '#f1f5f9',
                      color: selectedCrop === key ? 'white' : '#475569',
                      border: 'none',
                    }}
                  >
                    {cropData[key].name}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div style={{ background: '#ecfeff', border: '1px solid #cffafe', borderRadius: '10px', padding: '14px' }}>
                <span style={{ fontSize: '0.72rem', color: '#0e7490', fontWeight: 600 }}>TOTAL WATER REQUIREMENT</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0891b2', margin: '4px 0' }}>
                  {active.waterReq}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#155e75' }}>Standard growing season demand</span>
              </div>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '14px' }}>
                <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 600 }}>WATER-SAVING TECHNIQUE</span>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#166534', margin: '4px 0' }}>
                  {active.method}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#15803d' }}>{active.savings}</span>
              </div>
            </div>

            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>
              Critical Phenological Growth Stages (Zero Stress Zones):
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {active.criticalStages.map((cs, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.86rem', color: '#0f172a', display: 'block' }}>{cs.stage}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{cs.advice}</span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: cs.importance === 'Critical' ? '#fee2e2' : '#fef3c7',
                      color: cs.importance === 'Critical' ? '#dc2626' : '#d97706',
                      flexShrink: 0,
                    }}
                  >
                    {cs.importance}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Drip Maintenance Checklist & Subsidies */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="dashboard-card">
            <h3 className="card-title" style={{ marginBottom: '14px' }}>
              <Wrench size={18} color="#f59e0b" />
              <span>Drip System Maintenance</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { title: 'Operating Pressure', desc: 'Maintain lateral line pressure at 1.0 to 1.2 kg/cm2.' },
                { title: 'Daily Filter Backwash', desc: 'Backwash sand media filter daily or when pressure drop > 0.5 bar.' },
                { title: 'Acid Treatment for Clogged Emitters', desc: 'Flush laterals with 0.6% Hydrochloric Acid (HCl) for 24h to dissolve calcium salts.' },
                { title: 'Algae Chlorination', desc: 'Inject sodium hypochlorite (bleaching powder 20 ppm) monthly.' },
              ].map((m, idx) => (
                <div key={idx} style={{ padding: '8px 10px', background: '#f8fafc', borderRadius: '6px', fontSize: '0.78rem' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{m.title}</div>
                  <div style={{ color: '#64748b' }}>{m.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="dashboard-card"
            style={{
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
              border: '1px solid #a7f3d0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#065f46', fontWeight: 800, fontSize: '0.92rem', marginBottom: '6px' }}>
              <Percent size={18} />
              <span>PMKSY Drip Subsidy</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#064e3b', lineHeight: 1.4, marginBottom: '8px' }}>
              Small and marginal farmers (&lt;2 hectares) are entitled to <strong>55% Central subsidy</strong> + additional 20-30% state top-up for micro-irrigation installation.
            </p>
            <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 600 }}>
              Official Portal: pmksy.gov.in
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
