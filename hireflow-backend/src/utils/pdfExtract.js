// Uses Mozilla's pdfjs-dist directly rather than the `pdf-parse` wrapper —
// pdf-parse bundles an old, unmaintained pdf.js fork that fails on some
// perfectly valid PDFs (confirmed: throws "bad XRef entry" on files that
// qpdf and pdftotext both parse without complaint).
//
// pdfjs-dist's getTextContent() returns text items with no line breaks by
// default, which would break bullet-point detection downstream, so this
// reconstructs lines by grouping items whose y-position is close together.

async function extractPdfText(buffer) {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    disableFontFace: true,
    isEvalSupported: false,
  });
  const pdf = await loadingTask.promise;

  let fullText = "";
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    const lines = [];
    let currentLine = [];
    let lastY = null;

    for (const item of content.items) {
      if (!("str" in item)) continue;
      const y = item.transform[5];
      if (lastY !== null && Math.abs(y - lastY) > 2) {
        lines.push(currentLine.join(" "));
        currentLine = [];
      }
      currentLine.push(item.str);
      lastY = y;
    }
    if (currentLine.length) lines.push(currentLine.join(" "));

    fullText += lines.join("\n") + "\n";
  }

  return fullText;
}

module.exports = { extractPdfText };
