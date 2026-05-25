function ProfileCard() {
  return (
    <div>
      <div class="w-[928px] rounded-xl border border-[#E2E8F0] bg-white/70 p-6 shadow-sm backdrop-blur-md flex items-center justify-between gap-8">
        <div class="flex items-center gap-6">
          <div class="relative h-20 w-20 flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256"
              alt="Ahmad Iskandar"
              class="h-full w-full rounded-xl object-cover border border-slate-200"
            />
            <button class="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#005BB3] text-white shadow-sm hover:bg-[#004b94] transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-3.5 h-3.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            </button>
          </div>

          <div class="flex flex-col gap-2">
            <h2 class="text-2xl font-bold text-[#111827]">Ahmad Iskandar</h2>
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-3.5 h-3.5 text-slate-400"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
                Member since 2024
              </span>
              <span class="inline-flex items-center gap-1 rounded-full bg-[#E6F3FF] px-2.5 py-1 text-xs font-medium text-[#005BB3]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-3.5 h-3.5 text-[#008096]"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clip-rule="evenodd"
                  />
                </svg>
                Verified Professional
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4 rounded-xl border border-slate-200/60 bg-slate-50/40 p-3 pr-4">
          <div class="text-right">
            <p class="text-3xs font-semibold uppercase tracking-wider text-slate-400">
              AI Sync Status
            </p>
            <p class="text-xl font-bold text-[#005BB3]">94%</p>
          </div>
          <div class="relative flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[#005BB3] bg-white shadow-inner">
            <div class="h-6 w-6 rounded-md bg-[#005BB3]/10"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
