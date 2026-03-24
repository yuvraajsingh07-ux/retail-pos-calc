import { Trash2, GripVertical } from "lucide-react";
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
}

interface SortableRowProps {
  item: BillItem;
  idx: number;
  onDelete: (id: number) => void;
}

function SortableRow({ item, idx, onDelete }: SortableRowProps) {
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

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-t border-slate-800 ${idx % 2 === 0 ? "bg-slate-950" : "bg-slate-900/40"}`}
    >
      {/* Grip handle */}
      <td className="pl-1 pr-0 py-1 w-[8%]">
        <button
          {...attributes}
          {...listeners}
          className="touch-none cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 p-0.5 flex items-center justify-center"
          aria-label="Drag to reorder"
        >
          <GripVertical size={12} />
        </button>
      </td>
      <td className="px-1 py-1 font-medium text-amber-300 truncate w-[26%]">{item.weightKg}KG Bag</td>
      <td className="text-right px-1 py-1 text-slate-300 w-[14%]">{item.bags}</td>
      <td className="text-right px-1 py-1 text-slate-400 w-[17%]">{item.rate.toFixed(0)}</td>
      <td className="text-right px-1 py-1 font-semibold text-white w-[25%]">
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

export function BillTable({ items, onDelete }: BillTableProps) {
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
          <th className="w-[8%]"></th>
          <th className="text-left px-1 py-1 w-[26%]">Item</th>
          <th className="text-right px-1 py-1 w-[14%]">Bags</th>
          <th className="text-right px-1 py-1 w-[17%]">Rate</th>
          <th className="text-right px-1 py-1 w-[25%]">Amt</th>
          <th className="w-[10%]"></th>
        </tr>
      </thead>
      <tbody>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {items.map((item, idx) => (
            <SortableRow key={item.id} item={item} idx={idx} onDelete={onDelete} />
          ))}
        </SortableContext>
      </tbody>
    </table>
  );
}
