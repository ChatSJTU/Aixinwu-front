import '@/styles/globals.scss';
import MainLayout from '@/components/layout';

import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { AuthContextProvider } from '@/contexts/auth';
import { ThemeContextProvider } from '@/contexts/theme';
import Head from 'next/head';
import { MessageContextProvider } from '@/contexts/message';
import { CartContextProvider } from '@/contexts/cart';
import { NotificationContextProvider } from '@/contexts/notification';


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
    <MessageContextProvider>
      <AuthContextProvider>
        <ThemeContextProvider>
            <NotificationContextProvider>
              <CartContextProvider>
                <MainLayout>
                  <Component {...pageProps} />
                </MainLayout>
              </CartContextProvider>
            </NotificationContextProvider>
        </ThemeContextProvider>
      </AuthContextProvider>
    </MessageContextProvider>
  );
}

export default MyApp;

