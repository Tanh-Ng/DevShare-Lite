import { useState } from 'react';
import { useRouter } from 'next/router';

interface AuthFormProps {
    isLoginMode: boolean;
    setIsLoginMode: (mode: boolean) => void;
}

export default function AuthForm({ isLoginMode, setIsLoginMode }: AuthFormProps) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState(''); // <-- thêm username
    const [password, setPassword] = useState('');

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
            // Nếu là đăng ký, backend của bạn chưa trả về token → chuyển đến login
            if (isLoginMode) {
                localStorage.setItem('token', data.access_token);
                router.push('/home');
            } else {
                alert('Đăng ký thành công, vui lòng đăng nhập!');
                setIsLoginMode(true);
            }
        } else {
            alert(data.message || 'Đăng nhập/Đăng ký thất bại!');
        }
    };

    return (
        <div className="flex items-center justify-center p-8 bg-white text-black rounded-l-3xl shadow-xl">
            <div className="w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    {isLoginMode ? 'Đăng nhập' : 'Đăng ký'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLoginMode && (
                        <input
                            type="text"
                            required
                            placeholder="Tên người dùng"
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
                        placeholder="Mật khẩu"
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800"
                    >
                        {isLoginMode ? 'Đăng nhập' : 'Đăng ký'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm">
                    {isLoginMode ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
                    <button
                        onClick={() => setIsLoginMode(!isLoginMode)}
                        className="text-blue-600 hover:underline"
                    >
                        {isLoginMode ? 'Đăng ký' : 'Đăng nhập'}
                    </button>
                </p>
            </div>
        </div>
    );
}
