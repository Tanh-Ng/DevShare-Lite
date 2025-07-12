'use client';

import { useEffect, useState } from 'react';

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

    useEffect(() => {
        setFormattedDate(new Date().toLocaleDateString('vi-VN')); // dùng 'vi-VN' hoặc 'en-US' cố định
    }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🧪 Xem trước</h2>
            <div className="border p-4 rounded-xl shadow-md">
                {coverImage && (
                    <img
                        src={coverImage}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded mb-3"
                    />
                )}
                <h3 className="text-xl font-bold text-blue-600 mb-1">
                    {title || 'Tiêu đề...'}
                </h3>
                <p className="text-gray-600 line-clamp-3 mb-2">
                    {content || 'Tóm tắt bài viết'}
                </p>
                <div className="text-sm text-gray-500">
                    👤 Tác giả: <span className="font-medium">Bạn</span> • {formattedDate || '...'}
                </div>
            </div>
        </div>
    );
}
