import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserData {
  username: string;
  code_employee: string;
  position: string;
  name_employee: string;
  id_department: number;
  id_division: number;
  id_section: number;
  name_job_description: string;
}

interface UserContextType {
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  admin: string | null;
  setAdmin: (admin: string | null) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(() => {
    const stored = sessionStorage.getItem('userData');
    return stored ? JSON.parse(stored) : null;
  });
  const [admin, setAdmin] = useState<string | null>(() => {
    return sessionStorage.getItem('admin');
  });

  return (
    <UserContext.Provider value={{ userData, setUserData, admin, setAdmin }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};