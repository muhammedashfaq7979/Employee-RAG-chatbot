import React, { useState } from 'react';
import { 
  Palmtree, 
  Stethoscope, 
  Laptop, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  FileText, 
  AlertTriangle 
} from 'lucide-react';
import { MOCK_ANNOUNCEMENTS } from '../data/mockData';

export default function DashboardView({ user, onNavigateToAgent, onOpenActionModal }) {
  const [quickQuery, setQuickQuery] = useState('');

  const handleHeroSubmit = (e) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      onNavigateToAgent(quickQuery);
    }
  };

  const balances = user.balances || {
    casualLeave: { used: 4, total: 12 },
    sickLeave: { used: 1, total: 10 },
    homeOfficeClaimed: 350,
    homeOfficeLimit: 500,
    securityScore: 100
  };

  const clRemaining = balances.casualLeave.total - balances.casualLeave.used;
  const slRemaining = balances.sickLeave.total - balances.sickLeave.used;
  const homeOfficeRemaining = balances.homeOfficeLimit - balances.homeOfficeClaimed;

  return (
    <div className="main-view-container">
      {/* Welcome Hero */}
      <div className="welcome-hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '1.4rem' }}>{user.avatar}</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--cyan-accent)', fontWeight: 600 }}>
            Welcome back, {user.name}
          </span>
        </div>
        <h1 style={{ fontSize: '1.9rem', marginBottom: '0.5rem' }}>
          ACME Internal Policy & Knowledge Hub
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: 640 }}>
          Search HR guidelines, check time-off entitlements, verify remote work policies, or ask our local Ollama AI agent.
        </p>

        {/* Quick Question Input */}
        <form onSubmit={handleHeroSubmit} className="hero-search-box">
          <Sparkles size={18} color="var(--primary-light)" />
          <input
            type="text"
            className="hero-prompt-input"
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
            placeholder="Ask anything: e.g. 'Can I carry forward sick leave?' or 'Password rules'"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '0.92rem'
            }}
          />
          <button type="submit" className="btn-grad" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
            <span>Ask AI</span>
            <ArrowRight size={15} />
          </button>
        </form>
      </div>

      {/* Metrics Row */}
      <div className="metrics-row">
        {/* Casual Leave */}
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 8,
              background: 'rgba(99,102,241,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-light)'
            }}>
              <Palmtree size={22} />
            </div>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 999,
              background: 'rgba(99,102,241,0.15)',
              color: 'var(--primary-light)'
            }}>
              Year 2024
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{clRemaining} Days</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Casual Leave Available ({balances.casualLeave.used} used of {balances.casualLeave.total})
          </div>
          <div className="progress-track">
            <div
              className="progress-indicator"
              style={{
                width: `${(clRemaining / balances.casualLeave.total) * 100}%`,
                background: 'var(--primary-light)'
              }}
            />
          </div>
        </div>

        {/* Sick Leave */}
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 8,
              background: 'rgba(16,185,129,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--emerald)'
            }}>
              <Stethoscope size={22} />
            </div>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 999,
              background: 'rgba(16,185,129,0.15)',
              color: 'var(--emerald)'
            }}>
              Medical
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{slRemaining} Days</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Sick Leave Available (Max 5 days carry-over)
          </div>
          <div className="progress-track">
            <div
              className="progress-indicator"
              style={{
                width: `${(slRemaining / balances.sickLeave.total) * 100}%`,
                background: 'var(--emerald)'
              }}
            />
          </div>
        </div>

        {/* Home Office Allowance */}
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 8,
              background: 'rgba(6,182,212,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--cyan-accent)'
            }}>
              <Laptop size={22} />
            </div>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 999,
              background: 'rgba(6,182,212,0.15)',
              color: 'var(--cyan-accent)'
            }}>
              Ergonomic
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>${homeOfficeRemaining}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Remaining of ${balances.homeOfficeLimit} One-Time Allowance
          </div>
          <div className="progress-track">
            <div
              className="progress-indicator"
              style={{
                width: `${(homeOfficeRemaining / balances.homeOfficeLimit) * 100}%`,
                background: 'var(--cyan-accent)'
              }}
            />
          </div>
        </div>

        {/* Security Compliance */}
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 8,
              background: 'rgba(245,158,11,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--amber)'
            }}>
              <ShieldCheck size={22} />
            </div>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 999,
              background: 'rgba(16,185,129,0.15)',
              color: 'var(--emerald)'
            }}>
              Compliant
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{balances.securityScore}%</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            MFA active • Password expires in 42 days
          </div>
          <div className="progress-track">
            <div
              className="progress-indicator"
              style={{ width: '100%', background: 'var(--emerald)' }}
            />
          </div>
        </div>
      </div>

      {/* Two-Column Dashboard Section */}
      <div className="dashboard-columns">
        {/* Left Column: Quick Employee Actions & Recent Queries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick Actions */}
          <div className="panel-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Employee Quick Actions</h3>
            <div className="actions-grid">
              <div
                className="action-card-btn"
                onClick={() => onOpenActionModal('leave')}
              >
                <div style={{ fontSize: '1.6rem' }}>🌴</div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>Apply for Leave</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Submit Casual, Sick, or Earned leave request.
                </div>
              </div>

              <div
                className="action-card-btn"
                onClick={() => onOpenActionModal('allowance')}
              >
                <div style={{ fontSize: '1.6rem' }}>💻</div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>Claim Equipment</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Claim from your $500 home office allowance.
                </div>
              </div>

              <div
                className="action-card-btn"
                onClick={() => onOpenActionModal('incident')}
              >
                <div style={{ fontSize: '1.6rem' }}>🚨</div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>Report Security Issue</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Flag lost device or phishing email.
                </div>
              </div>

              <div
                className="action-card-btn"
                onClick={() => onNavigateToAgent('What are the rules for remote work core hours?')}
              >
                <div style={{ fontSize: '1.6rem' }}>🤖</div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>Ask Policy Agent</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Interactive RAG Q&A with document citations.
                </div>
              </div>
            </div>
          </div>

          {/* Suggested Common Inquiries */}
          <div className="panel-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.85rem' }}>Popular Policy Inquiries</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                'How many sick leaves can I carry forward to next year?',
                'What are the mandatory password requirements under IT security?',
                'What is the notice period for taking Earned Leave (EL)?',
                'What are the guidelines on using AI tools with company code?'
              ].map((query, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigateToAgent(query)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
                    e.currentTarget.style.borderColor = 'var(--border-highlight)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  <span style={{ fontSize: '0.86rem', color: 'var(--text-primary)' }}>{query}</span>
                  <ArrowRight size={15} color="var(--primary-light)" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Policy Announcements & Updates */}
        <div className="panel-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Company Policy Updates</h3>
            <Clock size={16} color="var(--text-muted)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {MOCK_ANNOUNCEMENTS.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '2px 7px',
                    borderRadius: 4,
                    background: item.badge === 'Mandatory' ? 'rgba(244,63,94,0.15)' : 'rgba(6,182,212,0.15)',
                    color: item.badge === 'Mandatory' ? 'var(--rose)' : 'var(--cyan-accent)'
                  }}>
                    {item.badge}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.date}</span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0.35rem 0' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  {item.snippet}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.75rem',
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: 'var(--radius-sm)'
            }}>
              <AlertTriangle size={18} color="var(--amber)" />
              <div style={{ fontSize: '0.78rem', color: '#fef3c7' }}>
                HR Compliance Audit scheduled for Q1. Please ensure all contact info is updated.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
