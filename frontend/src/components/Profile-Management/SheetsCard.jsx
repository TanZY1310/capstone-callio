function SheetsCard() {
  return (
    <div>
      <div class="w-[476px] h-fit rounded-xl border border-[#C6C6CD] bg-white p-6 shadow-sm flex flex-col gap-5">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF7EE]">
              <svg
                class="h-6 w-6 text-[#0F9D58]"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2zm0-4H7V7h10v2zm0 8H7v-2h10v2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-[#191C1E]">
                Google Sheets API
              </h3>
              <p class="text-xs text-slate-500">
                Automated lead export and data syncing.
              </p>
            </div>
          </div>
          <span class="inline-flex items-center gap-1.5 rounded-full bg-[#EAF7EE] px-2 py-1 text-xs font-mono tracking-wide text-[#0F9D58] uppercase">
            <span class="h-1.5 w-1.5 rounded-full bg-[#0F9D58]"></span>
            Connected
          </span>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-2xs font-bold uppercase tracking-wider text-slate-400">
              API Key
            </label>
            <div class="relative flex items-center">
              <input
                type="text"
                value="sk_live_11MvXU7Kk83VzNqP1xX..."
                disabled
                class="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5 pr-10 text-xs font-mono text-slate-700"
              />
              <button class="absolute right-3 text-slate-400 hover:text-slate-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="h-4 w-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-2xs font-bold uppercase tracking-wider text-slate-400">
              Spreadsheet ID
            </label>
            <input
              type="text"
              value="1x9jLp8qZ-5_R8vA_m2Xy7w..."
              disabled
              class="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-mono text-slate-700"
            />
          </div>
        </div>

        <div class="rounded-lg bg-[#EAECEF] p-3.5">
          <div class="flex justify-between items-center text-2xs font-semibold text-slate-700">
            <span class="font-bold text-slate-800">Last Sync Status</span>
            <span class="text-slate-500 font-mono">2026-05-12 14:22:10</span>
          </div>
          <div class="mt-2 h-1.5 w-full rounded-full bg-slate-300 overflow-hidden">
            <div class="h-full w-full rounded-full bg-[#0F9D58]"></div>
          </div>
          <p class="mt-2 text-3xs italic text-slate-500">
            Syncing 42 active leads across 4 sheets.
          </p>
        </div>

        <div class="flex gap-2.5 pt-1">
          <button class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#191C1E] py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-black">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="currentColor"
              class="h-4 w-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg> */}
            Sync Now
          </button>

          <button class="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="h-5 w-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.767a1.123 1.123 0 00-.417 1.03c.004.074.006.148.006.222 0 .074-.002.148-.006.222a1.123 1.123 0 00.417 1.03l1.003.767a1.125 1.125 0 01.26 1.43l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.216-.456a1.125 1.125 0 00-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281a1.125 1.125 0 00-.646-.87a6.512 6.512 0 01-.22-.127a1.125 1.125 0 00-1.074-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.43l1.003-.767a1.122 1.122 0 00.417-1.03a6.445 6.445 0 01-.006-.222c0-.074.002-.148.006-.222a1.122 1.122 0 00-.417-1.03l-1.003-.767a1.125 1.125 0 01-.26-1.43l1.296-2.247a1.125 1.125 0 011.37-.49l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128c.332-.183.582-.495.644-.869l.214-1.28z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SheetsCard;
