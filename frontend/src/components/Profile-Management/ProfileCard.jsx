import { useState, useRef } from "react";
import { Pencil } from "lucide-react";
import { NavLink } from "react-router-dom";

// change the profile pic
function ProfileCard({ user }) {
  const [profilePic, setProfilePic] = useState(
    "https://unsplash.com/s/photos/photo-contest",
  );

  //  Create a ref to link the custom button to the hidden file input
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      //  Generate a temporary local URL for the selected image
      const localImageUrl = URL.createObjectURL(file);
      setProfilePic(localImageUrl);
    }
  };

  const triggerFileSelect = () => {
    // Programmatically click the hidden file input
    fileInputRef.current.click();
  };
  console.log(profilePic);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
      />
      <div className="w-90% rounded-xl border border-[#E2E8F0] bg-white/70 p-6 shadow-sm backdrop-blur-md flex items-center justify-between gap-8 m-5">
        <div className="flex items-center gap-6">
          <div className="relative h-20 w-20 shrink-0">
            <img
              src={profilePic}
              alt="Profile Picture"
              className="h-full w-full rounded-xl object-cover border border-slate-200"
            />
            <button
              className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#005BB3] text-white shadow-sm hover:bg-[#004b94] transition-colors"
              onClick={triggerFileSelect}
            >
              <Pencil className="px-1" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-[#111827]">Izzat</h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                Member since 2024
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F3FF] px-2.5 py-1 text-xs font-medium text-[#005BB3]">
                Verified Professional
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
