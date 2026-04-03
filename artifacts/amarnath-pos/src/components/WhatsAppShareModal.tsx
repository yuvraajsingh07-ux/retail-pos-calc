import { useState } from "react";
import { X, Send } from "lucide-react";
import type { BillItem } from "@/pages/POSApp";

interface WhatsAppShareModalProps {
  items: BillItem[];
  customerName: string;
  date: string;
  loadingCharge: number;
  rounded: number;
  customNames: Record<number, string>;
  setCustomNames: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  onClose: () => void;
}

export function WhatsAppShareModal({
  items,
  customerName,
  date,
  loadingCharge,
  rounded,
  customNames,
  setCustomNames,
  onClose,
}: WhatsAppShareModalProps) {

  const handleSend = () => {
    const formattedDate = new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    
    let text = `*🧾 Invoice:* ${customerName || "Cash"}\n*📅 Date:* ${formattedDate}\n〰️〰️〰️〰️〰️〰️〰️〰️\n\n`;
    items.forEach((item) => {
      const name = customNames[item.id] && customNames[item.id].trim() !== "" 
        ? customNames[item.id] 
        : "Item";
      text += `📦 ${name} X ${item.bags} Bags @ ₹${item.rate.toLocaleString("en-IN")} = ₹${item.amount.toLocaleString("en-IN")}\n`;
    });
    
    // Trim trailing newlines before appending Total/Loading
    text = text.trimEnd() + "\n\n〰️〰️〰️〰️〰️〰️〰️〰️\n";

    if (loadingCharge > 0) {
      text += `🚚 Loading: ₹${loadingCharge}\n`;
    }
    text += `*💰 Grand Total:* ₹${rounded.toLocaleString("en-IN")}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text.trim())}`, "_blank");
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
                value={customNames[item.id] || ""}
                onChange={(e) =>
                  setCustomNames((prev) => ({ ...prev, [item.id]: e.target.value }))
                }
                className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-green-500"
                placeholder="Enter custom item name"
              />
            </div>
          ))}
        </div>

        {/* Preview summary */}
        <div className="bg-slate-950 rounded-lg px-3 py-2 mb-4 border border-slate-700">
          <div className="text-[9px] text-slate-500 font-bold tracking-wider mb-2">PREVIEW</div>
          <div className="space-y-2">
            <div className="text-[10px] text-slate-300 font-mono pb-1 border-b border-slate-800">
              *🧾 Invoice:* {customerName || "Cash"}<br />
              *📅 Date:* {new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}<br/>
              〰️〰️〰️〰️〰️〰️〰️〰️
            </div>
            {items.map((item) => {
              const name = customNames[item.id] && customNames[item.id].trim() !== "" 
                ? customNames[item.id] 
                : "Item";
              return (
                <div key={item.id} className="text-[10px] text-slate-300 font-mono">
                  📦 {name} X {item.bags} Bags @ ₹{item.rate.toLocaleString("en-IN")} = ₹{item.amount.toLocaleString("en-IN")}
                </div>
              );
            })}
            <div className="text-[10px] font-mono border-t border-slate-700 mt-2 pt-2 space-y-1">
              <div className="text-slate-300">〰️〰️〰️〰️〰️〰️〰️〰️</div>
              {loadingCharge > 0 && (
                <div className="text-slate-400">🚚 Loading: ₹{loadingCharge}</div>
              )}
              <div className="font-bold text-white">
                *💰 Grand Total:* ₹{rounded.toLocaleString("en-IN")}
              </div>
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
