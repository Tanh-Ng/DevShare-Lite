import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      setMessage(`Đăng nhập thành công! Xin chào ${data.user.email}`);
    } else {
      setMessage(data.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Đăng nhập</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button onClick={handleLogin}>Đăng nhập</button>
      <p>{message}</p>
    </div>
  );
}
