// pages/profile.tsx
import Image from 'next/image';
import { mockUser } from '../data/mockUser';

export default function ProfilePage() {
    const user = mockUser;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="flex items-center gap-6 mb-8">
                <Image
                    src={user.avatarUrl}
                    alt="User Avatar"
                    width={80}
                    height={80}
                    className="rounded-full border border-border object-cover"
                />
                <div>
                    <h1 className="text-2xl font-bold text-foreground">{user.username}</h1>
                    <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
            </div>

            <div className="bg-muted p-4 rounded-lg border border-border space-y-2">
                <h2 className="font-semibold text-lg text-primary">About</h2>
                <p className="text-sm text-muted-foreground">{user.bio}</p>
                <p className="text-xs text-muted-foreground">
                    Joined: <span className="font-medium">{user.joined}</span>
                </p>
            </div>
        </div>
    );
}
