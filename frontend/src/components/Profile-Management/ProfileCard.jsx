function ProfileCard() {
  const user = {
    fullName: "izzat",
    email: "izzat@123",
    Number: 123456,
    bio: "",
  };
  return (
    <div>
      <div className="card bg-base-300 border-base-300 rounded-box w-xs border p-4">
        <div className="avatar">
          <div className="w-15 rounded-xl">
            <img src="" />
          </div>
          <span className="card-title text-black">Personal Information</span>
        </div>
        <label className="label text-sm">Name</label>
        <div type="text" className="input" placeholder="My awesome page">
          Izzat Farhan
        </div>

        <label className="label text-sm">Email</label>
        <div type="text" className="input" placeholder="My awesome page">
          Izzat@gmail.com
        </div>

        <label className="label text-sm">Phone</label>
        <div type="text" className="input" placeholder="My awesome page">
          0125035
        </div>

        <label className="label text-sm">Bio</label>
        <textarea className="textarea" placeholder="Bio"></textarea>
      </div>
    </div>
  );
}

export default ProfileCard;
