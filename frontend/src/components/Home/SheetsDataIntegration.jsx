import { RefreshCw } from "lucide-react";

function SheetsDataIntegration() {
  return (
    <div className="bg-base-100 rounded-2xl border border-base-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
            <div className="w-5 h-5 bg-success rounded-sm" />
          </div>
          <div>
            <p className="font-semibold text-sm">Google Sheets Data Transfer</p>
            <p className="text-xs text-base-content/40">Click on sync data to import data from Google Sheets</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-medium text-success bg-success/10 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-success rounded-full" />
          CONNECTED
        </span>
      </div>
      <div className="flex gap-3">
        <button className="btn btn-neutral w-full">
          <RefreshCw size={15} />
          Sync Data
        </button>
      </div>
    </div>
  );
}

export default SheetsDataIntegration;
