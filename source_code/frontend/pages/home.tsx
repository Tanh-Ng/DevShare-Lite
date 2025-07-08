import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PostTabs from '../components/PostTabs';
import PostCard from '../components/PostCard';
import { mockPosts } from '../data/mockPosts';

type PostTabType = 'following' | 'latest' | 'recent';

export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState<PostTabType>('latest');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/'); // 🡐 quay về landing nếu chưa đăng nhập
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  if (isAuthenticated === null) {
    return null; // loading
  }

  const filteredPosts = mockPosts.filter((post) => {
    if (selectedTab === 'following') return post.isFollowing;
    if (selectedTab === 'recent') return post.recentlyViewed;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4">
      <PostTabs currentTab={selectedTab} onTabChange={setSelectedTab} />

      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      ) : (
        <p className="text-muted-foreground">No posts found.</p>
      )}
    </div>
  );
}
