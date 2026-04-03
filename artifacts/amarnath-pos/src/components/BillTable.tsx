import { Trash2, GripVertical, Minus, Plus } from "lucide-react";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { BillItem } from "@/pages/POSApp";

interface BillTableProps {
  items: BillItem[];
  onDelete: (id: number) => void;
  onUpdateBags: (id: number, delta: number) => void;
  onUpdateRate: (id: number, rate: number) => void;
}

interface SortableRowProps {
  item: BillItem;
  idx: number;
  onDelete: (id: number) => void;
  onUpdateBags: (id: number, delta: number) => void;
  onUpdateRate: (id: number, rate: number) => void;
}

function SortableRow({ item, idx, onDelete, onUpdateBags, onUpdateRate }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 10 : "auto",
  };

  const totalWt = item.weightKg * item.bags;

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-t border-slate-800 ${idx % 2 === 0 ? "bg-slate-950" : "bg-slate-900/40"}`}
    >
      {/* Grip handle */}
      <td className="pl-1 pr-0 py-1 w-[6%]">
        <button
          {...attributes}
          {...listeners}
          className="touch-none cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 p-0.5 flex items-center justify-center"
          aria-label="Drag to reorder"
        >
          <GripVertical size={12} />
        </button>
      </td>
      {/* Item (weight label) */}
      <td className="px-1 py-1 w-[22%]">
        <div className="font-medium text-amber-300 text-[11px] leading-tight">{item.weightKg}KG Bag</div>
        <div className="text-[9px] text-slate-500 leading-tight">{totalWt} kg total</div>
      </td>
      {/* Bags — compact [-] count [+] control */}
      <td className="text-right px-0.5 py-1 w-[18%]">
        <div className="flex items-center justify-end gap-0.5">
          <button
            onClick={() => onUpdateBags(item.id, -1)}
            className="w-5 h-5 flex items-center justify-center rounded bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-slate-300 transition-colors"
            aria-label="Decrease bags"
          >
            <Minus size={9} />
          </button>
          <span className="text-slate-300 text-[11px] w-4 text-center select-none">{item.bags}</span>
          <button
            onClick={() => onUpdateBags(item.id, 1)}
            className="w-5 h-5 flex items-center justify-center rounded bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-slate-300 transition-colors"
            aria-label="Increase bags"
          >
            <Plus size={9} />
          </button>
        </div>
      </td>
      {/* Rate — inline editable input */}
      <td className="text-right px-1 py-1 w-[15%]">
        <div className="flex justify-end">
          <input
            type="number"
          value={item.rate === 0 ? "" : item.rate}
          onChange={(e) => {
            if (e.target.value === "") {
              onUpdateRate(item.id, 0);
              return;
            }
            const v = parseFloat(e.target.value);
            if (!isNaN(v) && v >= 0) onUpdateRate(item.id, v);
          }}
          className="w-16 bg-transparent border-none outline-none text-right text-slate-400 text-[11px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          inputMode="decimal"
        />
        </div>
      </td>
      <td className="text-right px-1 py-1 font-semibold text-white w-[29%]">
        ₹{item.amount.toLocaleString("en-IN")}
      </td>
      <td className="text-center py-1 w-[10%]">
        <button
          onClick={() => onDelete(item.id)}
          className="p-0.5 text-slate-600 hover:text-red-400 active:text-red-500 transition-colors"
        >
          <Trash2 size={11} />
        </button>
      </td>
    </tr>
  );
}

export function BillTable({ items, onDelete, onUpdateBags, onUpdateRate }: BillTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-1">
        <div className="text-2xl">📋</div>
        <div className="text-xs">No items yet</div>
      </div>
    );
  }

  const ids = items.map((i) => i.id);

  return (
    <table className="w-full text-xs table-fixed">
      <thead className="bg-slate-900 sticky top-0 z-10">
        <tr className="text-slate-500">
          <th className="w-[6%]"></th>
          <th className="text-left px-1 py-1 w-[22%]">Item</th>
          <th className="text-right px-1 py-1 w-[18%]">Bags</th>
          <th className="text-right px-1 py-1 w-[15%]">Rate</th>
          <th className="text-right px-1 py-1 w-[29%]">Amt</th>
          <th className="w-[10%]"></th>
        </tr>
      </thead>
      <tbody>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {items.map((item, idx) => (
            <SortableRow
              key={item.id}
              item={item}
              idx={idx}
              onDelete={onDelete}
              onUpdateBags={onUpdateBags}
              onUpdateRate={onUpdateRate}
            />
          ))}
        </SortableContext>
      </tbody>
    </table>
  );
}
