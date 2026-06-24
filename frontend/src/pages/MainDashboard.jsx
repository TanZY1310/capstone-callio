import LeaderDashboard from '../components/Metrics/LeaderDashboard';
import AgentDashboard from '../components/Metrics/AgentDashboard';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';

function MainDashboard() {
  const [role, setRole] = useState('');
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });

  const { profile } = useAuth();
  console.log(profile);

  //  TEAM_LEAD = "team_lead"
  //   AGENT = "agent"

  // get the role first. the fetching data will be on the respective dashboard jsx files

  useEffect(() => {
    const role = profile.role;

    setRole(role);
  }, []);

  return (
    <div>
      {user.role === 'agent' ? <AgentDashboard /> : <LeaderDashboard />}
    </div>
  );
}

export default MainDashboard;
