import React, { useState, useEffect } from 'react';
import {
  Bug,
  ShieldAlert,
  Search,
  CheckCircle,
  AlertTriangle,
  Leaf,
  FlaskConical,
  Filter
} from 'lucide-react';
import { fetchPests } from '../services/api';

export default function PestControlView({ onAskQuestion }) {
  const [pests, setPests] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');

  useEffect(() => {
    fetchPests().then((data) => {
      setPests(data.pests || []);
    }).catch(() => {
      // Fallback data
      setPests([
        {
          id: 'stem_borer',
          name: 'Yellow Stem Borer (Scirpophaga incertulas)',
          target_crops: ['Rice (Paddy)'],
          symptoms: 'Dead hearts in vegetative stage; white chaffy earheads at grain formation.',
          etl: '1 egg mass/sq.m or 5% dead hearts.',
          biological_control: 'Trichogramma chilonis egg parasitoids @ 100,000/ha; Pheromone traps @ 8/acre.',
          chemical_control: 'Chlorantraniliprole 18.5% SC @ 60 ml/acre or Cartap Hydrochloride 50% SP @ 400g/acre.',
          severity: 'High',
        },
        {
          id: 'fall_armyworm',
          name: 'Fall Armyworm (Spodoptera frugiperda)',
          target_crops: ['Maize', 'Sorghum', 'Millets'],
          symptoms: 'Pinholes and skeletonized whorl leaves, heavy sawdust-like frass inside whorls.',
          etl: '10% damaged plants at seedling stage.',
          biological_control: 'Bacillus thuringiensis (Bt) @ 2g/L or Metarhizium anisopliae @ 5g/L.',
          chemical_control: 'Emamectin Benzoate 5% SG @ 80g/acre or Spinetoram 11.7% SC @ 100ml/acre.',
          severity: 'Critical',
        },
        {
          id: 'rice_blast',
          name: 'Rice Blast (Pyricularia oryzae)',
          target_crops: ['Rice (Paddy)'],
          symptoms: 'Spindle-shaped spots with gray centers and brown margins; black rotting neck nodes.',
          etl: '2-5% leaf area affected.',
          biological_control: 'Pseudomonas fluorescens seed treatment @ 10g/kg and foliar spray @ 2.5kg/ha.',
          chemical_control: 'Tricyclazole 75% WP @ 120g/acre or Isoprothiolane 40% EC @ 300ml/acre.',
          severity: 'High',
        },
        {
          id: 'pink_bollworm',
          name: 'Pink Bollworm (Pectinophora gossypiella)',
          target_crops: ['Cotton'],
          symptoms: 'Rosette flowers, premature boll opening, damaged and stained lint.',
          etl: '8 moths/trap/night for 3 consecutive nights.',
          biological_control: 'Delta pheromone traps @ 8 traps/acre; Trichogrammatoidea release.',
          chemical_control: 'Profenofos 50% EC @ 400ml/acre or Indoxacarb 14.5% SC @ 200ml/acre.',
          severity: 'High',
        },
      ]);
    });
  }, []);

  const filteredPests = pests.filter((p) => {
    const matchesText =
      p.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.symptoms.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.chemical_control.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesCrop =
      selectedCropFilter === 'All' || p.target_crops?.some((c) => c.includes(selectedCropFilter));
    return matchesText && matchesCrop;
  });

  return (
    <div className="content-area">
      <div style={{ marginBottom: '8px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#064e3b' }}>
          🐛 Integrated Pest & Disease Diagnostic Compendium (IPM)
        </h2>
        <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
          Standardized label-claim formulations, Economic Threshold Levels (ETL), and non-chemical biocontrols.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="dashboard-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '12px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, background: '#f8fafc', padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search symptoms, pests, or chemical active ingredients..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.86rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="#64748b" />
          <select
            value={selectedCropFilter}
            onChange={(e) => setSelectedCropFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.84rem',
              background: 'white',
            }}
          >
            <option value="All">All Crops</option>
            <option value="Rice">Rice (Paddy)</option>
            <option value="Maize">Maize (Corn)</option>
            <option value="Cotton">Cotton</option>
          </select>
        </div>
      </div>

      {/* Pest Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {filteredPests.map((p) => (
          <div
            key={p.id}
            className="dashboard-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              borderLeft: p.severity === 'Critical' ? '4px solid #ef4444' : '4px solid #f97316',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{p.name}</h3>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  Target: <strong>{p.target_crops?.join(', ')}</strong>
                </div>
              </div>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: p.severity === 'Critical' ? '#fee2e2' : '#ffedd5',
                  color: p.severity === 'Critical' ? '#dc2626' : '#c2410c',
                }}
              >
                {p.severity} Severity
              </span>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', fontSize: '0.8rem' }}>
              <div style={{ fontWeight: 700, color: '#334155', marginBottom: '2px' }}>Visible Symptoms:</div>
              <p style={{ color: '#475569' }}>{p.symptoms}</p>
              <div style={{ marginTop: '6px', fontSize: '0.76rem', color: '#b45309', fontWeight: 600 }}>
                ⚠️ Action Threshold (ETL): {p.etl}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Leaf size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#065f46' }}>Biological / Cultural Remedy:</strong>
                  <div style={{ color: '#334155' }}>{p.biological_control}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <FlaskConical size={16} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#1e40af' }}>Approved Chemical Formulation:</strong>
                  <div style={{ color: '#334155' }}>{p.chemical_control}</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onAskQuestion && onAskQuestion(`How to manage ${p.name} on my farm?`)}
              style={{
                marginTop: 'auto',
                padding: '8px',
                background: '#f0fdf4',
                color: '#059669',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                border: '1px solid #bbf7d0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <span>Ask AI Assistant for Treatment Schedule</span>
              <span>→</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
