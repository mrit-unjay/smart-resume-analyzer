import React from 'react';
import { getBarColor } from '../utils/helpers';

export default function SectionScores({ scores }) {
  const sections = Object.entries(scores).filter(([, v]) => v !== null && v !== undefined);
  if (!sections.length) return null;

  return (
    <div className="card">
      <div className="card-title"><span className="icon">📊</span> Section Scores</div>
      <div className="section-bars">
        {sections.map(([key, score]) => (
          <div key={key} className="section-bar-item">
            <div className="section-bar-label">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
            <div className="section-bar-track">
              <div
                className="section-bar-fill"
                style={{ width: `${score * 10}%`, background: getBarColor(score) }}
              />
            </div>
            <div className="section-bar-score">{score}/10</div>
          </div>
        ))}
      </div>
    </div>
  );
}
