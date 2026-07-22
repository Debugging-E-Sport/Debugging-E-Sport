import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('login');

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <AuthContext.Provider value={{ activeTab, switchTab }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
