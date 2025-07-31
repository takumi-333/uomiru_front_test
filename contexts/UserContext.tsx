'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { fetchCurrentUser } from '@/api/apiClient';

type User = {
  user_id: string,
  my_fish_path: string,
} | null;

type UserContextType = {
  user: User | null,
  loading: boolean,
  setUser: (user:  User) => void,
  refreshUser: () => Promise<void>,
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  refreshUser: async () => {}
});

export const UserProvider = ({ children }: { children: React.ReactNode}) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const getUser = async () => {
    console.log("currentuser取得")
    try {
      const data = await fetchCurrentUser();
      setUser(data);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  const refreshUser = async () => {
    await getUser();
  }

  return (
    <UserContext.Provider value={{ user, loading, setUser, refreshUser}}>
      {children}
    </UserContext.Provider>
  )
};

export const useUser = () => useContext(UserContext);