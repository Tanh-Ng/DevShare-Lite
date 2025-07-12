'use client';

import { useState } from 'react';
import { BioEditor } from './BioEditor';
import { AvatarUploader } from './AvatarUploader';

interface ProfileInfoProps {
    user: {
        email: string;
        username: string;
        id: string;
        bio?: string;
        joined?: string;
        avatarUrl?: string;
        avatarPublicId?: string;
    };
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
    const [bio, setBio] = useState(user.bio || '');
    const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
    const [avatarPublicId, setAvatarPublicId] = useState(user.avatarPublicId || '');

    const handleBioUpdate = async (newBio: string) => {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/users/me/bio', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ bio: newBio }),
        });
        if (!res.ok) throw new Error('Update failed');
        setBio(newBio);
    };

    return (
        <div className="space-y-6">
            {/* Avatar và thông tin người dùng */}
            <div className="flex items-center gap-6">
                <AvatarUploader
                    avatarUrl={avatarUrl}
                    avatarPublicId={avatarPublicId}
                    userId={user.id}
                    onUpdated={(url, publicId) => {
                        setAvatarUrl(url);
                        setAvatarPublicId(publicId);
                    }}
                />
                <div>
                    <h2 className="text-xl font-semibold text-foreground">{user.username}</h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">
                        Tham gia: {user.joined ? new Date(user.joined).toLocaleDateString('vi-VN') : 'N/A'}
                    </p>
                </div>
            </div>

            {/* Bio */}
            <BioEditor bio={bio} onSave={handleBioUpdate} />
        </div>
    );
}
