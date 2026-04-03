import { useState } from "react";
import { X, Send } from "lucide-react";
import type { BillItem } from "@/pages/POSApp";

interface WhatsAppShareModalProps {
  items: BillItem[];
  customerName: string;
  date: string;
  loadingCharge: number;
  rounded: number;
  onClose: () => void;
}

export function WhatsAppShareModal({
  items,
  customerName,
  date,
  loadingCharge,
  rounded,
  onClose,
}: WhatsAppShareModalProps) {
  const [customNames, setCustomNames] = useState<Record<number, string>>(() =>
    Object.fromEntries(items.map((item) => [item.id, `${item.weightKg}KG Bag`]))
  );

  const handleSend = () => {
    let text = `*AMARNATH PRADEEP KUMAR GARG*\n`;
    text += `Customer: ${customerName || "Cash"} | Date: ${date}\n`;
    text += `-----------------------------\n`;
    items.forEach((item) => {
      const name = customNames[item.id] || `${item.weightKg}KG Bag`;
      text += `${name} x ${item.bags} | ₹${item.amount.toLocaleString("en-IN")} |\n`;
    });
    text += `-----------------------------\n`;
    if (loadingCharge > 0) {
      text += `Loading: ₹${loadingCharge}\n`;
    }
    text += `*Total: ₹${rounded.toLocaleString("en-IN")}*`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-t-2xl w-full max-w-md p-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-white">Configure Share</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Customize item names for this receipt</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1"
          >
            <X size={16} />
          </button>
        </div>

        {/* Item list */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-0.5 mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2 bg-slate-900 rounded-lg px-3 py-2">
              <div className="shrink-0 text-right w-16">
                <div className="text-[10px] text-slate-500">x{item.bags}</div>
                <div className="text-[10px] text-amber-400 font-semibold">
                  ₹{item.amount.toLocaleString("en-IN")}
                </div>
              </div>
              <input
                type="text"
                value={customNames[item.id] ?? `${item.weightKg}KG Bag`}
                onChange={(e) =>
                  setCustomNames((prev) => ({ ...prev, [item.id]: e.target.value }))
                }
                className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-green-500"
                placeholder={`${item.weightKg}KG Bag`}
              />
            </div>
          ))}
        </div>

        {/* Preview summary */}
        <div className="bg-slate-950 rounded-lg px-3 py-2 mb-4 border border-slate-700">
          <div className="text-[9px] text-slate-500 font-bold tracking-wider mb-1.5">PREVIEW</div>
          <div className="space-y-0.5">
            {items.map((item) => (
              <div key={item.id} className="text-[10px] text-slate-300 font-mono">
                {customNames[item.id] || `${item.weightKg}KG Bag`} x {item.bags} | ₹{item.amount.toLocaleString("en-IN")} |
              </div>
            ))}
            {loadingCharge > 0 && (
              <div className="text-[10px] text-slate-400 font-mono">Loading: ₹{loadingCharge}</div>
            )}
            <div className="text-[10px] font-bold text-white font-mono border-t border-slate-700 mt-1 pt-1">
              Total: ₹{rounded.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          className="w-full py-3 bg-green-600 hover:bg-green-500 active:bg-green-400 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <Send size={15} />
          Send to WhatsApp
        </button>
      </div>
    </div>
  );
}
