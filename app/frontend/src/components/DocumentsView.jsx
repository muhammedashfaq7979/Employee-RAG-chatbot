import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Upload, 
  BookOpen, 
  Bot, 
  Tag, 
  Calendar, 
  CheckCircle2 
} from 'lucide-react';
import { MOCK_DOCUMENTS } from '../data/mockData';

export default function DocumentsView({ onOpenDocument, onAskAboutDocument, onOpenUploadModal }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'HR & Benefits', 'IT & Security', 'Compliance'];

  const filteredDocs = MOCK_DOCUMENTS.filter((doc) => {
    const matchesCategory = activeCategory === 'All' || doc.category === activeCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="main-view-container">
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '0.25rem' }}>Company Policy Library</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Official compliance, HR, and technical policies indexed into our local RAG vector store.
          </p>
        </div>

        <button
          onClick={onOpenUploadModal}
          className="btn-grad"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Upload size={16} />
          <span>Upload New Policy</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: activeCategory === cat ? 'rgba(99,102,241,0.2)' : 'var(--bg-card)',
                border: `1px solid ${activeCategory === cat ? 'var(--border-highlight)' : 'var(--border-subtle)'}`,
                color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: activeCategory === cat ? 600 : 500,
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.5rem 1rem',
          width: 280
        }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search policies..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '0.85rem',
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.4rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <div>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', marginBottom: '0.85rem' }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid var(--border-highlight)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-light)',
                  flexShrink: 0
                }}>
                  <FileText size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--cyan-accent)', marginBottom: 2 }}>
                    {doc.category}
                  </div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 700, lineHeight: 1.3 }}>
                    {doc.title}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: '1rem' }}>
                {doc.description}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                {doc.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    style={{
                      fontSize: '0.68rem',
                      padding: '2px 7px',
                      borderRadius: 4,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              {/* Metadata footer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                marginBottom: '0.85rem'
              }}>
                <span>{doc.version} • {doc.pages} Pages</span>
                <span>Updated {doc.lastUpdated}</span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => onOpenDocument(doc)}
                  className="btn-outline"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '0.5rem',
                    fontSize: '0.8rem'
                  }}
                >
                  <BookOpen size={14} />
                  <span>Read Policy</span>
                </button>

                <button
                  onClick={() => onAskAboutDocument(doc)}
                  className="btn-grad"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '0.5rem',
                    fontSize: '0.8rem'
                  }}
                >
                  <Bot size={14} />
                  <span>Ask AI</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
