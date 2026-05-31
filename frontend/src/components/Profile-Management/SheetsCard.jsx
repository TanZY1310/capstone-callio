import { Settings, RefreshCcw } from "lucide-react";

function SheetsCard() {
  return (
    <div>
      <div className="w-152 h-fit rounded-xl border border-[#C6C6CD] bg-white p-6 shadow-sm flex flex-col gap-5 m-5 mt-1">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF7EE]"></div>
            <div>
              <h3 className="text-base font-bold text-[#191C1E]">
                Google Sheets API
              </h3>
              <p className="text-xs text-slate-500">
                Automated lead export and data syncing.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF7EE] px-2 py-1 text-xs font-mono tracking-wide text-[#0F9D58] uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0F9D58]"></span>
            Connected
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-2xs font-bold uppercase tracking-wider text-slate-400">
              API Key
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value="sk_live_11MvXU7Kk83VzNqP1xX..."
                disabled
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5 pr-10 text-xs font-mono text-slate-700"
              />
              <button className="absolute right-3 text-slate-400 hover:text-slate-600"></button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-2xs font-bold uppercase tracking-wider text-slate-400">
              Spreadsheet ID
            </label>
            <input
              type="text"
              value="1x9jLp8qZ-5_R8vA_m2Xy7w..."
              disabled
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-mono text-slate-700"
            />
          </div>
        </div>

        <div className="rounded-lg bg-[#EAECEF] p-3.5">
          <div className="flex justify-between items-center text-2xs font-semibold text-slate-700">
            <span className="font-bold text-slate-800">Last Sync Status</span>
            <span className="text-slate-500 font-mono">
              2026-05-12 14:22:10
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-300 overflow-hidden">
            <div className="h-full w-full rounded-full bg-[#0F9D58]"></div>
          </div>
          <p className="mt-2 text-3xs italic text-slate-500">
            Syncing 42 active leads across 4 sheets.
          </p>
        </div>

        <div className="flex gap-2.5 pt-1">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#191C1E] py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-black">
            <span>
              <RefreshCcw className="" />
            </span>
            Sync Now
          </button>

          <button className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
            <Settings />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SheetsCard;
