import Image from 'next/image';
import { useCurrentUser } from '../hooks/useCurrentUser';

export default function ProfilePage() {
  const { user, loading } = useCurrentUser();

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10 text-red-500">Chưa đăng nhập</p>;

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

      <div className="bg-muted p-4 rounded-lg border border-border space-y-2">
        <h2 className="font-semibold text-lg text-primary">About</h2>
        <p className="text-sm text-muted-foreground">{user.bio || 'Chưa có giới thiệu.'}</p>
        <p className="text-xs text-muted-foreground">
          Joined: <span className="font-medium">{user.joined || 'N/A'}</span>
        </p>
      </div>
    </div>
  );
}
