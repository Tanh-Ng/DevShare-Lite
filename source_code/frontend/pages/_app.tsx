// pages/_app.tsx
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}
