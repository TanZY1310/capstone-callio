import React from 'react';
import ProfileCardSetting from '../components/Profile-Management/ProfileCardSetting';
import ProfilePhotoSetting from '../components/Profile-Management/ProfilePhotoSetting';
import CredentialCardSetting from '../components/Profile-Management/CredentialCardSetting';

function ProfileSetting() {
  return (
    <div className="min-h-screen bg-base-100 p-6 md:p-10">
      {/* Header Section */}
      <div className="mb-8 border-b border-base-200 pb-5">
        <h1 className="text-2xl font-bold text-base-content">
          Profile Settings
        </h1>
        <p className="text-sm text-base-content/60 mt-1">
          Manage your account identity and professional credentials.
        </p>
      </div>

      {/* Main Grid: Using items-stretch ensures both columns are the same height */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ProfileCardSetting />
          <CredentialCardSetting />
        </div>

        {/* Right Column: flex flex-col ensures we can use flex-grow on children */}
        <div className="flex flex-col gap-6">
          <ProfilePhotoSetting />

          {/* Dark Card with flex-grow to fill the remaining vertical space */}
          <div className="card bg-[#111827] text-white rounded-xl p-6 shadow-sm grow flex flex-col justify-center">
            <div className="flex items-start gap-3 mb-4">
              <div className="mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <p className="text-[13px] leading-relaxed text-slate-400">
                Your identity was verified on{' '}
                <span className="text-white">Oct 12, 2023</span>. This allows
                you to manage high-value listings.
              </p>
            </div>

            {/* Progress/Sync Health Section */}
            <div className="mt-auto">
              {' '}
              {/* Pushes this section to the bottom of the card if it stretches significantly */}
              <div className="w-full bg-slate-700 rounded-full h-1.5 mb-2">
                <div
                  className="bg-emerald-400 h-1.5 rounded-full"
                  style={{ width: '85%' }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 uppercase tracking-wider">
                <span>Sync Health</span>
                <span className="text-emerald-400 font-bold">
                  85% Excellent
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider and Action Buttons Footer */}
      <div className="border-t border-base-200 mt-10 pt-8 flex justify-end gap-4">
        <button className="btn btn-ghost border border-base-300 normal-case font-medium rounded-lg px-6">
          Cancel Changes
        </button>
        <button className="btn btn-neutral bg-[#111827] text-white hover:bg-slate-800 border-none normal-case font-medium rounded-lg px-6 flex items-center gap-2">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default ProfileSetting;
