import { useState, useRef, useCallback } from "react";
import {
  Settings,
  Delete,
  Plus,
  MessageCircle,
  Download,
  X,
} from "lucide-react";
import { SettingsModal } from "@/components/SettingsModal";
import { BillTable } from "@/components/BillTable";
import { TotalsSummary } from "@/components/TotalsSummary";

export type BillItem = {
  id: number;
  weightKg: number;
  bags: number;
  rate: number;
  amount: number;
};

export type Settings = {
  customerName: string;
  date: string;
  addLoading: boolean;
};



function vibrate() {
  if (window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(50);
  }
}

export function POSApp() {
  const [items, setItems] = useState<BillItem[]>([]);
  const [display, setDisplay] = useState("0");
  const [inputPhase, setInputPhase] = useState<"weight" | "bags" | "rate">("weight");
  const [weightBuffer, setWeightBuffer] = useState<string>("");
  const [bagsBuffer, setBagsBuffer] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    customerName: "",
    date: new Date().toISOString().slice(0, 10),
    addLoading: false,
  });


  const totalBags = items.reduce((s, i) => s + i.bags, 0);
  const heavyBags = items.filter((i) => i.weightKg !== 20).reduce((s, i) => s + i.bags, 0);
  const lightBags = items.filter((i) => i.weightKg === 20).reduce((s, i) => s + i.bags, 0);
  const totalKg = items.reduce((s, i) => s + i.weightKg * i.bags, 0);
  const totalQuintals = totalKg / 100;
  const subtotal = items.reduce((s, i) => s + i.amount, 0);
  const loadingCharge = settings.addLoading ? totalBags * 4 : 0;
  const grandTotal = subtotal + loadingCharge;
  const rounded = Math.ceil(grandTotal / 10) * 10;
  const roundOff = rounded - grandTotal;

  const handleWhatsApp = useCallback(() => {
    vibrate();
    let text = `*AMARNATH PRADEEP KUMAR GARG*\n`;
    text += `Customer: ${settings.customerName || "Cash"} | Date: ${settings.date}\n`;
    text += `-----------------------------\n`;
    items.forEach((item) => {
      text += `${item.weightKg}KG x ${item.bags} = ₹${item.amount}\n`;
    });
    text += `-----------------------------\n`;
    text += `Total Bags: ${totalBags} | Weight: ${totalQuintals.toFixed(2)} qtl\n`;
    text += `H: ${heavyBags} | L: ${lightBags}\n`;
    text += `Loading: ₹${loadingCharge}\n`;
    if (roundOff !== 0) text += `Round Off: ${roundOff > 0 ? "+" : ""}${roundOff}\n`;
    text += `*FINAL BILL: ₹${rounded}*`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }, [items, settings, totalBags, totalQuintals, loadingCharge, roundOff, rounded, heavyBags, lightBags]);

  const handleSaveImage = useCallback(() => {
    vibrate();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lineHeights = 20;
    const padding = 20;
    
    canvas.width = 400;
    canvas.height = padding * 2 + (4 + items.length + 5) * lineHeights + 20;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#000000";
    ctx.font = "bold 16px 'Courier New', Courier, monospace";
    ctx.textAlign = "center";
    
    let y = padding + 16;
    ctx.fillText("AMARNATH PRADEEP KUMAR GARG", canvas.width / 2, y);
    
    ctx.font = "14px 'Courier New', Courier, monospace";
    y += lineHeights;
    ctx.fillText(`Customer: ${settings.customerName || "Cash"} | Date: ${settings.date}`, canvas.width / 2, y);

    y += lineHeights;
    ctx.fillText("--------------------------------------", canvas.width / 2, y);

    ctx.textAlign = "left";
    y += lineHeights;
    items.forEach((item) => {
      const textL = `${item.weightKg}KG x ${item.bags}`;
      const textR = `₹${item.amount}`;
      ctx.fillText(textL, padding, y);
      ctx.textAlign = "right";
      ctx.fillText(textR, canvas.width - padding, y);
      ctx.textAlign = "left";
      y += lineHeights;
    });

    ctx.textAlign = "center";
    ctx.fillText("--------------------------------------", canvas.width / 2, y);
    y += lineHeights;
    
    ctx.textAlign = "left";
    ctx.fillText(`Total Bags: ${totalBags} | Weight: ${totalQuintals.toFixed(2)} qtl`, padding, y);
    y += lineHeights;
    
    ctx.fillText(`H: ${heavyBags} | L: ${lightBags}`, padding, y);
    y += lineHeights;

    ctx.fillText(`Loading:`, padding, y);
    ctx.textAlign = "right";
    ctx.fillText(`₹${loadingCharge}`, canvas.width - padding, y);
    ctx.textAlign = "left";
    y += lineHeights;

    if (roundOff !== 0) {
      ctx.fillText(`Round Off:`, padding, y);
      ctx.textAlign = "right";
      ctx.fillText(`${roundOff > 0 ? "+" : ""}${roundOff}`, canvas.width - padding, y);
      ctx.textAlign = "left";
      y += lineHeights;
    }

    ctx.font = "bold 16px 'Courier New', Courier, monospace";
    ctx.fillText(`FINAL BILL:`, padding, y);
    ctx.textAlign = "right";
    ctx.fillText(`₹${rounded}`, canvas.width - padding, y);
    ctx.textAlign = "left";

    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    const sanitizedName = (settings.customerName || "Cash_Sale").replace(/\s+/g, '_');
    a.download = `${settings.date}_${sanitizedName}.png`;
    a.click();
  }, [items, settings, totalBags, totalQuintals, loadingCharge, roundOff, rounded, heavyBags, lightBags]);

  const appendDigit = useCallback(
    (digit: string) => {
      vibrate();
      setDisplay((prev) => {
        if (prev === "0" && digit !== ".") return digit;
        if (digit === "." && prev.includes(".")) return prev;
        if (prev.length >= 10) return prev;
        return prev + digit;
      });
    },
    []
  );

  const handleBackspace = useCallback(() => {
    vibrate();
    setDisplay((prev) => {
      if (prev.length <= 1) return "0";
      return prev.slice(0, -1);
    });
  }, []);

  const handleClear = useCallback(() => {
    vibrate();
    setDisplay("0");
    setWeightBuffer("");
    setBagsBuffer("");
    setInputPhase("weight");
  }, []);

  const handleX = useCallback(() => {
    vibrate();
    if (inputPhase === "weight" && display !== "0") {
      setWeightBuffer(display);
      setDisplay("0");
      setInputPhase("bags");
    } else if (inputPhase === "bags" && display !== "0") {
      setBagsBuffer(display);
      setDisplay("0");
      setInputPhase("rate");
    }
  }, [display, inputPhase]);

  const handleMPlus = useCallback(() => {
    vibrate();
    if (inputPhase === "rate" && weightBuffer && bagsBuffer && display !== "0") {
      const weightKg = parseFloat(weightBuffer);
      const bags = parseFloat(bagsBuffer);
      const rate = parseFloat(display);
      if (isNaN(weightKg) || isNaN(bags) || isNaN(rate) || weightKg <= 0 || bags <= 0 || rate <= 0) return;
      const amount = bags * rate;
      setItems((prev) => [
        ...prev,
        {
          id: Date.now(),
          weightKg,
          bags,
          rate,
          amount,
        },
      ]);
      setDisplay("0");
      setWeightBuffer("");
      setBagsBuffer("");
      setInputPhase("weight");
    }
  }, [inputPhase, weightBuffer, bagsBuffer, display]);

  const deleteItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const getDisplayLabel = () => {
    if (inputPhase === "weight") return "Enter weight";
    if (inputPhase === "bags") return `${weightBuffer}KG — bags?`;
    return `${bagsBuffer} bags @ rate?`;
  };

  return (
    <div className="fixed inset-0 mx-auto w-full max-w-md h-[100dvh] flex flex-col overflow-hidden bg-slate-950 text-white">
      {/* TOP HALF */}
      <div className="flex flex-col min-h-0 flex-1 bg-slate-950">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 shrink-0">
          <div>
            <div className="text-xs font-bold text-amber-400 leading-tight">AMARNATH MASTER</div>
            <div className="text-[10px] text-slate-400 leading-tight">Wholesale POS</div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 bg-slate-800 px-1.5 py-1 rounded border border-slate-700">
              <span className="text-[9px] font-medium text-slate-300">LOAD</span>
              <button
                onClick={() => { vibrate(); setSettings(p => ({ ...p, addLoading: !p.addLoading })); }}
                className={`relative w-6 h-3 rounded-full transition-colors ${
                  settings.addLoading ? "bg-amber-500" : "bg-slate-600"
                }`}
              >
                <span
                  className={`absolute top-[1px] left-[1px] w-2.5 h-2.5 bg-white rounded-full shadow transition-transform ${
                    settings.addLoading ? "translate-x-3" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-1 bg-green-700 hover:bg-green-600 active:bg-green-500 text-[11px] px-2 py-1 rounded text-white keypad-btn font-medium transition-colors"
            >
              <MessageCircle size={12} />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handleSaveImage}
              className="flex items-center gap-1 bg-blue-700 hover:bg-blue-600 active:bg-blue-500 text-[11px] px-2 py-1 rounded text-white keypad-btn font-medium transition-colors"
            >
              <Download size={12} />
              <span>Image</span>
            </button>
            <button
              onClick={() => { vibrate(); setShowSettings(true); }}
              className="bg-slate-700 hover:bg-slate-600 p-1 rounded keypad-btn"
            >
              <Settings size={14} className="text-slate-300" />
            </button>
          </div>
        </div>

        {/* Header Stats */}
        <div className="flex gap-0 bg-slate-900 border-b border-slate-800 shrink-0">
          <div className="flex-1 px-2 py-1 text-center border-r border-slate-800">
            <div className="text-[10px] text-slate-500">BAGS</div>
            <div className="text-sm font-bold text-white">{totalBags}</div>
          </div>
          <div className="flex-1 px-2 py-1 text-center border-r border-slate-800">
            <div className="text-[10px] text-slate-500">HEAVY</div>
            <div className="text-sm font-bold text-orange-400">{heavyBags}</div>
          </div>
          <div className="flex-1 px-2 py-1 text-center border-r border-slate-800">
            <div className="text-[10px] text-slate-500">LIGHT</div>
            <div className="text-sm font-bold text-blue-400">{lightBags}</div>
          </div>
          <div className="flex-1 px-2 py-1 text-center">
            <div className="text-[10px] text-slate-500">QTL</div>
            <div className="text-sm font-bold text-green-400">{totalQuintals.toFixed(2)}</div>
          </div>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <BillTable items={items} onDelete={deleteItem} />
        </div>

        {/* Totals */}
        <TotalsSummary
          subtotal={subtotal}
          loadingCharge={loadingCharge}
          grandTotal={grandTotal}
          rounded={rounded}
          roundOff={roundOff}
          addLoading={settings.addLoading}
        />
      </div>

      {/* BOTTOM HALF — Fixed Input */}
      <div className="shrink-0 bg-slate-900 border-t border-slate-800">

        {/* Casio Display */}
        <div className="mx-2 mb-1.5 px-3 py-1.5 casio-display rounded flex items-center justify-between">
          <span className="text-[10px] text-green-700 truncate max-w-[40%]">{getDisplayLabel()}</span>
          <span className="text-lg font-bold text-right">{display}</span>
        </div>

        {/* Keypad */}
        <div className="px-2 pb-2 grid grid-cols-4 gap-1.5">
          {/* Row 1 */}
          {["7", "8", "9"].map((d) => (
            <button
              key={d}
              onClick={() => appendDigit(d)}
              className="h-11 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 rounded text-sm font-semibold keypad-btn"
            >
              {d}
            </button>
          ))}
          <button
            onClick={handleBackspace}
            className="h-11 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 rounded flex items-center justify-center keypad-btn"
          >
            <Delete size={16} className="text-red-400" />
          </button>

          {/* Row 2 */}
          {["4", "5", "6"].map((d) => (
            <button
              key={d}
              onClick={() => appendDigit(d)}
              className="h-11 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 rounded text-sm font-semibold keypad-btn"
            >
              {d}
            </button>
          ))}
          <button
            onClick={handleX}
            className="h-11 bg-slate-600 hover:bg-slate-500 active:bg-slate-400 rounded text-sm font-bold text-yellow-300 keypad-btn"
          >
            X
          </button>

          {/* Row 3 */}
          {["1", "2", "3"].map((d) => (
            <button
              key={d}
              onClick={() => appendDigit(d)}
              className="h-11 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 rounded text-sm font-semibold keypad-btn"
            >
              {d}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="h-11 bg-slate-600 hover:bg-slate-500 active:bg-slate-400 rounded text-xs font-bold text-orange-300 keypad-btn"
          >
            CLR
          </button>

          {/* Row 4 */}
          <button
            onClick={() => appendDigit("0")}
            className="h-11 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 rounded text-sm font-semibold keypad-btn"
          >
            0
          </button>
          <button
            onClick={() => appendDigit("00")}
            className="h-11 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 rounded text-sm font-semibold keypad-btn"
          >
            00
          </button>
          <button
            onClick={() => appendDigit(".")}
            className="h-11 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 rounded text-sm font-semibold keypad-btn"
          >
            .
          </button>
          <button
            onClick={handleMPlus}
            className="h-11 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-400 rounded font-bold text-sm keypad-btn flex items-center justify-center gap-1"
          >
            <Plus size={14} />
            M+
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={(s) => { setSettings(s); setShowSettings(false); }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
