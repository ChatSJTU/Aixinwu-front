import '@/styles/globals.scss';
import MainLayout from '@/components/layout';

import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { AuthContextProvider } from '@/contexts/auth';
import { ThemeContextProvider } from '@/contexts/theme';
import Head from 'next/head';
import { MessageContextProvider } from '@/contexts/message';


function MyApp({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) 
    return (
      <>
        <Head>
          <title>加载中 - 上海交通大学绿色爱心屋</title>
        </Head>
        <></>
      </>
    );
  
  return (
    <AuthContextProvider>
      <ThemeContextProvider>
        <MessageContextProvider>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </MessageContextProvider>
      </ThemeContextProvider>
    </AuthContextProvider>
  );
}

export default MyApp;

