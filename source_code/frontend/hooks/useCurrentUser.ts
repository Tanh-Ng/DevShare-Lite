// hooks/useCurrentUser.ts
import { useEffect, useState } from 'react';

interface User {
    id: string;
    email: string;
    username: string;
    bio?: string;
    joined?: string;
    avatarUrl?: string;
    avatarPublicId?: string;
}

export function useCurrentUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/users/me', {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data); // data sẽ là kiểu User
        setLoading(false);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return { user, loading, refresh: fetchUser };
}
