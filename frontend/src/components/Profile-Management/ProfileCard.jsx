function ProfileCard() {
  const user = {
    fullName: "izzat",
    email: "izzat@123",
    Number: 123456,
    bio: "",
  };
  return (
    <div>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <div className="avatar">
          <div className="w-24 rounded-xl">
            <img src="" />
          </div>
          <span className="font-bold text-black">Personal Information</span>
        </div>
        <label className="fieldset-legend">Full Name</label>
        <input
          type="text"
          className="input"
          placeholder="My awesome page"
          value={user.fullName}
        />

        <label className="fieldset-legend">Email Address</label>
        <input
          type="text"
          className="$$input"
          placeholder="My awesome page"
          value={user.email}
        />

        <label className="fieldset-legend">Phone Number</label>
        <input
          type="text"
          className="$$input"
          placeholder="My awesome page"
          value={user.Number}
        />

        <label className="fieldset-legend">Bio</label>
        <textarea className="textarea" placeholder="Bio"></textarea>
      </fieldset>
    </div>
  );
}

export default ProfileCard;
