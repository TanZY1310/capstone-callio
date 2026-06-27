import { getAuth } from 'firebase/auth';

export const getAuthHeader = async () => {
    const token = await getAuth().currentUser.getIdToken();
    return { Authorization: `Bearer ${token}` };
  };