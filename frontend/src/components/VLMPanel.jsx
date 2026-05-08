import React from 'react';

export default function VLMPanel({ vlm }) {
  if (!vlm) return null;

  const { atsVisualIssues = [], visualObservations = {}, atsCompatibilityVerdict, visualFeedback } = vlm;

  const verdictColor = {
    PASS: '#00e5a0',
    PARTIAL: '#ffb347',
    FAIL: '#ff4e6a',
  }[atsCompatibilityVerdict] || '#7070a0';

  const boolObs = [
    { label: 'Multi-Column Layout', value: visualObservations.hasMultipleColumns },
    { label: 'Tables / Graphics', value: visualObservations.hasTablesOrGraphics },
    { label: 'Icons Instead of Text', value: visualObservations.hasIconsInsteadOfText },
    { label: 'Poor Font Hierarchy', value: visualObservations.hasPoorFontHierarchy },
  ].filter(o => o.value !== undefined);

  return (
    <>
      {/* ATS Verdict */}
      <div className="card">
        <div className="card-title"><span className="icon">👁️</span> Visual ATS Verdict</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{
            fontSize: '1.8rem', fontWeight: 800, color: verdictColor,
            fontFamily: 'var(--font-mono)', letterSpacing: 2,
          }}>
            {atsCompatibilityVerdict}
          </div>
          <div style={{ flex: 1, fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
            {visualFeedback}
          </div>
        </div>

        {/* Boolean Observations */}
        {boolObs.length > 0 && (
          <div className="obs-grid">
            {boolObs.map(o => (
              <div key={o.label} className="obs-item">
                <div className="obs-label">{o.label}</div>
                <div className={`obs-value ${o.value ? 'obs-bool-true' : 'obs-bool-false'}`}>
                  {o.value ? '✗ Detected' : '✓ Not Found'}
                </div>
              </div>
            ))}
            {visualObservations.overallDesignStyle && (
              <div className="obs-item">
                <div className="obs-label">Design Style</div>
                <div className="obs-value" style={{ color: 'var(--accent2)' }}>
                  {visualObservations.overallDesignStyle}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Layout Issues */}
      {atsVisualIssues.length > 0 && (
        <div className="card">
          <div className="card-title"><span className="icon">⚠️</span> Visual ATS Issues ({atsVisualIssues.length})</div>
          {atsVisualIssues.map((issue, i) => (
            <div key={i} className={`vlm-issue ${issue.severity}`}>
              <div className="vlm-issue-header">
                <div className="vlm-issue-title">{issue.issue}</div>
                <div className={`severity-badge sev-${issue.severity}`}>{issue.severity}</div>
              </div>
              <div className="vlm-issue-desc">{issue.description}</div>
              {issue.fix && (
                <div className="vlm-issue-fix">→ Fix: {issue.fix}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
