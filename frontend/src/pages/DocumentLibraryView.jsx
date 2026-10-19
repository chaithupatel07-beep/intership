import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Upload,
  Search,
  CheckCircle,
  Trash2,
  BookOpen,
  RefreshCw,
  Eye,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { fetchDocuments, uploadDocumentFile } from '../services/api';

export default function DocumentLibraryView({ onSelectSource, onSummarizeDoc }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testQuery, setTestQuery] = useState('');
  const [testResults, setTestResults] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    setLoading(true);
    try {
      const data = await fetchDocuments();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadDocumentFile(file);
      alert(`Document "${file.name}" indexed successfully!`);
      loadDocs();
    } catch (err) {
      alert(`Error uploading: ${err.message}`);
    }
  };

  const handleTestSearch = async () => {
    if (!testQuery.trim()) return;
    try {
      // Trigger RAG query directly
      const response = await fetch(`/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: testQuery, top_k: 3 }),
      });
      const data = await response.json();
      setTestResults(data.sources || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="content-area">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#064e3b' }}>
            📄 Agricultural Knowledge Base & Document Library
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
            All manuals are processed into vector embeddings, indexed with page numbers, and used to ground AI responses.
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            background: '#10b981',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.84rem',
            padding: '10px 18px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
          }}
        >
          <Upload size={16} />
          <span>Upload Agricultural Manual</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleUpload}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
        {/* Left Column: Documents Table */}
        <div className="dashboard-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 className="card-title">
              <BookOpen size={18} color="#10b981" />
              <span>Registered Packages of Practice ({documents.length})</span>
            </h3>
            <button
              onClick={loadDocs}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#059669',
                fontSize: '0.78rem',
                fontWeight: 600,
              }}
            >
              <RefreshCw size={13} />
              <span>Refresh Index</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {documents.map((doc) => (
              <div
                key={doc.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                      {doc.display_name || doc.filename}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {doc.formatted_size || '2.4 MB'} • {doc.chunk_count || 6} Chunks Vectorized • Status:{' '}
                      <strong style={{ color: '#059669' }}>Ready</strong>
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => onSummarizeDoc && onSummarizeDoc(doc.filename)}
                    style={{
                      padding: '6px 12px',
                      background: '#ecfdf5',
                      color: '#059669',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: '1px solid #a7f3d0',
                    }}
                  >
                    Summarize
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Vector Retrieval Sandbox */}
        <div className="dashboard-card">
          <h3 className="card-title" style={{ marginBottom: '10px' }}>
            <Sliders size={18} color="#3b82f6" />
            <span>Vector Search Inspection</span>
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px' }}>
            Test raw semantic retrieval: enter any agricultural question to inspect cosine similarity scores and retrieved chunks.
          </p>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <input
              type="text"
              placeholder="e.g., Khaira disease zinc dose"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTestSearch()}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.84rem',
              }}
            />
            <button
              onClick={handleTestSearch}
              style={{
                background: '#3b82f6',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.78rem',
                padding: '8px 14px',
                borderRadius: '8px',
              }}
            >
              Retrieve
            </button>
          </div>

          {testResults && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155' }}>
                Top Matches ({testResults.length}):
              </div>
              {testResults.map((r, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectSource(r)}
                  style={{
                    padding: '10px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.78rem', color: '#0f172a' }}>{r.document_name}</strong>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563eb' }}>
                      {(r.relevance_score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: '#475569', lineHeight: 1.4 }}>
                    {r.snippet || r.content?.slice(0, 140)}...
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
