'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getCoverImageUrl } from '../utils/cloudinary';

export default function PostPreview({
    title,
    coverImage,
    content,
}: {
    title: string;
    coverImage: string;
    content: string;
}) {
    const [formattedDate, setFormattedDate] = useState('');
    const [user, setUser] = useState<{ username: string; avatarUrl: string } | null>(null);

    useEffect(() => {
        setFormattedDate(new Date().toLocaleDateString('vi-VN'));

        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:3000/users/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(res => res.json())
                .then(data => setUser(data))
                .catch(err => console.error('Lỗi khi lấy user:', err));
        }
    }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Xem trước</h2>
            <div className="flex items-start justify-between border p-4 rounded-xl shadow-md gap-6">
                {/* Bên trái: nội dung bài viết */}
                <div className="flex-1">
                    {/* Tác giả */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <img
                            src={user?.avatarUrl || 'avatar.png'}
                            alt="Avatar"
                            className="w-6 h-6 rounded-full object-cover"
                        />
                        <span>{user?.username || 'Bạn'}</span>
                    </div>

                    {/* Tiêu đề */}
                    <h3 className="text-xl font-bold text-blue-600 mb-1">
                        {title || 'Tiêu đề...'}
                    </h3>

                    {/* Tóm tắt nội dung */}
                    <p className="text-gray-700 text-sm line-clamp-2 mb-2">
                        {content || 'Tóm tắt bài viết'}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center text-xs text-gray-500 space-x-4 mt-2">
                        <span className="flex items-center gap-1">
                            <Image src="/star.png" alt="star" width={14} height={14} />
                            0
                        </span>
                        <span className="flex items-center gap-1">
                            <Image src="/views.png" alt="views" width={14} height={14} />
                            0
                        </span>
                        <span className="flex items-center gap-1">
                            <Image src="/starred.png" alt="comment" width={14} height={14} />
                            0
                        </span>
                        <span>
                            <Image src="/bookmark.png" alt="bookmark" width={14} height={14} />
                        </span>
                        <span>{formattedDate || '...'}</span>
                    </div>
                </div>

                {/* Bên phải: ảnh bìa */}
                {coverImage && (
                    <img
                        src={getCoverImageUrl(coverImage)}
                        alt="Preview"
                        className="w-40 h-24 rounded object-cover shrink-0"
                    />
                )}
            </div>
        </div>
    );
}
