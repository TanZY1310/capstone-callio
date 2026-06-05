import CredentialCardSetting from "../components/Profile-Management/CredentialCardSetting";
import ProfileCardSetting from "../components/Profile-Management/ProfileCardSetting";

function ProfileSetting() {
  return (
    <div>
      <div>
        <div className="m-5">
          <div>
            <h1>Profile Setting</h1>
            <p>
              Manage your account identity and professional credential settings.
            </p>
          </div>
        </div>
        <div>
          <div>
            <ProfileCardSetting />
            <CredentialCardSetting />
            <div className="flex">
              <button className="btn btn-active">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetting;
