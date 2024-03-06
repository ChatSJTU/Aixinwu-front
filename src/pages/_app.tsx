import '@/styles/globals.scss';
import MainLayout from '@/components/layout';

import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import SplashScreen from '@/components/splash-screen';


function MyApp({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) 
    return (
      <>
        <SplashScreen></SplashScreen>
      </>
    );
  
  return (
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
  );
}

export default MyApp;

