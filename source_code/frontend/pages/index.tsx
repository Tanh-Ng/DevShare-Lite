'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import WelcomeSection from '../components/Landing/WelcomeSection';
import AuthForm from '../components/Landing/AuthForm';


export default function LandingPage() {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/home');
    } else {
      setCheckingAuth(false);
    }
  }, []);

  if (checkingAuth) return null;
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-background to-muted/20">
      <WelcomeSection />
      <div className="flex items-center justify-center p-8 bg-card/50 backdrop-blur-sm">
        <AuthForm isLoginMode={isLoginMode} setIsLoginMode={setIsLoginMode} />
      </div>
    </div>
  );
}
