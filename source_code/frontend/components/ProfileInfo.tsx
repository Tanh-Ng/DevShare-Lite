'use client';

import { useState } from 'react';

interface ProfileInfoProps {
    user: {
        bio?: string;
        joined?: string;
    };
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
    const [bio, setBio] = useState(user.bio || '');
    const [editMode, setEditMode] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        setMessage('');
        const token = localStorage.getItem('token');

        try {
            const res = await fetch('http://localhost:3000/users/me/bio', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ bio }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('Cập nhật thành công!');
                setEditMode(false); // trở lại chế độ chỉ đọc
            } else {
                setMessage(data.message || 'Cập nhật thất bại');
            }
        } catch (err) {
            setMessage('Lỗi kết nối server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-muted p-6 rounded-lg border border-border space-y-4">
            <h2 className="text-lg font-semibold text-primary">About</h2>

            {editMode ? (
                <>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Viết vài dòng giới thiệu..."
                        className="w-full min-h-[100px] border border-border rounded p-3 text-sm text-foreground bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleUpdate}
                            disabled={loading}
                            className="border border-black text-black px-4 py-2 rounded text-sm transition hover:bg-gray-800 hover:text-white disabled:opacity-50"
                        >
                            {loading ? 'Đang cập nhật...' : 'Hoàn thành'}
                        </button>
                        <button
                            onClick={() => {
                                setEditMode(false);
                                setBio(user.bio || '');
                            }}
                            className="border border-black text-black px-4 py-2 rounded text-sm transition hover:bg-gray-800 hover:text-white"
                        >
                            Hủy
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {bio || 'Chưa có giới thiệu.'}
                    </p>
                    <button
                        onClick={() => setEditMode(true)}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Sửa Bio
                    </button>
                </>
            )}

            {message && <p className="text-sm text-muted-foreground">{message}</p>}

            <p className="text-xs text-muted-foreground">
                Joined:{' '}
                <span className="font-medium">
                    {user.joined
                        ? new Date(user.joined).toLocaleDateString('vi-VN')
                        : 'N/A'}
                </span>
            </p>
        </div>
    );
}
