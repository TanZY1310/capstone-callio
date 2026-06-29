import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import ProfileCardSetting from '../components/Profile-Management/ProfileCardSetting';
import ProfilePhotoSetting from '../components/Profile-Management/ProfilePhotoSetting';
import CredentialCardSetting from '../components/Profile-Management/CredentialCardSetting';
import UserInsightCard from '../components/Profile-Management/UserInsightCard';

function ProfileSetting() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const formData = new FormData(e.target);
      const fullName = formData.get('fullName')?.trim().split(' ') || [];
      const first_name = fullName[0] || '';
      const last_name = fullName.slice(1).join(' ') || '';
      const license_number = formData.get('license_number');
      const agency_branch = formData.get('agency_branch');
      const bio = formData.get('bio');

      const payload = {
        first_name,
        last_name,
        license_number,
        agency_branch,
        bio,
      };

      const token = await user.getIdToken();
      await axios.put(`${API_URL}/user_profile/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Profile updated successfully!');
      setTimeout(() => navigate('/profile'), 1000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="min-h-screen bg-base-100 p-6 md:p-10"
    >
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
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="btn btn-ghost border border-base-300 normal-case font-medium rounded-lg px-6"
        >
          Cancel Changes
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="btn btn-neutral bg-[#111827] text-white hover:bg-slate-800 border-none normal-case font-medium rounded-lg px-6 flex items-center gap-2"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

export default ProfileSetting;
