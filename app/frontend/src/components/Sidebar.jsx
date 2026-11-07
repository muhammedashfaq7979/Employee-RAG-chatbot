import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  FolderGit2, 
  Zap, 
  ShieldCheck, 
  LogOut, 
  Cpu
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, user, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agent', label: 'Policy AI Agent', icon: Bot, badge: 'RAG' },
    { id: 'documents', label: 'Company Documents', icon: FolderGit2, count: '4' },
    { id: 'actions', label: 'Employee Actions', icon: Zap }
  ];

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: 'var(--primary-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px var(--primary-glow)'
        }}>
          <ShieldCheck size={22} color="#fff" />
        </div>
        <div>
          <div className="brand-title">PolicyHub</div>
          <div className="brand-badge">Enterprise AI</div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-menu">
        <div className="menu-category">Main Navigation</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`menu-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={19} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  fontSize: '0.68rem',
                  padding: '2px 6px',
                  borderRadius: 4,
                  background: 'rgba(99,102,241,0.25)',
                  color: 'var(--primary-light)',
                  fontWeight: 700
                }}>
                  {item.badge}
                </span>
              )}
              {item.count && (
                <span style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  fontWeight: 600
                }}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Ollama Agent Status Pill */}
      <div className="sidebar-status-box">
        <div className="pulse-dot" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.76rem', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Cpu size={12} color="var(--cyan-accent)" />
            <span>Ollama Metal (Local)</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--cyan-accent)', fontFamily: 'var(--font-mono)' }}>
            llama3.1:8b • pgvector
          </div>
        </div>
      </div>

      {/* User Footer Card */}
      <div className="sidebar-profile">
        <div className="profile-avatar">
          {user.avatar || '👤'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user.name}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user.role}
          </div>
        </div>
        <button
          onClick={onLogout}
          title="Sign Out"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: 6,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--rose)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <LogOut size={17} />
        </button>
      </div>
    </aside>
  );
}
