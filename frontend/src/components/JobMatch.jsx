import React from 'react';
import { getScoreClass } from '../utils/helpers';

export default function JobMatch({ jobMatch }) {
  if (!jobMatch) return null;

  const { matchScore, matchedKeywords = [], missingKeywords = [], tailoringSuggestions = [] } = jobMatch;

  return (
    <div className="card">
      <div className="card-title"><span className="icon">🎯</span> Job Description Match</div>

      <div className="match-score-ring">
        <div className={`match-score-num ${getScoreClass(matchScore)}`}>{matchScore}<span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>%</span></div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>Match Score</div>
      </div>

      {matchedKeywords.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
            Matched Keywords
          </div>
          <div className="tag-grid">
            {matchedKeywords.map((k, i) => <span key={i} className="tag tag-keyword-strong">{k}</span>)}
          </div>
        </div>
      )}

      {missingKeywords.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
            Missing Keywords
          </div>
          <div className="tag-grid">
            {missingKeywords.map((k, i) => <span key={i} className="tag tag-keyword-missing">{k}</span>)}
          </div>
        </div>
      )}

      {tailoringSuggestions.length > 0 && (
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
            Tailoring Tips
          </div>
          <div className="suggestion-list">
            {tailoringSuggestions.map((s, i) => (
              <div key={i} className="suggestion-item medium">
                <div className="suggestion-dot" />
                <div className="suggestion-text">{s}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
