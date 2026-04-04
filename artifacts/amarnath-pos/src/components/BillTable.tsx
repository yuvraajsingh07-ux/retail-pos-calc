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
    <div
      ref={setNodeRef}
      style={style}
      className={`border-b border-slate-800/60 flex items-center px-1 py-3 gap-2 ${idx % 2 === 0 ? "bg-slate-950" : "bg-slate-900/40"}`}
    >
      {/* Grip */}
      <button {...attributes} {...listeners} className="text-slate-600 p-1 shrink-0 touch-none active:text-slate-400">
        <GripVertical size={16} />
      </button>

      {/* Weight info */}
      <div className="flex flex-col justify-center min-w-[55px] shrink-0">
        <div className="font-semibold text-slate-200 text-sm leading-tight">{totalWt} kg</div>
        <div className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5">{item.weightKg}KG Bag</div>
      </div>

      {/* Bags Control */}
      <div className="flex items-center justify-center gap-1.5 shrink-0 bg-slate-800/40 p-0.5 rounded border border-slate-700/50">
        <button onClick={() => onUpdateBags(item.id, -1)} className="w-6 h-6 flex items-center justify-center rounded bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-slate-300 transition-colors">
          <Minus size={12} />
        </button>
        <span className="text-slate-200 font-bold text-xs w-5 text-center">{item.bags}</span>
        <button onClick={() => onUpdateBags(item.id, 1)} className="w-6 h-6 flex items-center justify-center rounded bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-slate-300 transition-colors">
          <Plus size={12} />
        </button>
      </div>

      <div className="flex items-center flex-1 justify-end gap-3">
        {/* Rate Input */}
        <div className="flex flex-col items-end shrink-0">
          <div className="flex items-center gap-1 bg-slate-900 px-1 py-1 rounded border border-slate-700/50 shadow-inner">
            <span className="text-slate-500 text-[10px] font-medium pl-0.5">₹</span>
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
              className="w-[44px] bg-transparent border-none outline-none text-right font-semibold text-slate-200 text-sm p-0 m-0 leading-tight [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              inputMode="decimal"
              placeholder="0"
            />
          </div>
        </div>

        {/* Final Amount */}
        <div className="min-w-[70px] text-right shrink-0">
          <div className="text-lg font-bold text-white tracking-tight pr-1">₹{item.amount.toLocaleString("en-IN")}</div>
        </div>
      </div>

      {/* Delete */}
      <button onClick={() => onDelete(item.id)} className="p-1.5 text-slate-500 hover:text-red-400 shrink-0 border-l border-slate-800 ml-1 pl-2 transition-colors">
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export function BillTable({ items, onDelete, onUpdateBags, onUpdateRate }: BillTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-1 pb-10">
        <div className="text-3xl mb-1">📋</div>
        <div className="text-sm font-medium">Cart is empty</div>
      </div>
    );
  }

  const ids = items.map((i) => i.id);

  return (
    <div className="w-full flex flex-col pb-4">
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
    </div>
  );
}
