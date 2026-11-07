import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  Copy, 
  Check, 
  RotateCcw, 
  FileText, 
  ExternalLink,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { SAMPLE_KB } from '../data/mockData';

export default function AgentView({ initialQuery, onOpenCitation, onShowToast }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I am your **ACME Policy Assistant**, powered by local Ollama (\`llama3.1:8b\`) and \`pgvector\`.\n\nI can answer questions regarding:\n- **Leave entitlements & carry-forward rules**\n- **Remote work & home office allowance ($500 limit)**\n- **IT device security & password policies**\n- **Health coverage & wellness stipends**\n\nAll answers are strictly verified against official corporate documents and cited with exact page numbers. How can I help you today?`,
      citations: [
        {
          sourceFile: 'HR_Leave_Policy_2024.md',
          pageNumber: 1,
          section: 'Section 1 Scope',
          excerpt: 'This policy applies to all full-time and contract employees of ACME Corp.'
        }
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMode, setSelectedMode] = useState('general');
  const [copiedId, setCopiedId] = useState(null);
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const modes = [
    { id: 'general', label: '🛡️ General Policy Q&A' },
    { id: 'leave', label: '🌴 Leave & Time Off' },
    { id: 'security', label: '🔒 IT Security & Remote Work' },
    { id: 'benefits', label: '🩺 Benefits & Insurance' }
  ];

  const suggestedQuestions = [
    'How many sick leaves can I carry forward to next year?',
    'What is the maximum home office reimbursement amount?',
    'What are the password complexity requirements?',
    'What is the notice period for taking Earned Leave (EL)?',
    'Are employees allowed to use ChatGPT with company code?'
  ];

  const handleSend = async (queryText) => {
    const query = queryText || input;
    if (!query.trim() || isTyping) return;

    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Try communicating with the live Spring Boot Backend (http://localhost:8000/api/chat)
    let backendSuccess = false;
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query, topK: 4, similarityThreshold: 0.65 })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg = {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: data.answer,
          citations: data.citations || [],
          foundInPolicies: data.foundInPolicies,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, aiMsg]);
        backendSuccess = true;
      }
    } catch (err) {
      // Backend not running yet or connection refused; fallback to client knowledge base simulation
      backendSuccess = false;
    }

    if (!backendSuccess) {
      // Simulated intelligent local RAG lookup
      setTimeout(() => {
        const lowerQ = query.toLowerCase();
        let match = SAMPLE_KB.find((item) =>
          item.keywords.some((kw) => lowerQ.includes(kw))
        );

        let answerText;
        let citations = [];

        if (match) {
          answerText = match.answer;
          citations = match.citations;
        } else {
          answerText = `I cannot find verified information regarding this question in the official ACME policy documents.\n\nUnder corporate compliance rules, I am programmed **never to extrapolate or assume policies**. Please reach out to People Operations (\`hr@acmecorp.com\`) or Information Security (\`security@acmecorp.com\`).`;
        }

        const aiMsg = {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: answerText,
          citations: citations,
          foundInPolicies: !!match,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
      }, 750);
    } else {
      setIsTyping(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast('Answer copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (msgId, type) => {
    setFeedbackGiven((prev) => ({ ...prev, [msgId]: type }));
    onShowToast(`Thank you! Feedback recorded (${type === 'up' ? 'Helpful' : 'Needs review'})`, 'success');
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: 'Chat history cleared. What corporate policy would you like to ask about?',
        citations: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    onShowToast('Chat conversation reset', 'info');
  };

  return (
    <div className="main-view-container" style={{ paddingBottom: '1rem' }}>
      <div className="agent-chat-wrapper">
        <div className="chat-thread-pane">
          {/* Header */}
          <div className="chat-header-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px var(--primary-glow)'
              }}>
                <Bot size={22} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700 }}>ACME Policy Agent</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--cyan-accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Cpu size={12} />
                  <span>Local Ollama (llama3.1:8b) • pgvector Grounded</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleClearChat}
              className="btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            >
              <RotateCcw size={14} />
              <span>Reset Chat</span>
            </button>
          </div>

          {/* Mode Selector */}
          <div className="chat-modes">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`chat-mode-pill ${selectedMode === mode.id ? 'active' : ''}`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="messages-list">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-bubble-row ${msg.sender}`}>
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: msg.sender === 'user' ? 'var(--primary-gradient)' : 'rgba(6,182,212,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: msg.sender === 'user' ? '#fff' : 'var(--cyan-accent)',
                  flexShrink: 0
                }}>
                  {msg.sender === 'user' ? '👤' : <Bot size={18} />}
                </div>

                <div className="message-bubble">
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                  </div>

                  {/* Citations Box */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <div style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'var(--cyan-accent)',
                        marginBottom: '0.4rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        <ShieldCheck size={13} />
                        <span>Verified Source Citations:</span>
                      </div>

                      <div>
                        {msg.citations.map((cite, cIdx) => (
                          <span
                            key={cIdx}
                            className="citation-chip"
                            onClick={() => onOpenCitation(cite)}
                            title="Click to view verified excerpt"
                          >
                            <FileText size={12} color="var(--cyan-accent)" />
                            <span>{cite.sourceFile} (Page {cite.pageNumber || 1})</span>
                            <ExternalLink size={10} color="var(--text-muted)" />
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Bar for AI Messages */}
                  {msg.sender === 'ai' && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '0.65rem',
                      paddingTop: '0.45rem',
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)'
                    }}>
                      <span>{msg.timestamp}</span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          title="Copy Answer"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: copiedId === msg.id ? 'var(--emerald)' : 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: 3
                          }}
                        >
                          {copiedId === msg.id ? <Check size={14} /> : <Copy size={14} />}
                        </button>

                        <button
                          onClick={() => handleFeedback(msg.id, 'up')}
                          title="Helpful"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: feedbackGiven[msg.id] === 'up' ? 'var(--emerald)' : 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: 3
                          }}
                        >
                          <ThumbsUp size={14} />
                        </button>

                        <button
                          onClick={() => handleFeedback(msg.id, 'down')}
                          title="Inaccurate or incomplete"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: feedbackGiven[msg.id] === 'down' ? 'var(--rose)' : 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: 3
                          }}
                        >
                          <ThumbsDown size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message-bubble-row ai">
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: 'rgba(6,182,212,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--cyan-accent)'
                }}>
                  <Bot size={18} />
                </div>
                <div className="message-bubble" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.85rem 1.2rem' }}>
                  <Sparkles size={16} color="var(--cyan-accent)" style={{ animation: 'spin 2s linear infinite' }} />
                  <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                    Searching vector database & synthesizing answer...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompt Chips */}
          <div style={{
            padding: '0.6rem 1.5rem',
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(10,15,26,0.5)'
          }}>
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.76rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.15)';
                  e.currentTarget.style.borderColor = 'var(--border-highlight)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Controls */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="chat-input-controls"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about leave rules, security, expenses..."
              style={{
                flex: 1,
                padding: '0.8rem 1.1rem',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: '0.92rem',
                outline: 'none'
              }}
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="btn-grad"
              style={{ padding: '0.8rem 1.3rem' }}
            >
              <span>Send</span>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
