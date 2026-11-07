import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-pill ${t.type || 'info'}`}>
          {t.type === 'success' && <CheckCircle2 size={18} color="var(--emerald)" />}
          {t.type === 'error' && <AlertCircle size={18} color="var(--rose)" />}
          {t.type === 'warning' && <AlertCircle size={18} color="var(--amber)" />}
          {(!t.type || t.type === 'info') && <Info size={18} color="var(--cyan-accent)" />}

          <div style={{ flex: 1, fontSize: '0.85rem' }}>
            {t.message}
          </div>

          <button
            onClick={() => onDismiss(t.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 2
            }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
