import React, { useState } from 'react';
import { MOCK_PERSONAS } from '../data/mockData';
import { ShieldCheck, ArrowRight, UserCheck, UserPlus, LogIn, AlertCircle } from 'lucide-react';

export default function LoginModal({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  
  // Login State
  const [email, setEmail] = useState('sarah.jenkins@acmecorp.com');
  const [password, setPassword] = useState('password123');
  
  // Register State
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [department, setDepartment] = useState('Engineering');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
        }
        onLogin({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          department: data.user.department,
          avatar: data.user.department.includes('Eng') ? '👩‍💻' : (data.user.department.includes('HR') || data.user.department.includes('People') ? '👨‍💼' : '🛡️'),
          balances: data.user.balances
        });
        return;
      } else {
        const errData = await response.json().catch(() => ({}));
        setErrorMsg(errData.error || 'Invalid corporate credentials');
      }
    } catch (err) {
      // Backend not running; fallback to simulated persona login
      const matched = MOCK_PERSONAS.find(p => p.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        onLogin(matched);
        return;
      } else {
        onLogin({
          id: 'custom-' + Date.now(),
          name: email.split('@')[0],
          role: 'Employee',
          department: 'General Staff',
          email: email,
          avatar: '👤',
          balances: {
            casualLeave: { used: 3, total: 12 },
            sickLeave: { used: 1, total: 10 },
            earnedLeave: { used: 4, total: 15 },
            homeOfficeClaimed: 250,
            homeOfficeLimit: 500,
            securityScore: 100
          }
        });
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name || !regEmail || !regPassword) {
      setErrorMsg('Please fill in all required fields');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: regEmail,
          password: regPassword,
          department,
          role: 'ROLE_EMPLOYEE'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
        }
        onLogin({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          department: data.user.department,
          avatar: '👤',
          balances: data.user.balances
        });
      } else {
        const errData = await response.json().catch(() => ({}));
        setErrorMsg(errData.error || 'Registration failed');
      }
    } catch (err) {
      // Fallback register
      onLogin({
        id: 'new-' + Date.now(),
        name,
        email: regEmail,
        role: 'ROLE_EMPLOYEE',
        department,
        avatar: '👤',
        balances: {
          casualLeave: { used: 0, total: 12 },
          sickLeave: { used: 0, total: 10 },
          earnedLeave: { used: 0, total: 15 },
          homeOfficeClaimed: 0,
          homeOfficeLimit: 500,
          securityScore: 100
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPersona = (persona) => {
    setEmail(persona.email);
    setPassword('password123');
    onLogin(persona);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-header">
          <div className="auth-icon-badge">
            <ShieldCheck size={24} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>ACME PolicyHub</h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--cyan-accent)', fontWeight: 600 }}>
              PostgreSQL (Port 5433) • Spring AI • Ollama
            </div>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 'var(--radius-sm)',
          padding: 3,
          marginBottom: '1.5rem',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.55rem',
              border: 'none',
              borderRadius: 6,
              background: mode === 'login' ? 'var(--primary)' : 'transparent',
              color: mode === 'login' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'var(--transition-fast)'
            }}
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.55rem',
              border: 'none',
              borderRadius: 6,
              background: mode === 'register' ? 'var(--primary)' : 'transparent',
              color: mode === 'register' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'var(--transition-fast)'
            }}
          >
            <UserPlus size={15} />
            <span>Register Employee</span>
          </button>
        </div>

        {errorMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '0.75rem 1rem',
            background: 'rgba(244,63,94,0.12)',
            border: '1px solid var(--rose)',
            borderRadius: 'var(--radius-sm)',
            color: '#fecdd3',
            fontSize: '0.82rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={16} color="var(--rose)" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Corporate Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sarah.jenkins@acmecorp.com"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-grad"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.8rem' }}
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                Corporate Email
              </label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="e.g. alex.rivera@acmecorp.com"
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  outline: 'none'
                }}
              >
                <option value="Engineering">Engineering</option>
                <option value="People Operations">People Operations (HR)</option>
                <option value="Information Security">Information Security</option>
                <option value="Finance & Accounting">Finance & Accounting</option>
                <option value="Product & Design">Product & Design</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                Password (min 6 characters)
              </label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-grad"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.3rem', padding: '0.75rem' }}
            >
              <span>{loading ? 'Creating Account...' : 'Register & Initialize Balances'}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* Demo Persona Quick Select */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-muted)',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>Or Quick Select Pre-Seeded Employee</span>
            <UserCheck size={14} color="var(--primary-light)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {MOCK_PERSONAS.map((persona) => (
              <div
                key={persona.id}
                onClick={() => handleQuickPersona(persona)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.55rem 0.85rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.12)';
                  e.currentTarget.style.borderColor = 'var(--border-highlight)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <div style={{ fontSize: '1.2rem' }}>{persona.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{persona.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {persona.role} • {persona.department}
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--primary-light)', fontWeight: 600 }}>
                  Select →
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
