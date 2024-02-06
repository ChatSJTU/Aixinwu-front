import { createContext } from 'react';

interface UserContextType {
    userTheme: string;
    changeTheme: (themeName: string) => void;
  }

export const UserContext = createContext<UserContextType>({
    userTheme: 'light', 
    changeTheme: () => {} 
});