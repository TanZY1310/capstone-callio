import CredentialCard from "../components/Profile-Management/CredentialCard";
import ProfileCard from "../components/Profile-Management/ProfileCard";
import SheetsCard from "../components/Profile-Management/SheetsCard";
import SocialCard from "../components/Profile-Management/SocialCard";

function UserProfile() {
  return (
    <div>
      <ProfileCard />
      <SocialCard />
      <SheetsCard />
      <CredentialCard />
    </div>
  );
}

export default UserProfile;
