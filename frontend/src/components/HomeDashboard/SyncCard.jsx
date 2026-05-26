import { RefreshCw, Settings } from "lucide-react";

export default function SyncCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
            <div className="w-5 h-5 bg-green-500 rounded-sm" />
          </div>
          <div>
            <p className="font-semibold text-sm">Google Sheets API</p>
            <p className="text-xs text-gray-400">Automated lead export and data syncing.</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          CONNECTED
        </span>
      </div>
      <div className="flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 bg-black text-white text-sm font-medium py-3 rounded-xl hover:bg-gray-900 transition-colors">
          <RefreshCw size={15} />
          Sync Data
        </button>
        <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <Settings size={16} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
}
