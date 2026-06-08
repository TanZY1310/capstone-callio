import CredentialCard from '../components/Profile-Management/CredentialCard';
import ProfileCard from '../components/Profile-Management/ProfileCard';
import SheetsCard from '../components/Profile-Management/SheetsCard';
import SocialCard from '../components/Profile-Management/SocialCard';

function UserProfile() {
  return (
    <div className="p-5 w-full flex flex-col gap-6 box-border">
      <ProfileCard />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        <SocialCard />
        <SheetsCard />
      </div>
      <CredentialCard />
    </div>
  );
}

export default UserProfile;
