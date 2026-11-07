import React, { useState } from 'react';
import { X, Calendar, Upload, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function ActionModals({ activeModal, onClose, user, onUpdateUserBalance, onShowToast }) {
  // Leave Form State
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  // Allowance Form State
  const [allowanceAmount, setAllowanceAmount] = useState('150');
  const [itemType, setItemType] = useState('Ergonomic Chair');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2024-8891');

  // Incident Form State
  const [incidentType, setIncidentType] = useState('Phishing Email');
  const [incidentUrgency, setIncidentUrgency] = useState('High');
  const [incidentDetails, setIncidentDetails] = useState('');

  // Upload Doc State
  const [docTitle, setDocTitle] = useState('');
  const [docDept, setDocDept] = useState('People Operations');
  const [isUploading, setIsUploading] = useState(false);

  if (!activeModal) return null;

  // Handle Apply Leave
  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      onShowToast('Please specify start and end dates', 'error');
      return;
    }

    const days = 2; // Simulated 2 days duration
    let key = 'casualLeave';
    if (leaveType.includes('Sick')) key = 'sickLeave';
    if (leaveType.includes('Earned')) key = 'earnedLeave';

    const currentUsed = user.balances[key].used;
    const total = user.balances[key].total;

    if (currentUsed + days > total) {
      onShowToast(`Insufficient ${leaveType} balance!`, 'error');
      return;
    }

    onUpdateUserBalance({
      ...user.balances,
      [key]: { ...user.balances[key], used: currentUsed + days }
    });

    onShowToast(`Leave request submitted for ${days} days (${leaveType})!`, 'success');
    onClose();
  };

  // Handle Equipment Claim
  const handleAllowanceSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(allowanceAmount) || 0;
    const remaining = user.balances.homeOfficeLimit - user.balances.homeOfficeClaimed;

    if (amount <= 0 || amount > remaining) {
      onShowToast(`Amount exceeds available limit of $${remaining}`, 'error');
      return;
    }

    onUpdateUserBalance({
      ...user.balances,
      homeOfficeClaimed: user.balances.homeOfficeClaimed + amount
    });

    onShowToast(`Equipment claim of $${amount} submitted for approval!`, 'success');
    onClose();
  };

  // Handle Incident Report
  const handleIncidentSubmit = (e) => {
    e.preventDefault();
    onShowToast(`Incident report (#INC-${Math.floor(Math.random() * 9000 + 1000)}) dispatched to security@acmecorp.com!`, 'warning');
    onClose();
  };

  // Handle Document Upload
  const handleDocUploadSubmit = (e) => {
    e.preventDefault();
    if (!docTitle) {
      onShowToast('Please provide a document title', 'error');
      return;
    }
    setIsUploading(true);

    setTimeout(() => {
      setIsUploading(false);
      onShowToast(`Policy "${docTitle}" successfully chunked & indexed into pgvector!`, 'success');
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content-card">
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ fontSize: '1.15rem' }}>
            {activeModal === 'leave' && '🌴 Apply for Time Off'}
            {activeModal === 'allowance' && '💻 Claim Home Office Equipment'}
            {activeModal === 'incident' && '🚨 Report Security Incident'}
            {activeModal === 'upload' && '📄 Upload New Policy to Vector DB'}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem' }}>
          {/* LEAVE FORM */}
          {activeModal === 'leave' && (
            <form onSubmit={handleLeaveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Leave Type
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    outline: 'none'
                  }}
                >
                  <option value="Casual Leave">Casual Leave ({user.balances.casualLeave.total - user.balances.casualLeave.used} days left)</option>
                  <option value="Sick Leave">Sick Leave ({user.balances.sickLeave.total - user.balances.sickLeave.used} days left)</option>
                  <option value="Earned Leave">Earned Leave ({user.balances.earnedLeave.total - user.balances.earnedLeave.used} days left)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
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
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#fff',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Reason & Contact Info
                </label>
                <textarea
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Personal matters, reachable via Slack for emergencies."
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-grad">Submit Request</button>
              </div>
            </form>
          )}

          {/* ALLOWANCE FORM */}
          {activeModal === 'allowance' && (
            <form onSubmit={handleAllowanceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '0.85rem', background: 'rgba(6,182,212,0.1)', border: '1px solid var(--border-cyan)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: '#e0f2fe' }}>
                Your remaining Home Office Allowance: <strong>${user.balances.homeOfficeLimit - user.balances.homeOfficeClaimed}</strong> (of $500 total).
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Equipment Item
                </label>
                <select
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    outline: 'none'
                  }}
                >
                  <option value="Ergonomic Chair">Ergonomic Office Chair</option>
                  <option value="4K External Monitor">External 4K Monitor</option>
                  <option value="Standing Desk Converter">Standing Desk Converter</option>
                  <option value="Docking Station & Hub">Docking Station & Cabling</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Reimbursement Amount ($ USD)
                </label>
                <input
                  type="number"
                  value={allowanceAmount}
                  onChange={(e) => setAllowanceAmount(e.target.value)}
                  max={user.balances.homeOfficeLimit - user.balances.homeOfficeClaimed}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
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
                  Invoice / Receipt Reference
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-grad">Claim Reimbursement</button>
              </div>
            </form>
          )}

          {/* INCIDENT FORM */}
          {activeModal === 'incident' && (
            <form onSubmit={handleIncidentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Incident Classification
                </label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    outline: 'none'
                  }}
                >
                  <option value="Phishing Email">Suspicious Phishing Email / Link</option>
                  <option value="Lost Hardware">Lost or Stolen Company Laptop / YubiKey</option>
                  <option value="Unauthorized Access">Suspected Account Compromise</option>
                  <option value="Software Vulnerability">Unapproved Software Prompt</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Urgency Level
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['Low', 'Medium', 'High', 'Critical'].map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setIncidentUrgency(lvl)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: 6,
                        border: '1px solid var(--border-subtle)',
                        background: incidentUrgency === lvl ? 'rgba(244,63,94,0.2)' : 'rgba(255,255,255,0.03)',
                        color: incidentUrgency === lvl ? 'var(--rose)' : 'var(--text-secondary)',
                        fontWeight: incidentUrgency === lvl ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Description & Details
                </label>
                <textarea
                  rows="3"
                  value={incidentDetails}
                  onChange={(e) => setIncidentDetails(e.target.value)}
                  placeholder="Include sender address, timestamp, device serial, or error messages."
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-grad" style={{ background: 'var(--rose)' }}>Dispatch Alert</button>
              </div>
            </form>
          )}

          {/* UPLOAD POLICY FORM */}
          {activeModal === 'upload' && (
            <form onSubmit={handleDocUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Policy Document Title
                </label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Travel & Meal Expense Policy (2024)"
                  style={{
                    width: '100%',
                    padding: '0.7rem',
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
                  Department Classification
                </label>
                <select
                  value={docDept}
                  onChange={(e) => setDocDept(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    outline: 'none'
                  }}
                >
                  <option value="People Operations">People Operations (HR)</option>
                  <option value="Information Security">Information Security</option>
                  <option value="Finance & Accounting">Finance & Accounting</option>
                  <option value="Legal & Compliance">Legal & Compliance</option>
                </select>
              </div>

              {/* Drag Drop Area */}
              <div style={{
                padding: '2rem 1rem',
                border: '2px dashed var(--border-highlight)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                background: 'rgba(99,102,241,0.05)',
                cursor: 'pointer'
              }}>
                <Upload size={32} color="var(--primary-light)" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Drop PDF, Markdown, or DOCX here</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Files will be chunked into 500-token vectors for pgvector</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
                <button type="submit" disabled={isUploading} className="btn-grad">
                  {isUploading ? 'Chunking & Embedding...' : 'Index Document'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
