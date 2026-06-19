import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// ── A4 constants ─────────────────────────────────────────────────────────────
const A4_PX_W  = 794;   // A4 width  at 96 dpi
const A4_PX_H  = 1123;  // A4 height at 96 dpi
const A4_MM_W  = 210;
const A4_MM_H  = 297;

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Bake an <img>'s brightness/contrast (read from data-brightness /
 * data-contrast, set by ReportPreview.tsx) into its pixel data via canvas.
 * html2canvas does NOT reliably apply CSS `filter` during capture in every
 * environment (especially Electron/Chromium headless contexts), so we
 * re-render the image manually before capture to guarantee the filter
 * shows up in the exported PDF/PNG/print output.
 */
const applyFiltersToImage = async (img: HTMLImageElement): Promise<void> => {
  const brightness = Number(img.dataset.brightness ?? 100);
  const contrast = Number(img.dataset.contrast ?? 100);

  // skip if no adjustment was made — avoids unnecessary re-encoding
  if (brightness === 100 && contrast === 100) return;

  try {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = img.src;

    await new Promise((res) => {
      image.onload = res;
      image.onerror = res;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;

    ctx.filter = `brightness(${brightness / 100}) contrast(${contrast / 100})`;
    ctx.drawImage(image, 0, 0);

    img.src = canvas.toDataURL("image/jpeg", 0.95);
  } catch {
    // Never block the export over a single failed image
  }
};

const formatFileName = (
  patientName: string,
  category: string,
  reportDate: string,
  ageGender: string
) => {
  const safe = (str: string) =>
    str
      .toLowerCase()
      .replace(/\s+/g, "-")       // spaces → dash
      .replace(/[^a-z0-9-]/g, ""); // remove special chars

  const safeDate = reportDate
    ? reportDate.replace(/[^0-9-]/g, "")
    : new Date().toISOString().split("T")[0];

  return `${safe(patientName)}-${safe(category)}-${safeDate}-${safe(ageGender)}`;
};

/** Wait for every <img> to finish loading. */
const waitForImages = (element: HTMLElement): Promise<void> =>
  Promise.all(
    Array.from(element.querySelectorAll<HTMLImageElement>("img")).map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise<void>((res) => {
        img.addEventListener("load",  () => res(), { once: true });
        img.addEventListener("error", () => res(), { once: true });
      });
    })
  ).then(() => undefined);

/**
 * Convert every blob:/http: src inside `element` to inline base64, then bake
 * in any brightness/contrast adjustment via applyFiltersToImage.
 *
 * IMPORTANT: this mutates the `<img>` elements it's given in place. Callers
 * MUST pass a cloned element (never the live on-screen DOM node), otherwise
 * the visible preview gets permanently overwritten with a re-encoded,
 * lower-fidelity JPEG every time a PDF/print/export runs.
 */
const inlineBlobImages = async (element: HTMLElement): Promise<void> => {
  const imgs = Array.from(element.querySelectorAll<HTMLImageElement>("img"));

  await Promise.all(
    imgs.map(async (img) => {
      let src = img.getAttribute("src") || "";

      // STEP 1: Convert blob/http → base64 (ONLY ONCE)
      if (src.startsWith("blob:") || src.startsWith("http")) {
        try {
          const resp = await fetch(src);
          const blob = await resp.blob();

          const b64 = await new Promise<string>((res, rej) => {
            const reader = new FileReader();
            reader.onload = () => res(reader.result as string);
            reader.onerror = rej;
            reader.readAsDataURL(blob);
          });

          img.src = b64;
          src = b64; // update src
        } catch {
          // keep original src if fetch/convert fails
        }
      }

      // STEP 2: Bake brightness/contrast into the (now base64) image data
      await applyFiltersToImage(img);
    })
  );
};

/** Sanitise a date string for use in a filename. */
const safeDate = (d: string) =>
  (d || new Date().toISOString().split("T")[0]).replace(/[^0-9-]/g, "");

