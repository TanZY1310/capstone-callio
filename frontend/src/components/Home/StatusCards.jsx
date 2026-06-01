import { MessageSquare } from "lucide-react";
import { SiWhatsapp, SiGooglesheets } from "react-icons/si";

function StatusCards() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-base-100 rounded-2xl border border-base-200 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-success/10 rounded-xl flex items-center justify-center">
            <SiWhatsapp size={25} className="text-success"/>
          </div>
          <div>
            <p className="font-semibold text-sm text-base-content">WhatsApp Cloud API</p>
            <p className="flex items-center gap-1.5 text-xs text-success mt-0.5">
              <span className="inline-grid *:[grid-area:1/1]">
              <span className="status status-success animate-ping"></span>
              <span className="status status-success"></span>
            </span> Connected
            </p>
          </div>
        </div>
        <span className="text-xs text-base-content/40">Last sync: 2m ago</span>
      </div>

      <div className="bg-base-100 rounded-2xl border border-base-200 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-warning/10 rounded-xl flex items-center justify-center">
            <SiGooglesheets size={25} className="text-warning"/>
          </div>
          <div>
            <p className="font-semibold text-sm text-base-content">Google Sheets API</p>
            <p className="flex items-center gap-1.5 text-xs text-warning mt-0.5">
              <span className="inline-grid *:[grid-area:1/1]">
              <span className="status status-warning animate-ping"></span>
              <span className="status status-warning"></span>
            </span> Sync in-progress
            </p>
          </div>
        </div>
        <span className="text-xs text-base-content/40">Last sync: 14m ago</span>
      </div>
    </div>
  );
}

export default StatusCards;
