// components/CoverImageUploader.tsx
'use client';
import { getCoverImageUrl } from '../utils/cloudinary';
import { useState } from 'react';

interface Props {
    coverImage: string;
    setCoverImage: (url: string) => void;
}

export default function CoverImageUploader({ coverImage, setCoverImage }: Props) {
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(true);
            const res = await fetch('http://localhost:3000/upload/blogcover', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setCoverImage(data.url);
                setMessage('');
            } else {
                setMessage(data.message || 'Upload thất bại');
            }
        } catch (err) {
            setMessage('Lỗi khi tải ảnh');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            {coverImage ? (
                <img src={getCoverImageUrl(coverImage)} alt="Cover" className="w-full rounded-xl shadow mb-4" />
            ) : (
                <div className="border border-dashed border-gray-400 rounded p-6 text-center text-gray-500">
                    {uploading ? 'Đang tải ảnh...' : 'Chưa chọn ảnh bìa'}
                </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="mt-2" />
            {message && <p className="text-sm text-red-500">{message}</p>}
        </div>
    );
}
