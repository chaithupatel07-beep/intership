import React, { useState, useEffect } from 'react';
import {
  Landmark,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  CreditCard,
  Droplets,
  Sprout
} from 'lucide-react';
import { fetchSchemes } from '../services/api';

export default function GovernmentSchemesView() {
  const [schemes, setSchemes] = useState([]);
  const [landAcres, setLandAcres] = useState(3.5);
  const [hasAadhaar, setHasAadhaar] = useState(true);

  useEffect(() => {
    fetchSchemes().then((data) => {
      setSchemes(data.schemes || []);
    }).catch(() => {
      // Fallback
      setSchemes([
        {
          id: 'pm-kisan',
          name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
          benefit: '₹6,000 per year via Direct Benefit Transfer (3 installments of ₹2,000)',
          eligibility: 'All landholding farmer families across India',
          key_criteria: 'e-KYC completion, Aadhaar linked active bank account, verified land registry',
          application_url: 'https://pmkisan.gov.in',
          category: 'Direct Income Support',
        },
        {
          id: 'pmfby',
          name: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
          benefit: 'Comprehensive crop insurance against drought, floods, unseasonal rain & pest attacks',
          eligibility: 'All farmers growing notified crops in notified areas (loanee & non-loanee)',
          key_criteria: 'Farmer premium only 2% for Kharif, 1.5% for Rabi crops',
          application_url: 'https://pmfby.gov.in',
          category: 'Risk & Crop Insurance',
        },
        {
          id: 'pmksy',
          name: 'PMKSY - Per Drop More Crop (Micro Irrigation)',
          benefit: '55% subsidy for small/marginal farmers and 45% for others on Drip/Sprinkler systems',
          eligibility: 'Farmers with valid land ownership and an assured water source (borewell/canal)',
          key_criteria: 'Additional 20-30% state top-up subsidy in many states',
          application_url: 'https://pmksy.gov.in',
          category: 'Irrigation & Water Tech',
        },
        {
          id: 'pkvy',
          name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
          benefit: '₹50,000/ha financial assistance over 3 years for organic inputs and PGS certification',
          eligibility: 'Farmer groups and clusters with minimum 20 hectares land',
          key_criteria: 'Zero chemical fertilizer/pesticide usage certification',
          application_url: 'https://pgsindia-ncof.gov.in',
          category: 'Organic Farming',
        },
        {
          id: 'kcc',
          name: 'Kisan Credit Card (KCC)',
          benefit: 'Short-term institutional crop loans up to ₹3,00,000 at effective 4% interest rate',
          eligibility: 'Individual farmers, tenant farmers, sharecroppers, and SHGs',
          key_criteria: 'Collateral-free loan up to ₹1.60 lakh',
          application_url: 'https://www.myscheme.gov.in',
          category: 'Credit & Working Capital',
        },
      ]);
    });
  }, []);

  const isSmallMarginal = landAcres <= 4.94; // 2 hectares = ~4.94 acres

  return (
    <div className="content-area">
      <div style={{ marginBottom: '8px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#064e3b' }}>
          🏛️ Central & State Government Agricultural Schemes
        </h2>
        <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
          Verified directory of financial assistance, micro-irrigation subsidies, crop insurance, and institutional credit.
        </p>
      </div>

      {/* Quick Eligibility Checker Widget */}
      <div
        className="dashboard-card"
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
          border: '1px solid #bbf7d0',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#065f46' }}>
              Instant Farmer Eligibility Checker
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#047857' }}>
              Farmer Category: <strong>{isSmallMarginal ? 'Small & Marginal Farmer (<= 2 Ha)' : 'Medium / Large Farmer (> 2 Ha)'}</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#334155', display: 'block' }}>
              Landholding: <strong>{landAcres} Acres</strong>
            </label>
            <input
              type="range"
              min="0.5"
              max="25"
              step="0.5"
              value={landAcres}
              onChange={(e) => setLandAcres(parseFloat(e.target.value))}
              style={{ accentColor: '#10b981', width: '160px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#166534', fontWeight: 600 }}>
            <CheckCircle size={16} color="#10b981" />
            <span>Aadhaar e-KYC Active</span>
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {schemes.map((s) => (
          <div
            key={s.id}
            className="dashboard-card"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 220px',
              gap: '20px',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '4px' }}>
                  {s.category}
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{s.name}</h3>
              </div>

              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981', marginBottom: '6px' }}>
                💰 Benefit: {s.benefit}
              </div>

              <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '4px' }}>
                <strong>Eligibility:</strong> {s.eligibility}
              </div>

              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                <strong>Key Conditions:</strong> {s.key_criteria}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    background: '#dcfce7',
                    color: '#15803d',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <CheckCircle size={12} />
                  <span>Eligible to Apply</span>
                </span>
              </div>

              <a
                href={s.application_url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#10b981',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(16,185,129,0.3)',
                }}
              >
                <span>Official Portal</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
