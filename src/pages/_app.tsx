import '@/styles/globals.scss';
import MainLayout from '@/components/layout';

import type { AppProps } from 'next/app';


function MyApp({ Component, pageProps }: AppProps) {
  return (
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
  );
}

export default MyApp;

