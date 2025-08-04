'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { fetchCurrentUser, fetchFishImageBlob } from '@/api/apiClient';

type User = {
  user_id: string,
  my_fish_path: string,
} | null;

type UserContextType = {
  user: User | null,
  loading: boolean,
  setUser: (user:  User) => void,
  refreshUser: () => Promise<void>,
  fishUrl: string | null,
  setFishUrl: (url: string) => void,
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  refreshUser: async () => {},
  fishUrl: null,
  setFishUrl: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode}) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fishUrl, setFishUrl] = useState<string | null>(null);
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

  const fetchFish = async () => {
    if (!user) {
      setFishUrl(null);
      return;
    }
    try {
      const blob = await fetchFishImageBlob();
      if (blob) {
        const url = URL.createObjectURL(blob);
        setFishUrl(url);
      } else {
        setFishUrl(null);
      } 
    }  catch (error) {
      console.error("魚画像の取得に失敗しました", error);
      setFishUrl(null);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    fetchFish();
  }, [user]);

  const refreshUser = async () => {
    await getUser();
  }

  return (
    <UserContext.Provider value={{ user, loading, setUser, refreshUser, fishUrl, setFishUrl}}>
      {children}
    </UserContext.Provider>
  )
};

export const useUser = () => useContext(UserContext);