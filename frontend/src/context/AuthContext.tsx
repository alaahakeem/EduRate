import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'Student' | 'Teacher' | 'Admin' | 'Center' | null;

interface AuthContextType {
  token: string | null;
  userType: UserRole;
  profileId: string | null;
  login: (token: string, userType: UserRole, profileId: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userType, setUserType] = useState<UserRole>(localStorage.getItem('userType') as UserRole);
  const [profileId, setProfileId] = useState<string | null>(localStorage.getItem('profileId'));

  const login = (newToken: string, newUserType: UserRole, newProfileId: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userType', newUserType || '');
    localStorage.setItem('profileId', newProfileId);
    
    setToken(newToken);
    setUserType(newUserType);
    setProfileId(newProfileId);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('profileId');
    
    setToken(null);
    setUserType(null);
    setProfileId(null);
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      userType, 
      profileId, 
      login, 
      logout, 
      isAuthenticated: !!token 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
