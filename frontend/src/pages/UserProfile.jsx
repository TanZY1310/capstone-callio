import ProfileCard from '../components/Profile-Management/ProfileCard';
import SheetsCard from '../components/Profile-Management/SheetsCard';
import SocialCard from '../components/Profile-Management/SocialCard';
import { useAuth } from '../hooks/useAuth';
import CredentialCard from '../components/Profile-Management/CredentialCard';
import RagUpload from '../components/Profile-Management/RagUpload';

function UserProfile() {
  const { profile } = useAuth();

  return (
    <div className="p-5 w-full flex flex-col gap-6 box-border">
      <ProfileCard
        first_name={profile?.first_name || ''}
        last_name={profile?.last_name || ''}
        registered_year={profile?.registered_year || ''}
        role={profile?.role || ''}
      />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        <SocialCard />
        <SheetsCard />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        <CredentialCard />
        <RagUpload />
      </div>
    </div>
  );
}

export default UserProfile;
