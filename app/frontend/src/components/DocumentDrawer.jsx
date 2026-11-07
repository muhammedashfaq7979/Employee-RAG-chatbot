import React from 'react';
import { X, FileText, Calendar, Tag, Bot, Download } from 'lucide-react';

export default function DocumentDrawer({ document, onClose, onAskAboutDoc }) {
  if (!document) return null;

  return (
    <div className="side-drawer-backdrop" onClick={onClose}>
      <div className="side-drawer-body" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15,23,42,0.8)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'rgba(99,102,241,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-light)'
            }}>
              <FileText size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--cyan-accent)', fontWeight: 700, textTransform: 'uppercase' }}>
                {document.category}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>
                {document.title}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => onAskAboutDoc(document)}
              className="btn-grad"
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <Bot size={14} />
              <span>Ask AI</span>
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: 4
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Drawer Body - Formatted Document Reader */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1, lineHeight: 1.7, fontSize: '0.92rem' }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
            paddingBottom: '1rem',
            marginBottom: '1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)'
          }}>
            <span>Version: <strong>{document.version}</strong></span>
            <span>Pages: <strong>{document.pages}</strong></span>
            <span>Author: <strong>{document.author}</strong></span>
            <span>Updated: <strong>{document.lastUpdated}</strong></span>
          </div>

          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-sans)', color: 'var(--text-primary)' }}>
            {document.content}
          </div>
        </div>
      </div>
    </div>
  );
}
