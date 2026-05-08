import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ScoreCard from './components/ScoreCard';
import SectionScores from './components/SectionScores';
import VLMPanel from './components/VLMPanel';
import JobMatch from './components/JobMatch';
import { analyzeResume, tailorResume } from './utils/api';
import { formatFileSize } from './utils/helpers';

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

const LOADING_STEPS = [
  { id: 'upload', label: 'Uploading resume...' },
  { id: 'parse', label: 'Extracting content...' },
  { id: 'vlm', label: 'VLM: Analyzing layout & visuals...' },
  { id: 'llm', label: 'LLM: Analyzing skills & keywords...' },
  { id: 'merge', label: 'Compiling report...' },
];

export default function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [tailored, setTailored] = useState(null);
  const [tailoring, setTailoring] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) {
      setFile(accepted[0]);
      setResult(null);
      setTailored(null);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDropRejected: (files) => {
      const err = files[0]?.errors[0];
      setError(err?.code === 'file-too-large' ? 'File exceeds 10MB limit.' : 'Unsupported file type. Use PDF, DOCX, or image.');
    }
  });

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setTailored(null);

    // Simulate step progression
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => Math.min(prev + 1, LOADING_STEPS.length - 1));
    }, 2000);

    try {
      const data = await analyzeResume(file, jobDescription);
      setResult(data);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Analysis failed. Please try again.';
      setError(msg);
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
      setLoadingStep(0);
    }
  };

  const handleTailor = async () => {
    if (!result || !jobDescription) return;
    setTailoring(true);
    try {
      const resumeText = result.llmAnalysis ? JSON.stringify(result.llmAnalysis) : '';
      const data = await tailorResume(resumeText, jobDescription);
      setTailored(data.tailored);
    } catch (err) {
      setError('Tailoring failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setTailoring(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setTailored(null);
    setError(null);
    setJobDescription('');
  };

  const llm = result?.llmAnalysis;
  const vlm = result?.vlmAnalysis;

  return (
    <div className="app">
      <div className="content-wrapper">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo">
            <span>⚡</span> Resume<span>AI</span>
          </div>
          <div className="nav-badge">LLM + VLM · HYBRID</div>
        </nav>

        {/* HERO */}
        <div className="hero">
          <div className="hero-eyebrow">AI-powered analysis</div>
          <h1>
            Your Resume,<br />
            <span className="highlight">Intelligently Analyzed</span>
          </h1>
          <p className="hero-sub">
            Dual-model analysis — GPT-4o reads your resume visually (VLM) AND textually (LLM) to catch what others miss.
          </p>
          <div className="tech-pills">
            <span className="tech-pill active">GPT-4o Vision</span>
            <span className="tech-pill active">VLM Analysis</span>
            <span className="tech-pill active">ATS Scoring</span>
            <span className="tech-pill">Skill Gap Detection</span>
            <span className="tech-pill">JD Matching</span>
          </div>
        </div>

        <div className="main">
          {!result && !loading && (
            <>
              {/* UPLOAD */}
              <div className="upload-section">
                <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                  <input {...getInputProps()} />
                  <div className="dropzone-icon">📄</div>
                  <h3>{isDragActive ? 'Drop it here!' : 'Drag & drop your resume'}</h3>
                  <p>or click to browse files</p>
                  <div className="file-types">PDF · DOCX · JPG · PNG · WEBP · MAX 10MB</div>
                </div>

                {file && (
                  <div className="file-selected">
                    <span>📎</span>
                    <div className="file-selected-name">{file.name}</div>
                    <div className="file-selected-size">{formatFileSize(file.size)}</div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
                    >×</button>
                  </div>
                )}
              </div>

              {/* JOB DESCRIPTION */}
              <div className="jd-section">
                <div className="section-label">
                  Job Description <span className="optional">— optional, enables JD matching</span>
                </div>
                <textarea
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here to get a match score and tailored suggestions..."
                />
              </div>

              {/* ERROR */}
              {error && (
                <div style={{ padding: '12px 16px', background: 'rgba(255,78,106,0.1)', border: '1px solid rgba(255,78,106,0.3)', borderRadius: 10, marginBottom: 16, color: '#ff8fa0', fontSize: '0.88rem' }}>
                  ⚠️ {error}
                </div>
              )}

              {/* ANALYZE BUTTON */}
              <button
                className="btn-analyze"
                onClick={handleAnalyze}
                disabled={!file}
              >
                {file ? '✨ Analyze Resume' : 'Upload a resume to continue'}
              </button>
            </>
          )}

          {/* LOADING STATE */}
          {loading && (
            <div className="loading-container">
              <div className="spinner" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>Analyzing your resume...</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 8 }}>
                GPT-4o is analyzing your resume visually and textually
              </p>
              <div className="loading-steps">
                {LOADING_STEPS.map((step, i) => (
                  <div key={step.id} className={`loading-step ${i === loadingStep ? 'active' : i < loadingStep ? 'done' : ''}`}>
                    <div className="step-dot" />
                    {i < loadingStep ? '✓ ' : ''}{step.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RESULTS */}
          {result && llm && (
            <>
              <div className="results-header">
                <div>
                  <div className="results-title">
                    Analysis Complete {llm.candidateName !== 'Unknown' ? `— ${llm.candidateName}` : ''}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.83rem', marginTop: 4 }}>
                    {llm.experienceSummary?.primaryDomain} · {llm.experienceSummary?.seniorityLevel} · {llm.experienceSummary?.yearsOfExperience}y exp
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div className={`analysis-mode-badge mode-${result.meta.analysisMode === 'hybrid' ? 'hybrid' : result.meta.analysisMode === 'vlm-only' ? 'vlm' : 'llm'}`}>
                    {result.meta.analysisMode}
                  </div>
                  <button className="btn-reset" onClick={handleReset}>← New Analysis</button>
                </div>
              </div>

              {/* SCORES */}
              <div className="scores-grid">
                <ScoreCard label="Overall Score" score={result.scores.overall} type="overall" />
                <ScoreCard label="ATS Text Score" score={result.scores.atsText} type="ats" note="content" />
                {result.scores.layout !== null && (
                  <ScoreCard label="Layout Score" score={result.scores.layout} type="layout" note="visual" />
                )}
              </div>

              {/* SUMMARY */}
              {llm.summary && (
                <div className="card">
                  <div className="card-title"><span className="icon">📝</span> AI Assessment</div>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>{llm.summary}</p>
                </div>
              )}

              {/* SECTION SCORES */}
              {llm.sectionScores && <SectionScores scores={llm.sectionScores} />}

              {/* VLM Panel */}
              <VLMPanel vlm={vlm} />

              {/* SKILLS */}
              {(llm.detectedSkills?.length > 0 || llm.missingSkills?.length > 0) && (
                <div className="card">
                  <div className="card-title"><span className="icon">🛠️</span> Skills Analysis</div>
                  {llm.detectedSkills?.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div className="section-label">Detected Skills</div>
                      <div className="tag-grid">
                        {llm.detectedSkills.map((s, i) => <span key={i} className="tag tag-skill">{s}</span>)}
                      </div>
                    </div>
                  )}
                  {llm.missingSkills?.length > 0 && (
                    <div>
                      <div className="section-label">Missing / Recommended Skills</div>
                      <div className="tag-grid">
                        {llm.missingSkills.map((s, i) => <span key={i} className="tag tag-missing">{s}</span>)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* KEYWORDS */}
              {llm.keywordDensity && (
                <div className="card">
                  <div className="card-title"><span className="icon">🔑</span> ATS Keywords</div>
                  {llm.keywordDensity.strong?.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <div className="section-label">Strong Keywords</div>
                      <div className="tag-grid">
                        {llm.keywordDensity.strong.map((k, i) => <span key={i} className="tag tag-keyword-strong">{k}</span>)}
                      </div>
                    </div>
                  )}
                  {llm.keywordDensity.missing?.length > 0 && (
                    <div>
                      <div className="section-label">Missing Keywords</div>
                      <div className="tag-grid">
                        {llm.keywordDensity.missing.map((k, i) => <span key={i} className="tag tag-keyword-missing">{k}</span>)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SUGGESTIONS */}
              {llm.suggestions?.length > 0 && (
                <div className="card">
                  <div className="card-title"><span className="icon">💡</span> Suggestions ({llm.suggestions.length})</div>
                  <div className="suggestion-list">
                    {llm.suggestions.map((s, i) => (
                      <div key={i} className={`suggestion-item ${s.priority}`}>
                        <div className="suggestion-dot" />
                        <div>
                          <div className="suggestion-category">{s.category} · {s.priority} priority</div>
                          <div className="suggestion-text">{s.suggestion}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BULLET REWRITES */}
              {llm.bulletPointAnalysis?.length > 0 && (
                <div className="card">
                  <div className="card-title"><span className="icon">✍️</span> Bullet Point Rewrites</div>
                  <div className="bullet-rewrites">
                    {llm.bulletPointAnalysis.slice(0, 4).map((b, i) => (
                      <div key={i} className="bullet-item">
                        <div className="bullet-original">
                          <div className="bullet-label">Original</div>
                          {b.original}
                        </div>
                        <div className="bullet-improved">
                          <div className="bullet-label">Improved</div>
                          {b.improved}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STRENGTHS & RED FLAGS */}
              {(llm.strengths?.length > 0 || llm.redFlags?.length > 0) && (
                <div className="card">
                  <div className="card-title"><span className="icon">⚡</span> Strengths & Red Flags</div>
                  {llm.strengths?.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div className="section-label">Strengths</div>
                      <div className="strengths-list">
                        {llm.strengths.map((s, i) => (
                          <div key={i} className="strength-item">
                            <span className="strength-icon">✓</span> {s}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {llm.redFlags?.length > 0 && (
                    <div>
                      <div className="section-label">Red Flags</div>
                      <div className="strengths-list">
                        {llm.redFlags.map((f, i) => (
                          <div key={i} className="strength-item">
                            <span className="flag-icon">⚠</span> {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* JOB MATCH */}
              <JobMatch jobMatch={llm.jobMatch} />

              {/* TAILOR SECTION */}
              {jobDescription && llm.jobMatch && (
                <div className="card tailor-section">
                  <div className="card-title"><span className="icon">🎨</span> AI Resume Tailoring</div>
                  {!tailored ? (
                    <>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
                        Get AI-rewritten sections — summary, skills, and bullet points — optimized for this specific job.
                      </p>
                      <button
                        className="btn-analyze"
                        onClick={handleTailor}
                        disabled={tailoring}
                        style={{ background: 'linear-gradient(135deg, #00b894, #00cec9)' }}
                      >
                        {tailoring ? '✨ Tailoring your resume...' : '✨ Tailor Resume for This Job'}
                      </button>
                    </>
                  ) : (
                    <>
                      {tailored.tailoredSummary && (
                        <div className="tailored-card">
                          <div className="tailored-label">Tailored Summary</div>
                          <div className="tailored-content">{tailored.tailoredSummary}</div>
                        </div>
                      )}
                      {tailored.tailoredSkillsSection && (
                        <div className="tailored-card">
                          <div className="tailored-label">Optimized Skills Section</div>
                          <div className="tailored-content">{tailored.tailoredSkillsSection}</div>
                        </div>
                      )}
                      {tailored.coverLetterOpener && (
                        <div className="tailored-card">
                          <div className="tailored-label">Cover Letter Opener</div>
                          <div className="tailored-content">{tailored.coverLetterOpener}</div>
                        </div>
                      )}
                      {tailored.keywordsToAdd?.length > 0 && (
                        <div style={{ marginTop: 12 }}>
                          <div className="section-label">Keywords to Add</div>
                          <div className="tag-grid">
                            {tailored.keywordsToAdd.map((k, i) => <span key={i} className="tag tag-keyword-missing">{k}</span>)}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* METADATA */}
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: 1 }}>
                {result.meta.filename} · {result.meta.analysisMode.toUpperCase()} mode · {new Date(result.meta.analyzedAt).toLocaleTimeString()}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
