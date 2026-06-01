function ProfileCard() {
  return (
    <div>
      <div class="w-90% rounded-xl border border-[#E2E8F0] bg-white/70 p-6 shadow-sm backdrop-blur-md flex items-center justify-between gap-8 m-5">
        <div class="flex items-center gap-6">
          <div class="relative h-20 w-20 shrink-0">
            <img
              src=""
              alt=""
              class="h-full w-full rounded-xl object-cover border border-slate-200"
            />
            <button class="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#005BB3] text-white shadow-sm hover:bg-[#004b94] transition-colors"></button>
          </div>

          <div class="flex flex-col gap-2">
            <h2 class="text-2xl font-bold text-[#111827]">Izzat</h2>
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                Member since 2024
              </span>
              <span class="inline-flex items-center gap-1 rounded-full bg-[#E6F3FF] px-2.5 py-1 text-xs font-medium text-[#005BB3]">
                Verified Professional
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
