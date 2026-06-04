import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// ── A4 constants ─────────────────────────────────────────────────────────────
const A4_PX_W  = 794;   // A4 width  at 96 dpi
const A4_PX_H  = 1123;  // A4 height at 96 dpi
const A4_MM_W  = 210;
const A4_MM_H  = 297;

// ── Helpers ───────────────────────────────────────────────────────────────────

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
 * Convert every blob: or http: src inside `element` to inline base64.
 * html2canvas cannot fetch cross-origin or blob URLs — inlining fixes PDF failures.
 */
const inlineBlobImages = async (element: HTMLElement): Promise<void> => {
  const imgs = Array.from(element.querySelectorAll<HTMLImageElement>("img"));
  await Promise.all(
    imgs.map(async (img) => {
      const src = img.getAttribute("src") || "";
      // Only process blob URLs and external http URLs — skip /images/* local paths
      if (!src.startsWith("blob:") && !src.startsWith("http")) return;
      try {
        const resp = await fetch(src);
        const blob = await resp.blob();
        const b64  = await new Promise<string>((res, rej) => {
          const reader = new FileReader();
          reader.onload  = () => res(reader.result as string);
          reader.onerror = rej;
          reader.readAsDataURL(blob);
        });
        img.src = b64;
      } catch {
        // Never block the export over a single failed image
      }
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
 */
const captureReport = async (scale = 3): Promise<HTMLCanvasElement> => {
  const element = document.getElementById("report-content");
  if (!element) throw new Error("Element #report-content not found in DOM.");

  // 1. Inline blob / external URLs so html2canvas can read them
  await inlineBlobImages(element);
  // 2. Wait for all images (including the newly inlined ones) to render
  await waitForImages(element);
  // 3. Short settle so the browser repaints after src changes
  await new Promise((r) => setTimeout(r, 350));

  try {
    return await html2canvas(element, {
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
      return captureReport(scale - 1);
    }
    throw err;
  }
};

// ── PDF ────────────────────────────────────────────────────────────────────────
export const generatePDF = async (reportDate: string): Promise<void> => {
  const canvas = await captureReport(3);

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // canvas is always exactly A4_PX_W × A4_PX_H → maps to one A4 page, no stretching
  pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, A4_MM_W, A4_MM_H);

  pdf.save(`Endoscopy-Report-${safeDate(reportDate)}.pdf`);
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
export const exportAsImage = async (reportDate: string): Promise<void> => {
  const canvas = await captureReport(3);

  const link    = document.createElement("a");
  link.href     = canvas.toDataURL("image/png");
  link.download = `Endoscopy-Report-${safeDate(reportDate)}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};