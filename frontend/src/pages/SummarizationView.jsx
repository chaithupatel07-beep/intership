import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Sparkles,
  ListChecks,
  CheckCircle2,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { summarizeDocument } from '../services/api';

export default function SummarizationView({ preselectedDoc }) {
  const [selectedDoc, setSelectedDoc] = useState(preselectedDoc || 'Rice_Cultivation_Manual.txt');
  const [customText, setCustomText] = useState('');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const availableDocs = [
    { id: 'Rice_Cultivation_Manual.txt', name: 'Rice Cultivation Manual (ICAR)' },
    { id: 'Soil_Health_Guide.txt', name: 'National Soil Health & Nutrient Guide' },
    { id: 'Pest_Management.txt', name: 'Integrated Pest & Disease Management' },
    { id: 'Government_Schemes.txt', name: 'Government Schemes & Subsidies 2026' },
    { id: 'Fertilizer_Recommendation.txt', name: 'Fertilizer Recommendation Handbook' },
    { id: 'Drip_Irrigation_Handbook.txt', name: 'Drip Irrigation & Smart Water Handbook' },
  ];

  useEffect(() => {
    handleSummarize(selectedDoc);
  }, [selectedDoc]);

  const handleSummarize = async (filename) => {
    setLoading(true);
    try {
      const res = await summarizeDocument({
        filename: filename || selectedDoc,
        custom_text: customText || undefined,
      });
      setSummary(res);
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
          📝 AI Document Summarizer & Agronomic Takeaways
        </h2>
        <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
          Instantly condenses extensive agricultural manuals into essential farmer dosages, critical metrics, and actionable field checklists.
        </p>
      </div>

      {/* Selector Card */}
      <div
        className="dashboard-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '16px 24px',
        }}
      >
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
            Select Agricultural Manual
          </label>
          <select
            value={selectedDoc}
            onChange={(e) => setSelectedDoc(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.86rem',
              background: 'white',
            }}
          >
            {availableDocs.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => handleSummarize(selectedDoc)}
          disabled={loading}
          style={{
            background: '#10b981',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.84rem',
            padding: '10px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '20px',
            boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
          }}
        >
          <Sparkles size={16} />
          <span>{loading ? 'Synthesizing...' : 'Summarize Manual'}</span>
        </button>
      </div>

      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          {/* Executive Overview */}
          <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 className="card-title">
              <BookOpen size={18} color="#10b981" />
              <span>{summary.title || 'Executive Summary'}</span>
            </h3>

            <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.6, background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              {summary.executive_summary}
            </p>

            <div>
              <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                Key Chemical Formulations & Critical Dosages:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {summary.critical_metrics?.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 14px',
                      background: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      color: '#065f46',
                      fontWeight: 600,
                    }}
                  >
                    • {m}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actionable Field Checklist */}
          <div className="dashboard-card">
            <h3 className="card-title" style={{ marginBottom: '14px' }}>
              <ListChecks size={18} color="#059669" />
              <span>Farmer Field Checklist</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {summary.action_items?.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.45 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
