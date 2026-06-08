import { useState, useRef } from 'react';
import { Pencil } from 'lucide-react';

function ProfilePhotoSetting() {
  const [profilePic, setProfilePic] = useState(
    'https://unsplash.com/s/photos/photo-contest',
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
        classNameName="hidden"
      />
      <div className="card w-[310px] bg-base-100 border border-neutral-200 rounded-xl shadow-sm p-6 flex flex-col items-center text-center gap-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800 self-start">
          Profile Photo
        </h2>

        <div className="relative">
          <div className="avatar">
            <div className="w-32 rounded-full ring ring-offset-2 ring-neutral-100">
              <img src={profilePic} alt="Profile Picture" />
            </div>
          </div>
          <button
            className="btn btn-circle btn-sm btn-neutral absolute bottom-1 right-1 border-2 border-base-100 shadow-md"
            onClick={triggerFileSelect}
          >
            <Pencil classNameName="px-1" />
          </button>
        </div>

        <p className="text-xs text-neutral-500 leading-relaxed max-w-[220px]">
          Upload a high-resolution photo. JPEG or PNG recommended.
        </p>

        
      </div>
    </div>
  );
}

export default ProfilePhotoSetting;
