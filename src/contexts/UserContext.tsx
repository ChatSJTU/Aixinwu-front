import { createContext } from 'react';

export const UserContext = createContext<{
    userTheme: string;
    setUserTheme: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);