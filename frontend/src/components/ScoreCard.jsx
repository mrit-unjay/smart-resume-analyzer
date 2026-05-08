import React from 'react';
import { getScoreClass, getScoreLabel } from '../utils/helpers';

export default function ScoreCard({ label, score, type, note }) {
  if (score === null || score === undefined) return null;

  return (
    <div className={`score-card ${type}`}>
      <div className="score-label">{label}</div>
      <div className={`score-value ${getScoreClass(score)}`}>{score}</div>
      <div className="score-sub">{getScoreLabel(score)}{note ? ` · ${note}` : ''}</div>
    </div>
  );
}
