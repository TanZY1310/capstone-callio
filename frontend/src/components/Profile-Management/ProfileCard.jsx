import { useState, useRef } from 'react';
import { Pencil } from 'lucide-react';
import { NavLink } from 'react-router-dom';

// change the profile pic
function ProfileCard({
  role,
  registered_year,
  profilePic,
  first_name,
  last_name,
}) {
  return (
    <div className=" w-full box-border">
      <div className="card card-side bg-base-100/70 backdrop-blur-md border border-base-200 p-6 shadow-sm flex items-center justify-between w-full gap-8">
        <div className="flex items-center gap-6">
          <div className="relative h-20 w-20 shrink-0">
            <img
              src={profilePic}
              alt="Profile Picture"
              className="h-full w-full rounded-xl object-cover border border-slate-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-[#111827]">
              {first_name} {last_name}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                Member since {registered_year}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F3FF] px-2.5 py-1 text-xs font-medium text-[#005BB3]">
                {role}
              </span>
            </div>
          </div>
        </div>
        <div>
          <NavLink to="/profile-setting">
            <button className="btn btn-neutral py-0.5 mt-10">
              Edit Profile
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
