interface TotalsSummaryProps {
  subtotal: number;
  loadingCharge: number;
  grandTotal: number;
  rounded: number;
  roundOff: number;
  addLoading: boolean;
}

export function TotalsSummary({
  subtotal,
  loadingCharge,
  grandTotal,
  rounded,
  roundOff,
  addLoading,
}: TotalsSummaryProps) {
  const fmt = (n: number) => `₹${Math.abs(n).toLocaleString("en-IN")}`;

  return (
    <div className="bg-slate-900 border-t border-slate-700 px-3 py-1.5 shrink-0">
      <div className="flex flex-col gap-0.5">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Subtotal</span>
          <span className="text-slate-200">{fmt(subtotal)}</span>
        </div>
        {addLoading && (
          <div className="flex justify-between text-xs text-slate-400">
            <span>Loading (₹4/bag)</span>
            <span className="text-slate-200">{fmt(loadingCharge)}</span>
          </div>
        )}
        <div className="flex justify-between text-xs text-slate-400">
          <span>Round Off</span>
          <span className={roundOff >= 0 ? "text-green-400" : "text-red-400"}>
            {roundOff >= 0 ? "+" : "-"}{fmt(roundOff)}
          </span>
        </div>
        <div className="flex justify-between border-t border-slate-700 pt-1 mt-0.5">
          <span className="text-sm font-bold text-amber-400">FINAL BILL</span>
          <span className="text-sm font-bold text-white">{fmt(rounded)}</span>
        </div>
      </div>
    </div>
  );
}
