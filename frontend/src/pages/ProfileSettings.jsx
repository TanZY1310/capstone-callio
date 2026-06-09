import React from 'react';
import ProfileCardSetting from '../components/Profile-Management/ProfileCardSetting';
import ProfilePhotoSetting from '../components/Profile-Management/ProfilePhotoSetting';
import CredentialCardSetting from '../components/Profile-Management/CredentialCardSetting';
import UserInsightCard from '../components/Profile-Management/UserInsightCard';

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

          <UserInsightCard />
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
