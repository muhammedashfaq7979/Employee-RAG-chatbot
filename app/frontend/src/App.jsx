import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import AgentView from './components/AgentView';
import DocumentsView from './components/DocumentsView';
import LoginModal from './components/LoginModal';
import ActionModals from './components/ActionModals';
import DocumentDrawer from './components/DocumentDrawer';
import CitationDrawer from './components/CitationDrawer';
import Toast from './components/Toast';
import { MOCK_PERSONAS, MOCK_DOCUMENTS } from './data/mockData';

export default function App() {
  const [currentUser, setCurrentUser] = useState(MOCK_PERSONAS[0]); // Default to Sarah Jenkins
  const [activeTab, setActiveTab] = useState('dashboard');
  const [agentInitialQuery, setAgentInitialQuery] = useState('');
  
  // Modals & Drawers
  const [activeModal, setActiveModal] = useState(null); // 'leave', 'allowance', 'incident', 'upload'
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedCitation, setSelectedCitation] = useState(null);
  
  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = 'toast-' + Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setActiveTab('agent');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigateToAgent = (query) => {
    setAgentInitialQuery(query);
    setActiveTab('agent');
  };

  const handleAskAboutDocument = (doc) => {
    handleNavigateToAgent(`Please summarize the key rules and entitlements in ${doc.title}`);
  };

  const handleOpenCitationFullDoc = (sourceFilename) => {
    const doc = MOCK_DOCUMENTS.find(d => d.filename === sourceFilename);
    if (doc) {
      setSelectedCitation(null);
      setSelectedDoc(doc);
    } else {
      addToast(`Full document ${sourceFilename} is indexed in pgvector.`, 'info');
    }
  };

  const handleUpdateBalances = (newBalances) => {
    setCurrentUser((prev) => ({
      ...prev,
      balances: newBalances
    }));
  };

  if (!currentUser) {
    return (
      <LoginModal 
        onLogin={(user) => {
          setCurrentUser(user);
          addToast(`Signed in as ${user.name} (${user.role})`, 'success');
        }} 
      />
    );
  }

  return (
    <div className="app-layout">
      {/* Persistent Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={currentUser} 
        onLogout={() => {
          setCurrentUser(null);
          addToast('Signed out successfully', 'info');
        }}
      />

      {/* Main Content Area */}
      <div className="app-content">
        <Navbar 
          activeTab={activeTab} 
          user={currentUser} 
          onSwitchUser={(user) => {
            setCurrentUser(user);
            addToast(`Switched active persona to ${user.name}`, 'info');
          }}
          onSearchClick={() => setActiveTab('agent')}
        />

        {/* Dynamic Viewport */}
        {activeTab === 'dashboard' && (
          <DashboardView 
            user={currentUser} 
            onNavigateToAgent={handleNavigateToAgent} 
            onOpenActionModal={(modalName) => setActiveModal(modalName)}
          />
        )}

        {activeTab === 'agent' && (
          <AgentView 
            initialQuery={agentInitialQuery}
            onOpenCitation={(citation) => setSelectedCitation(citation)}
            onShowToast={addToast}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentsView 
            onOpenDocument={(doc) => setSelectedDoc(doc)}
            onAskAboutDocument={handleAskAboutDocument}
            onOpenUploadModal={() => setActiveModal('upload')}
          />
        )}

        {activeTab === 'actions' && (
          <div className="main-view-container">
            <h1 style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>Employee Self-Service Actions</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', fontSize: '0.9rem' }}>
              Submit time-off requests, claim ergonomic allowances, report cybersecurity incidents, or index new policies.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div 
                className="action-card-btn" 
                onClick={() => setActiveModal('leave')}
                style={{ padding: '1.5rem', background: 'var(--bg-card)' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌴</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Apply for Leave</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Apply for Casual Leave, Sick Leave, or Earned Leave with automated quota deduction.
                </div>
              </div>

              <div 
                className="action-card-btn" 
                onClick={() => setActiveModal('allowance')}
                style={{ padding: '1.5rem', background: 'var(--bg-card)' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💻</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Claim Home Office Equipment</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Claim ergonomic monitors, chairs, or desk converters up to your $500 one-time limit.
                </div>
              </div>

              <div 
                className="action-card-btn" 
                onClick={() => setActiveModal('incident')}
                style={{ padding: '1.5rem', background: 'var(--bg-card)' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚨</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Report IT Security Incident</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Report suspected phishing emails, lost hardware, or unauthorized access attempts.
                </div>
              </div>

              <div 
                className="action-card-btn" 
                onClick={() => setActiveModal('upload')}
                style={{ padding: '1.5rem', background: 'var(--bg-card)' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Upload New Policy</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Upload corporate PDF or Markdown files to be chunked and embedded into pgvector.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Slide-out Drawers & Modals */}
      <DocumentDrawer 
        document={selectedDoc} 
        onClose={() => setSelectedDoc(null)} 
        onAskAboutDoc={handleAskAboutDocument}
      />

      <CitationDrawer 
        citation={selectedCitation} 
        onClose={() => setSelectedCitation(null)} 
        onOpenFullDoc={handleOpenCitationFullDoc}
      />

      <ActionModals 
        activeModal={activeModal} 
        onClose={() => setActiveModal(null)} 
        user={currentUser} 
        onUpdateUserBalance={handleUpdateBalances}
        onShowToast={addToast}
      />

      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
