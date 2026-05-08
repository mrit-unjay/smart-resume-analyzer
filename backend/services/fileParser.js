const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

/**
 * Extracts raw text from uploaded resume file.
 * For images → returns null (VLM handles directly).
 * For PDF/DOCX → returns extracted text string.
 */
async function extractText(fileBuffer, mimetype) {
  try {
    if (mimetype === "application/pdf") {
      const data = await pdfParse(fileBuffer);
      return {
        text: data.text,
        pageCount: data.numpages,
        isImage: false,
      };
    }

    if (
      mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return {
        text: result.value,
        pageCount: null,
        isImage: false,
      };
    }

    // Image types — no text extraction, use VLM directly
    if (["image/jpeg", "image/png", "image/webp"].includes(mimetype)) {
      return {
        text: null,
        pageCount: null,
        isImage: true,
      };
    }

    throw new Error("Unsupported file type for text extraction");
  } catch (err) {
    throw new Error(`Text extraction failed: ${err.message}`);
  }
}

/**
 * Converts file buffer to base64 for VLM vision API calls.
 */
function bufferToBase64(buffer, mimetype) {
  return {
    base64: buffer.toString("base64"),
    mediaType: mimetype,
  };
}

module.exports = { extractText, bufferToBase64 };
