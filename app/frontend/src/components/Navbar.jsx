import React, { useState } from 'react';
import { Search, Bell, Users, ChevronDown, Check } from 'lucide-react';
import { MOCK_PERSONAS } from '../data/mockData';

export default function Navbar({ activeTab, user, onSwitchUser, onSearchClick }) {
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const tabLabels = {
    dashboard: 'Employee Dashboard',
    agent: 'Policy AI Assistant (RAG)',
    documents: 'Company Policy Documents',
    actions: 'Quick Employee Actions'
  };

  return (
    <header className="app-navbar">
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem' }}>
        <span style={{ color: 'var(--text-muted)' }}>ACME Corp</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>/</span>
        <span style={{ color: '#fff', fontWeight: 600 }}>{tabLabels[activeTab] || 'Overview'}</span>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Search */}
        <div className="navbar-search" onClick={onSearchClick} style={{ cursor: 'pointer' }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            type="text"
            readOnly
            placeholder="Search policies or ask AI..."
          />
          <span style={{
            fontSize: '0.65rem',
            fontFamily: 'var(--font-mono)',
            background: 'rgba(255,255,255,0.08)',
            padding: '2px 5px',
            borderRadius: 4,
            color: 'var(--text-muted)'
          }}>
            ⌘K
          </span>
        </div>

        {/* Persona Switcher Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowPersonaMenu(!showPersonaMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 0.85rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            <Users size={15} color="var(--cyan-accent)" />
            <span>{user.name.split(' ')[0]} ({user.department})</span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {showPersonaMenu && (
            <div style={{
              position: 'absolute',
              top: '110%',
              right: 0,
              width: 260,
              background: '#0f172a',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)',
              padding: '0.5rem',
              zIndex: 50
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '0.4rem 0.6rem', fontWeight: 600, textTransform: 'uppercase' }}>
                Switch Active Persona
              </div>
              {MOCK_PERSONAS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onSwitchUser(p);
                    setShowPersonaMenu(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    background: p.id === user.id ? 'rgba(99,102,241,0.15)' : 'transparent',
                    color: p.id === user.id ? '#fff' : 'var(--text-secondary)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = p.id === user.id ? 'rgba(99,102,241,0.15)' : 'transparent'; }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{p.avatar}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.role}</div>
                  </div>
                  {p.id === user.id && <Check size={14} color="var(--primary-light)" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              position: 'relative'
            }}
          >
            <Bell size={17} />
            <span style={{
              position: 'absolute',
              top: 7,
              right: 7,
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--cyan-accent)',
              boxShadow: '0 0 6px var(--cyan-accent)'
            }} />
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '110%',
              right: 0,
              width: 320,
              background: '#0f172a',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)',
              padding: '1rem',
              zIndex: 50
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Recent Policy Alerts
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ fontSize: '0.78rem', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>
                  <div style={{ fontWeight: 600, color: 'var(--primary-light)' }}>Remote Work Speed Check</div>
                  <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>Broadband mandate verification deadline approaching.</div>
                </div>
                <div style={{ fontSize: '0.78rem', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>
                  <div style={{ fontWeight: 600, color: 'var(--emerald)' }}>2024 Holidays Published</div>
                  <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>10 mandatory paid public holidays now visible in the HR portal.</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
