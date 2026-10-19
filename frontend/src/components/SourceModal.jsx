import React from 'react';
import { X, FileText, CheckCircle, ExternalLink } from 'lucide-react';

export default function SourceModal({ source, onClose }) {
  if (!source) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FileText size={20} />
            </div>
            <div>
              <h3>{source.document_name || 'Agricultural Manual'}</h3>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Page {source.page_number || 1} • Section: {source.section_title || 'Agronomic Guidance'}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ color: '#94a3b8', padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '0.84rem', fontWeight: 600 }}>
              <CheckCircle size={16} />
              <span>Grounded Agricultural Reference</span>
            </div>
            {source.relevance_score && (
              <span style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#2563eb',
                background: '#eff6ff',
                padding: '2px 8px',
                borderRadius: '12px'
              }}>
                Match: {(source.relevance_score * 100).toFixed(0)}%
              </span>
            )}
          </div>

          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '8px', color: '#0f172a' }}>
            Extracted Manual Passage:
          </h4>
          <div style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '16px',
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit',
            fontSize: '0.86rem',
            color: '#334155',
            lineHeight: 1.6,
            maxHeight: '320px',
            overflowY: 'auto',
          }}>
            {source.content || source.snippet || 'No raw passage content available.'}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                background: '#10b981',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.84rem',
                padding: '8px 18px',
                borderRadius: '8px',
              }}
            >
              Done Reading
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
