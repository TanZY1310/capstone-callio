function CredentialCardSetting() {
  return (
    <div>
      <div className="w-152 rounded-2xl border border-[#E2E8F0] bg-white/70 p-8 shadow-sm backdrop-blur-md flex flex-col gap-6 m-5 mt-1">
        <div>
          <div>
            <h3>PROFESSIONAL DETAILS</h3>
          </div>
        </div>
        <div>
          <div className="flex flex-col gap-1.5 mb-2">
            <label className="mb-1 block text-xs text-slate-400">
              LICENSE NUMBER/REN
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5 mb-2">
            <label className="mb-1 block text-xs text-slate-400">
              AGENCY BRANCH
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CredentialCardSetting;
