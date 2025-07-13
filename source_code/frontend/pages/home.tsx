import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PostTabs from '../components/PostTabs';
import PostCard from '../components/PostCard';

type PostTabType = 'following' | 'latest' | 'recent';

export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState<PostTabType>('latest');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchPostsByTab = async (tab: PostTabType) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/');
        return;
      }

      let url = '';
      let headers: any = {};

      if (tab === 'latest') {
        url = 'http://localhost:3000/posts/latest';
      } else if (tab === 'following') {
        url = 'http://localhost:3000/posts/following';
        headers['Authorization'] = `Bearer ${token}`;
      } else if (tab === 'recent') {
        url = 'http://localhost:3000/users/bookmarks';
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error('Lỗi khi tải bài viết');

      const data = await res.json();
      setPosts(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsByTab(selectedTab);
  }, [selectedTab]);

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4">
      <PostTabs currentTab={selectedTab} onTabChange={setSelectedTab} />

      {loading ? (
        <p className="text-center text-gray-500 mt-10">Đang tải...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : posts.length === 0 ? (
        <p className="text-muted-foreground">Không có bài viết nào.</p>
      ) : (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      )}
    </div>
  );
}
