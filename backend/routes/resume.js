const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");
const { extractText, bufferToBase64 } = require("../services/fileParser");
const { analyzeWithVLM } = require("../services/vlmAnalyzer");
const { analyzeWithLLM, tailorResume } = require("../services/llmAnalyzer");

/**
 * POST /api/resume/analyze
 * Main endpoint: Upload resume → VLM + LLM hybrid analysis
 * Body: multipart/form-data
 *   - file: resume file (PDF, DOCX, JPG, PNG, WEBP)
 *   - jobDescription: (optional) string
 */
router.post("/analyze", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { buffer, mimetype, originalname, size } = req.file;
    const jobDescription = req.body.jobDescription || null;

    console.log(`\n📄 Analyzing: ${originalname} (${mimetype}, ${(size / 1024).toFixed(1)}KB)`);

    // Step 1: Extract text (for LLM)
    const parsedFile = await extractText(buffer, mimetype);
    console.log(`✅ Text extracted. Is image: ${parsedFile.isImage}`);

    // Step 2: Prepare base64 for VLM (images + PDFs)
    const base64Data = bufferToBase64(buffer, mimetype);

    // Step 3: Run VLM analysis (layout, visual ATS issues)
    let vlmResult = null;
    const isVisuallyAnalyzable =
      parsedFile.isImage || mimetype === "application/pdf";

    if (isVisuallyAnalyzable) {
      console.log(`🔍 Running VLM (visual) analysis...`);
      try {
        vlmResult = await analyzeWithVLM(base64Data.base64, mimetype);
        console.log(`✅ VLM analysis complete. Layout score: ${vlmResult.layoutScore}`);
      } catch (vlmErr) {
        console.warn(`⚠️ VLM analysis failed: ${vlmErr.message}. Continuing with LLM only.`);
      }
    }

    // Step 4: Run LLM analysis (content, skills, keywords)
    let llmResult = null;
    if (parsedFile.text && parsedFile.text.trim().length > 50) {
      console.log(`🧠 Running LLM (text) analysis...`);
      llmResult = await analyzeWithLLM(parsedFile.text, jobDescription);
      console.log(`✅ LLM analysis complete. ATS score: ${llmResult.atsTextScore}`);
    } else if (!parsedFile.isImage) {
      return res.status(422).json({
        error: "Could not extract meaningful text from the resume. Please ensure the file is not scanned/encrypted.",
      });
    }

    // Step 5: Merge results into unified response
    const finalScore = computeFinalScore(llmResult, vlmResult);

    const response = {
      meta: {
        filename: originalname,
        fileType: mimetype,
        fileSize: size,
        analyzedAt: new Date().toISOString(),
        analysisMode: vlmResult && llmResult ? "hybrid" : vlmResult ? "vlm-only" : "llm-only",
      },
      scores: {
        overall: finalScore,
        atsText: llmResult?.atsTextScore ?? null,
        layout: vlmResult?.layoutScore ?? null,
      },
      llmAnalysis: llmResult,
      vlmAnalysis: vlmResult,
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/resume/tailor
 * Tailor an already-analyzed resume for a specific job description.
 * Body: { resumeText: string, jobDescription: string }
 */
router.post("/tailor", express.json(), async (req, res, next) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        error: "Both resumeText and jobDescription are required",
      });
    }

    if (resumeText.length < 100) {
      return res.status(400).json({ error: "Resume text too short" });
    }

    console.log(`✍️ Tailoring resume for job description...`);
    const tailored = await tailorResume(resumeText, jobDescription);

    res.json({
      success: true,
      tailored,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Compute a blended final score from LLM + VLM results.
 */
function computeFinalScore(llm, vlm) {
  if (!llm && !vlm) return null;
  if (!vlm) return llm.overallScore;
  if (!llm) return vlm.layoutScore;

  // Weight: 60% content (LLM), 40% layout (VLM)
  return Math.round(llm.overallScore * 0.6 + vlm.layoutScore * 0.4);
}

module.exports = router;
