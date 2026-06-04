import ProfileCardSetting from "../components/Profile-Management/ProfileCardSetting";

function ProfileSetting() {
  return (
    <div>
      <div>
        <div>
          <div>
            <h2>Profile Setting</h2>
            <p>
              Manage your account identity and professional credential settings.
            </p>
          </div>
        </div>
        <div>
          <ProfileCardSetting />
        </div>
      </div>
    </div>
  );
}

export default ProfileSetting;
