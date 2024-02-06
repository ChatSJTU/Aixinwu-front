import '../styles/globals.scss';
import MainLayout from './components/layout';
import { UserContext } from '../contexts/UserContext';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';


function MyApp({ Component, pageProps }: AppProps) {
  const [userTheme,setUserTheme] = useState<string>('light');

  useEffect(() => {
    const currentTheme = localStorage.getItem('currentTheme');
    if(currentTheme !== null) setUserTheme(currentTheme);
  },[])

  return (
    <UserContext.Provider value={{
      userTheme,
      setUserTheme,
    }}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </UserContext.Provider>
  );
}

export default MyApp;