/**
 * Capture #report-content as a canvas.
 * Forces exactly A4_PX_W × A4_PX_H pixels so the PDF is always one page.
 * Retries at lower scale if the browser runs out of memory.
 *
 * Operates on a detached CLONE of #report-content so that baking filters /
 * inlining blob URLs never mutates the live, on-screen preview.
 */
const captureReport = async (scale = 3): Promise<HTMLCanvasElement> => {
  const source = document.getElementById("report-content");
  if (!source) throw new Error("Element #report-content not found in DOM.");

  // Work on a clone — keeps the visible preview untouched and pristine.
  const clone = source.cloneNode(true) as HTMLElement;
  clone.style.position = "fixed";
  clone.style.top = "-99999px";
  clone.style.left = "-99999px";
  clone.style.pointerEvents = "none";
  document.body.appendChild(clone);

  try {
    // 1. Inline blob / external URLs + bake brightness/contrast filters
    await inlineBlobImages(clone);
    // 2. Wait for all images (including the newly inlined ones) to render
    await waitForImages(clone);
    // 3. Short settle so the browser repaints after src changes
    await new Promise((r) => setTimeout(r, 350));

    try {
      return await html2canvas(clone, {
        useCORS: true,
        allowTaint: false,
        scale,
        backgroundColor: "#ffffff",
        logging: false,
        // Force exactly A4 dimensions — prevents the footer from ever being on page 2
        width:        A4_PX_W,
        height:       A4_PX_H,
        windowWidth:  A4_PX_W,
        windowHeight: A4_PX_H,
        imageTimeout: 15000,
      });
    } catch (err) {
      if (scale > 1) {
        console.warn(`html2canvas OOM at scale ${scale}, retrying at ${scale - 1}…`);
        // Retry with a fresh clone at lower scale
        document.body.removeChild(clone);
        return captureReport(scale - 1);
      }
      throw err;
    }
  } finally {
    if (clone.parentNode) document.body.removeChild(clone);
  }
};

// ── PDF ────────────────────────────────────────────────────────────────────────
export const generatePDF = async (reportDate: string, patientName: string, patientAge: string, reportType: string): Promise<void> => {
  const canvas = await captureReport(3);

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // canvas is always exactly A4_PX_W × A4_PX_H → maps to one A4 page, no stretching
  pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, A4_MM_W, A4_MM_H);

  pdf.save(
  `${formatFileName(patientName, reportType, reportDate, patientAge)}.pdf`
);
};

// ── Print ──────────────────────────────────────────────────────────────────────
export const printReport = async (): Promise<void> => {
  const element = document.getElementById("report-content");
  if (!element) throw new Error("Element #report-content not found.");

  const cloned = element.cloneNode(true) as HTMLElement;
  await inlineBlobImages(cloned);
  await waitForImages(cloned);
  await new Promise((r) => setTimeout(r, 200));

  const pw = window.open("", "", "width=900,height=700");
  if (!pw) throw new Error("Popup blocked — please allow popups for this page.");

  pw.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Endoscopy Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; background: white; }
    @page  { size: A4; margin: 0; }
    @media print { body { margin: 0; } img { max-width: 100%; } }
  </style>
</head>
<body>
${cloned.outerHTML}
<script>
  window.onload = function () {
    setTimeout(function () {
      window.print();
      setTimeout(function () { window.close(); }, 1000);
    }, 500);
  };
<\/script>
</body>
</html>`);
  pw.document.close();
};

// ── PNG export ─────────────────────────────────────────────────────────────────
export const exportAsImage = async (reportDate: string, patientName: string, patientAge: string, reportType: string): Promise<void> => {
  const canvas = await captureReport(3);

  const link    = document.createElement("a");
  link.href     = canvas.toDataURL("image/png");
  link.download =
  `${formatFileName(patientName, reportType, reportDate, patientAge)}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};