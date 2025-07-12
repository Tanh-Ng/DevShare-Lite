import { useRef, useState } from 'react';

export function AvatarUploader({
    avatarUrl,
    avatarPublicId,
    userId,
    onUpdated,
}: {
    avatarUrl: string;
    avatarPublicId?: string;
    userId: string;
    onUpdated: (url: string, publicId: string) => void;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);
            if (avatarPublicId) formData.append('oldPublicId', avatarPublicId);

            const upload = await fetch('http://localhost:3000/upload/avatar', {
                method: 'POST',
                body: formData,
            });
            const uploadData = await upload.json();

            if (!upload.ok) throw new Error(uploadData.message || 'Upload failed');
            const token = localStorage.getItem('token');
            const update = await fetch(`http://localhost:3000/users/me/avatar`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, },
                body: JSON.stringify({
                    avatarUrl: uploadData.url,
                    avatarPublicId: uploadData.publicId,
                }),
            });
            const updateData = await update.json();

            if (!update.ok) throw new Error(updateData.message || 'Update failed');

            onUpdated(updateData.avatarUrl, updateData.avatarPublicId);
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-20 h-20">
            <img
                src={avatarUrl || '/avatar.png'}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full border"
            />

            <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-white text-xs px-2 py-1 border rounded shadow hover:bg-gray-100"
                disabled={loading}
            >
                {loading ? 'Đang cập nhật...' : 'Đổi ảnh'}
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
            />

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}
