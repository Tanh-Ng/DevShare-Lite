import { useState } from 'react';
import { useRouter } from 'next/router';
import { useToast } from '../../hooks/useToast';

interface AuthFormProps {
    isLoginMode: boolean;
    setIsLoginMode: (mode: boolean) => void;
}

export default function AuthForm({ isLoginMode, setIsLoginMode }: AuthFormProps) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { success, error, info } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = isLoginMode
            ? 'http://localhost:3000/auth/login'
            : 'http://localhost:3000/users/register';

        const payload = isLoginMode
            ? { email, password }
            : { email, password, username };

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (res.ok && (data.access_token || data.user)) {
            if (isLoginMode) {
                localStorage.setItem('token', data.access_token);
                try {
                    // fetch current user to get username and store for home greeting
                    const meRes = await fetch('http://localhost:3000/users/me', {
                        headers: { Authorization: `Bearer ${data.access_token}` },
                    });
                    const me = await meRes.json();
                    const name = me?.username || me?.email || 'bạn';
                    localStorage.setItem('greet_name', name);
                } catch (_) {
                    localStorage.setItem('greet_name', 'bạn');
                }
                router.push('/home');
            } else {
                info('Sign up successful, please login!');
                setIsLoginMode(true);
            }
        } else {
            error(data.message || 'Login/Sign up failed!');
        }
    };

    return (
        <div className="flex items-center justify-center p-8 bg-white text-black rounded-l-3xl shadow-xl">
            <div className="w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    {isLoginMode ? 'Login' : 'Sign up'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLoginMode && (
                        <input
                            type="text"
                            required
                            placeholder="Username"
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    )}
                    <input
                        type="email"
                        required
                        placeholder="Email"
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        required
                        placeholder="Password"
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800"
                    >
                        {isLoginMode ? 'Login' : 'Sign up'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm">
                    {isLoginMode ? 'Did not have an account yet?' : 'Have an account already?'}{' '}
                    <button
                        onClick={() => setIsLoginMode(!isLoginMode)}
                        className="text-blue-600 hover:underline"
                    >
                        {isLoginMode ? 'Sign up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
}
