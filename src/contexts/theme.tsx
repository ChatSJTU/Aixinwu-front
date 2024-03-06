import { createContext, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { LayoutProps } from '@/models/layout';
import useLocalStorage from "@/hooks/useLocalStorage"

interface ThemeContextType {
  userTheme: string;
  changeTheme: (themeName: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  userTheme: 'light', 
  changeTheme: () => {} 
});

export const ThemeContextProvider = (props : LayoutProps) => {
  const [userTheme, setUserTheme] = useLocalStorage('theme', 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', userTheme);
  }, [userTheme])

  const changeThemeHandler = (themeName : string) => {        
    setUserTheme(themeName);
  }

  const contextValue = {
    userTheme: userTheme,
    changeTheme: changeThemeHandler
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider
        theme={{ 
            algorithm: userTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: { colorPrimary: "#1677ff", colorInfo: "#1677ff" },
        }}
      >
        {props.children}
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}

export default ThemeContext