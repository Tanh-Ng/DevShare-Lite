// hooks/useCurrentUser.ts
import { useEffect, useState } from 'react';

export function useCurrentUser() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        fetch('http://localhost:3000/users/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch user');
                }
                const data = await res.json();
                console.log(' Dữ liệu user từ API:', data);
                return data;
            })
            .then((data) => {
                setUser(data);
            })
            .catch((err) => {
                console.error(' Lỗi khi lấy user:', err);
                setUser(null);
                localStorage.removeItem('token');
            })
            .finally(() => setLoading(false));
    }, []);

    return { user, loading };
}
