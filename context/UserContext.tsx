'use client';

import { createContext, useContext, useState, useEffect } from 'react';


type User = {
  user_id: string,
  my_fish_path: string,
} | null;

type UserContextType = {
  user: User | null,
  setUser: (user:  User) => void,
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode}) => {
  const [user, setUser] = useState<User>(null);
  const getCurrentUser = async () => {
    try {
      const res = await fetch('http://localhost:5000/auth/user', {
        credentials: 'include',
        method: 'GET',
      });

      const result = await res.json();
      if (res.ok) {
        return result;
      } else {
        return null;
      }
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    (async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData ?? null);
      } catch(e) {
        console.error(e);
        setUser(null);
      }
    })();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser}}>
      {children}
    </UserContext.Provider>
  )
};

export const useUser = () => useContext(UserContext);