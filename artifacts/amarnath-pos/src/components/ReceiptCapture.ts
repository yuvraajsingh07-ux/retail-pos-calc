import html2canvas from "html2canvas";
import type { RefObject } from "react";
import type { Settings } from "@/pages/POSApp";

export async function ReceiptCapture(
  receiptRef: RefObject<HTMLDivElement | null>,
  settings: Settings
): Promise<void> {
  if (!receiptRef.current) return;

  const el = receiptRef.current;

  const inject = document.createElement("div");
  inject.style.cssText = `
    background: #0f172a;
    color: white;
    padding: 8px 12px 4px 12px;
    font-size: 12px;
    font-family: 'Inter', sans-serif;
    border-bottom: 1px solid #334155;
  `;

  const name = settings.customerName || "—";
  const date = settings.date
    ? new Date(settings.date + "T00:00:00").toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  inject.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div>
        <div style="font-weight:700; font-size:14px; color:#fbbf24;">AMARNATH MASTER</div>
        <div style="color:#94a3b8; font-size:10px;">Wholesale Grain Bill</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:11px; color:#e2e8f0;">${name}</div>
        <div style="font-size:10px; color:#94a3b8;">${date}</div>
      </div>
    </div>
  `;

  el.insertBefore(inject, el.firstChild);

  try {
    const canvas = await html2canvas(el, {
      backgroundColor: "#0f172a",
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const link = document.createElement("a");
    link.download = `receipt-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } finally {
    el.removeChild(inject);
  }
}
