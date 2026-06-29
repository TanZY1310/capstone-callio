import { useState, useRef } from 'react';
import { Pencil } from 'lucide-react';

function ProfilePhotoSetting() {
  const [profilePic, setProfilePic] = useState(
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
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

      {/* Changed w-[310px] to w-full to match dynamic card grid columns */}
      <div className="card w-full bg-base-100 border border-base-200 rounded-xl shadow-sm p-6 flex flex-col items-center text-center gap-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-base-content/70 self-start">
          Profile Photo
        </h2>

        <div className="relative">
          <div className="avatar">
            <div className="w-32 h-32 rounded-full ring-4 ring-base-200">
              <img src={profilePic} alt="Profile" className="object-cover" />
            </div>
          </div>
          <button
            className="btn btn-circle btn-sm btn-neutral absolute bottom-1 right-1 border-2 border-base-100 shadow-md bg-[#111827] text-white hover:bg-slate-800"
            onClick={triggerFileSelect}
            type="button"
          >
            <Pencil className="h-3 w-3" />
          </button>
        </div>

        <p className="text-xs text-base-content/50 leading-relaxed max-w-55">
          Upload a high-resolution photo. JPEG or PNG recommended.
        </p>

        <button
          onClick={triggerFileSelect}
          type="button"
          className="btn btn-outline btn-sm w-full border-base-300 normal-case font-medium text-xs rounded-lg"
        >
          Change Photo
        </button>
      </div>
    </div>
  );
}

export default ProfilePhotoSetting;
