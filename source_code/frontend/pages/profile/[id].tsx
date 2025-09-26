'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PostCard from '../../components/PostCard';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export default function ProfilePage() {
    const router = useRouter();
    const { id } = router.query;

    const [user, setUser] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    const { user: currentUser, loading: userLoading } = useCurrentUser();

    useEffect(() => {
        if (!id || userLoading || !currentUser) return;

        const fetchData = async () => {
            try {
                const [userRes, postsRes] = await Promise.all([
                    fetch(`http://localhost:3000/users/${id}`),
                    fetch(`http://localhost:3000/posts/by-author/${id}`)
                ]);

                const userData = await userRes.json();
                const postData = await postsRes.json();

                setUser(userData);
                setPosts(postData);

                const isFollowing = userData.followers?.includes(currentUser._id);
                setIsFollowing(isFollowing);
            } catch (err) {
                console.error('An error occured', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, currentUser, userLoading]);

    const handleToggleFollow = async () => {
        const token = localStorage.getItem('token');
        if (!token) return alert('You must be logged in to follow users');

        try {
            const res = await fetch(`http://localhost:3000/users/${id}/follow`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await res.json();
            if (res.ok) {
                setIsFollowing(result.isFollowing);
                setUser((prev: any) => ({
                    ...prev,
                    followersCount: result.followersCount
                }));
            } else {
                alert(result.message || 'Failed to follow/unfollow user');
            }
        } catch (error) {
            console.error('An error occurred', error);
        }
    };

    if (loading || userLoading) return <div className="p-4 text-center text-gray-600">Loading...</div>;
    if (!user) return <div className="p-4 text-center text-red-500">Cannot find user</div>;

    const joinedDate = user.joined
        ? new Date(user.joined).toLocaleDateString('vi-VN')
        : 'Unknown';

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Thông tin người dùng */}
            <div className="flex items-center gap-4 mb-6 border-b pb-6">
                {user.avatarUrl ? (
                    <img src={user.avatarUrl || '/avatar.png'} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
                ) : (
                    <div className="w-20 h-20 bg-gray-300 rounded-full" />
                )}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500 italic">Joined: {joinedDate}</p>
                    {user.bio && <p className="text-gray-700 mt-2">{user.bio}</p>}
                </div>

                {currentUser && currentUser._id !== id && (
                    <button
                        onClick={handleToggleFollow}
                        className={`px-4 py-2 rounded text-sm transition ${isFollowing
                            ? 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                    >
                        {isFollowing ? 'Following' : 'Follow'}
                    </button>
                )}
                <p className="text-sm text-gray-500">
                    {user.followersCount ?? user.followers?.length ?? 0} followers
                </p>
            </div>

            {/* Danh sách bài viết */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Posts</h3>
            <div className="space-y-4">
                {posts.length === 0 ? (
                    <p className="text-gray-500 italic">This user has not upload any posts yet</p>
                ) : (
                    posts.map((post) => <PostCard key={post._id} post={post} />)
                )}
            </div>
        </div>
    );
}
