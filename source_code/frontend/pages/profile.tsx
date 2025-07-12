'use client';

import { useCurrentUser } from '../hooks/useCurrentUser';
import ProfileInfo from '../components/ProfileInfo';

export default function ProfilePage() {
  const { user, loading } = useCurrentUser();

  if (loading || !user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Hồ sơ cá nhân</h1>

      <ProfileInfo user={user} />
    </div>
  );
}
