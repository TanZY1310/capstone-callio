import React from 'react';

function ProfileCardSetting() {
  return (
    <div className="card bg-base-100 border border-base-200 rounded-xl p-6 shadow-sm w-full">
      {/* Header Section with Title and Badge */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold tracking-wider text-base-content/70 uppercase">
          Personal Information
        </h3>

        <span className="badge badge-success badge-sm text-xs px-2.5 py-3 font-medium text-success-content bg-emerald-100 border-none">
          Active Profile
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* Full Name Input */}
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text text-xs font-bold text-base-content/60 uppercase tracking-wide">
              Full Name
            </span>
          </label>
          <input
            type="text"
            defaultValue="Alexander Sterling"
            className="input input-bordered w-full bg-base-100 border-base-300 text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text text-xs font-bold text-base-content/60 uppercase tracking-wide">
              Email Address
            </span>
          </label>
          <input
            type="email"
            defaultValue="a.sterling@callio-global.com"
            className="input input-bordered w-full bg-base-100 border-base-300 text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text text-xs font-bold text-base-content/60 uppercase tracking-wide">
              Phone Number
            </span>
          </label>
          <input
            type="text"
            defaultValue="+1 (555) 902-4412"
            className="input input-bordered w-full bg-base-100 border-base-300 text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text text-xs font-bold text-base-content/60 uppercase tracking-wide">
              Role
            </span>
          </label>
          <div className="relative w-full">
            <input
              type="text"
              defaultValue="Senior Consultant"
              disabled
              className="input input-bordered w-full bg-base-200/50 border-base-300 text-sm text-base-content/70 pr-10 cursor-not-allowed select-none"
            />

            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-base-content/40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCardSetting;
