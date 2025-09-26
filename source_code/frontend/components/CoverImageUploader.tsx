// components/CoverImageUploader.tsx
'use client';
import { getCoverImageUrl } from '../utils/cloudinary';
import { Image as ImageIcon, Upload } from 'lucide-react';
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
                setMessage(data.message || 'Failed to upload image');
            }
        } catch (err) {
            setMessage('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            {coverImage ? (
                <img src={getCoverImageUrl(coverImage)} alt="Cover" className="w-full rounded-xl border border-border shadow mb-2" />
            ) : (
                <div className="border border-dashed border-border rounded p-6 text-center text-muted-foreground bg-card">
                    {uploading ? 'Loading image' : 'No cover image selected'}
                </div>
            )}
            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border hover:bg-accent cursor-pointer w-fit">
                <Upload className="w-4 h-4" />
                <span>Chọn ảnh bìa</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            {message && <p className="text-sm text-destructive">{message}</p>}
        </div>
    );
}
