// pages/index.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PostTabs from '../components/PostTabs';
import PostCard from '../components/PostCard';
import { fetchPosts } from '../utils/api';

type PostTabType = 'following' | 'latest' | 'recent';

export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState<PostTabType>('latest');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/');
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts()
        .then(setPosts)
        .catch((err) => console.error('Lỗi fetch posts:', err))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  if (isAuthenticated === null || loading) {
    return <p className="text-center text-gray-500 mt-10">Đang tải...</p>;
  }

  const filteredPosts = posts.filter((post) => {
    if (selectedTab === 'following') return post.isFollowing;
    if (selectedTab === 'recent') return post.recentlyViewed;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4">
      <PostTabs currentTab={selectedTab} onTabChange={setSelectedTab} />
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))
      ) : (
        <p className="text-muted-foreground">Không có bài viết nào.</p>
      )}
    </div>
  );
}
