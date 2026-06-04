function CredentialCardSetting() {
  return (
    <div>
      <div>
        <div>
          <div>
            <h3>PROFESSIONAL DETAILS</h3>
          </div>
        </div>
        <div>
          <div>
            <div className="flex flex-col gap-1.5">
              <label className="text-2xs font-bold uppercase tracking-wider text-slate-400">
                LICENSE NUMBER/REN
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-2xs font-bold uppercase tracking-wider text-slate-400">
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
    </div>
  );
}
