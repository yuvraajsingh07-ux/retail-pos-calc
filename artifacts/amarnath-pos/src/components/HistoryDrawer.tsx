import { useEffect, useState } from "react";
import { X, Clock, Loader2, Inbox } from "lucide-react";
import { fetchBills, type SavedBill } from "@/lib/billsApi";
import type { BillItem } from "@/pages/POSApp";

interface HistoryDrawerProps {
  onClose: () => void;
  onLoad: (bill: { id: string; customerName: string; date: string; items: BillItem[]; cash_amount: number; online_amount: number; udhar_amount: number }) => void;
}

export function HistoryDrawer({ onClose, onLoad }: HistoryDrawerProps) {
  const [bills, setBills] = useState<SavedBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchBills()
      .then((data) => {
        if (!cancelled) {
          setBills(data);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const formatAmount = (n: number) =>
    `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 0 })}`;

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-slate-950">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-amber-400" />
          <span className="text-sm font-bold text-white">Bill History</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {loading && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-500">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-xs">Loading bills...</span>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center h-full gap-2 px-6 text-center">
            <span className="text-2xl">⚠️</span>
            <span className="text-xs text-red-400 font-medium">Failed to load bills</span>
            <span className="text-[10px] text-slate-500">{error}</span>
          </div>
        )}

        {!loading && !error && bills.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-600">
            <Inbox size={32} />
            <span className="text-xs">No saved bills yet</span>
          </div>
        )}

        {!loading && !error && bills.length > 0 && (
          <ul className="divide-y divide-slate-800">
            {bills.map((bill, idx) => (
              <li key={bill.id}>
                <button
                  onClick={() =>
                    onLoad({
                      id: bill.id,
                      customerName: bill.customer_name,
                      date: bill.bill_date.slice(0, 10),
                      items: bill.items,
                      cash_amount: bill.cash_amount,
                      online_amount: bill.online_amount,
                      udhar_amount: bill.udhar_amount,
                    })
                  }
                  className={`w-full text-left px-3 py-3 flex items-center justify-between gap-2 active:bg-slate-800 transition-colors ${
                    idx % 2 === 0 ? "bg-slate-950" : "bg-slate-900/40"
                  }`}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-semibold text-white truncate">
                      {bill.customer_name || "Cash"}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-500">
                        {formatDate(bill.bill_date)}
                      </span>
                      <span className="text-[10px] text-slate-600">·</span>
                      <span className="text-[10px] text-slate-500">
                        {bill.total_bags} bags
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-amber-400 shrink-0">
                    {formatAmount(bill.total_amount)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer hint */}
      <div className="shrink-0 px-3 py-2 bg-slate-900 border-t border-slate-800">
        <p className="text-[10px] text-slate-600 text-center">
          Tap any bill to load it into the calculator for editing
        </p>
      </div>
    </div>
  );
}
