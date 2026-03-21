import { Trash2 } from "lucide-react";
import type { BillItem } from "@/pages/POSApp";

interface BillTableProps {
  items: BillItem[];
  onDelete: (id: number) => void;
}

export function BillTable({ items, onDelete }: BillTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-1">
        <div className="text-2xl">📋</div>
        <div className="text-xs">No items yet</div>
      </div>
    );
  }

  return (
    <table className="w-full text-xs table-fixed">
      <thead className="bg-slate-900 sticky top-0">
        <tr className="text-slate-500">
          <th className="text-left px-2 py-1 w-[28%]">Item</th>
          <th className="text-right px-1 py-1 w-[15%]">Bags</th>
          <th className="text-right px-1 py-1 w-[18%]">Rate</th>
          <th className="text-right px-1 py-1 w-[28%]">Amt</th>
          <th className="w-[11%]"></th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, idx) => (
          <tr
            key={item.id}
            className={`border-t border-slate-800 ${idx % 2 === 0 ? "bg-slate-950" : "bg-slate-900/40"}`}
          >
            <td className="px-2 py-1 font-medium text-amber-300 truncate">{item.weightKg}KG Bag</td>
            <td className="text-right px-1 py-1 text-slate-300">{item.bags}</td>
            <td className="text-right px-1 py-1 text-slate-400">{item.rate.toFixed(0)}</td>
            <td className="text-right px-1 py-1 font-semibold text-white">
              ₹{item.amount.toLocaleString("en-IN")}
            </td>
            <td className="text-center py-1">
              <button
                onClick={() => onDelete(item.id)}
                className="p-0.5 text-slate-600 hover:text-red-400 active:text-red-500 transition-colors"
              >
                <Trash2 size={11} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
