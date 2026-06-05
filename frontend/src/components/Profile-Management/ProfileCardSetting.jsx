function ProfileCardSetting() {
  return (
    <div>
      <div className="w-152 rounded-2xl border border-[#E2E8F0] bg-white/70 p-8 shadow-sm backdrop-blur-md flex flex-col gap-6 m-5 mt-1">
        <div>
          <div>Personal Information</div>
          <div>Active Profile</div>
        </div>
        <div>
          <div>
            <div className="flex flex-col gap-1.5 mb-2">
              <label
                className="mb-1 block text-xs text-slate-400"
                for="license"
              >
                FULL NAME
              </label>
              <input
                type="text"
                id="name"
                className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1.5 mb-2">
              <label
                className="mb-1 block text-xs text-slate-400"
                for="license"
              >
                PHONE NUMBER
              </label>
              <input
                type="text"
                id="phone"
                className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-1.5 mb-2">
              <label
                className="mb-1 block text-xs text-slate-400"
                for="license"
              >
                EMAIL ADDRESS
              </label>
              <input
                type="text"
                id="email"
                className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1.5 mb-2">
              <label
                className="mb-1 block text-xs text-slate-400"
                for="license"
              >
                ROLE
              </label>
              <input
                type="text"
                id="role"
                className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCardSetting;
