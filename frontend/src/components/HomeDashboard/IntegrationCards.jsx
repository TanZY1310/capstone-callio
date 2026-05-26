import { MessageSquare } from "lucide-react";

export default function IntegrationCards() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
            <MessageSquare size={16} className="text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-sm">WhatsApp Cloud API</p>
            <p className="flex items-center gap-1.5 text-xs text-green-600 mt-0.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Connected
            </p>
          </div>
        </div>
        <span className="text-xs text-gray-400">Last sync: 2m ago</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
            <div className="w-4 h-4 bg-green-500 rounded-sm" />
          </div>
          <div>
            <p className="font-semibold text-sm">Google Sheets Integration</p>
            <p className="flex items-center gap-1.5 text-xs text-green-600 mt-0.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Auto-syncing
            </p>
          </div>
        </div>
        <span className="text-xs text-gray-400">Next sync in: 14m</span>
      </div>
    </div>
  );
}
