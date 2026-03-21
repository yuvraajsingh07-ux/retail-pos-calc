import { useState } from "react";
import { X } from "lucide-react";
import type { Settings } from "@/pages/POSApp";

interface SettingsModalProps {
  settings: Settings;
  onSave: (s: Settings) => void;
  onClose: () => void;
}

export function SettingsModal({ settings, onSave, onClose }: SettingsModalProps) {
  const [local, setLocal] = useState<Settings>({ ...settings });

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-80 p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-0.5"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3">
          {/* Customer Name */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Customer Name</label>
            <input
              type="text"
              value={local.customerName}
              onChange={(e) => setLocal((p) => ({ ...p, customerName: e.target.value }))}
              placeholder="Enter customer name"
              className="w-full bg-slate-900 border border-slate-600 rounded px-2.5 py-1.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Date</label>
            <input
              type="date"
              value={local.date}
              onChange={(e) => setLocal((p) => ({ ...p, date: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-600 rounded px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>


        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-xs text-slate-400 border border-slate-600 rounded hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(local)}
            className="flex-1 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
