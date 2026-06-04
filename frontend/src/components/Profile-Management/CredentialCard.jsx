function CredentialCard() {
  const agent = {
    renNumber: 123456,
    agency: "AIA",
  };

  return (
    <div>
      <div className="w-160 rounded-xl border border-[#E2E8F0] bg-white/70 p-8 shadow-sm backdrop-blur-md ml-5 ">
        <div className="mb-6 flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-900">
            Professional Details
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="mb-1 block text-xs text-slate-400" for="license">
              License Number (REN)
            </label>
            <input
              type="text"
              id="license"
              value="REN 12345"
              disabled
              className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-400" for="branch">
              Agency Branch
            </label>
            <input
              type="text"
              id="branch"
              value="IQI Global - Klang Valley"
              disabled
              className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CredentialCard;
//
