'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import WelcomeSection from '../components/Landing/WelcomeSection';
import AuthForm from '../components/Landing/AuthForm';

export default function LandingPage() {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/home');
    }
  }, []);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-slate-900 to-gray-800 text-white">
      <WelcomeSection />
      <AuthForm isLoginMode={isLoginMode} setIsLoginMode={setIsLoginMode} />
    </div>
  );
}
