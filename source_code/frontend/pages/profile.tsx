// pages/profile.tsx
import Image from 'next/image';
import { useCurrentUser } from '../hooks/useCurrentUser';
import ProfileInfo from '../components/ProfileInfo';

export default function ProfilePage() {
  const { user, loading } = useCurrentUser();

  if (loading || !user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-6 mb-8">
        <Image
          src={user.avatarUrl || '/avatar.png'}
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

      <ProfileInfo user={user} />
    </div>
  );
}
