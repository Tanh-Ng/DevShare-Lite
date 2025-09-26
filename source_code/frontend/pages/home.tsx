import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';
import PostTabs from '../components/PostTabs';
import PostCard from '../components/PostCard';
import { PostCardSkeleton } from '../components/LoadingSkeleton';
import Breadcrumb from '../components/Breadcrumb';

type PostTabType = 'following' | 'latest' | 'recent';

export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState<PostTabType>('latest');
  const [posts, setPosts] = useState<any[]>([]);
  const [tagsFilter, setTagsFilter] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toasts, success, removeToast } = useToast();

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

      // Ensure data is an array and has proper structure
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        console.error('Invalid data format received:', data);
        setPosts([]);
      }
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

  useEffect(() => {
    // one-time greeting after login
    const name = localStorage.getItem('greet_name');
    if (name) {
      success(`Greetings, ${name}!`);
      localStorage.removeItem('greet_name');
    }
  }, []);

  const filteredPosts = tagsFilter.length === 0
    ? posts
    : posts.filter((p) => Array.isArray(p.tags) && p.tags.some((t: string) => tagsFilter.includes(String(t).toLowerCase())));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <Breadcrumb />

      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-foreground mb-2">
          Welcome to DevShare
        </h1>
        <p className="text-muted-foreground">
          Discover and share amazing content with the developer community
        </p>
      </div>
      <div className="flex items-center justify-between gap-3">
        {/* Tabs bên trái */}
        <div className="h-10 flex items-center">
          <PostTabs currentTab={selectedTab} onTabChange={setSelectedTab} />
        </div>

        {/* Input filter bên phải */}
        <div className="flex items-center w-full sm:w-auto sm:max-w-md">
          <div className="flex items-center gap-2 w-full h-10 px-3 rounded-lg bg-muted p-1">
            <div className="flex items-center gap-2 h-full flex-1 px-3 rounded-md border border-border bg-card text-card-foreground ring-offset-background focus-within:ring-2 focus-within:ring-primary/40 transition flex-wrap">
              {tagsFilter.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded bg-muted text-muted-foreground"
                >
                  #{tag}
                  <button
                    type="button"
                    aria-label={`Remove ${tag}`}
                    className="ml-1 hover:text-foreground"
                    onClick={() =>
                      setTagsFilter(tagsFilter.filter((t) => t !== tag))
                    }
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.includes(',')) {
                    const parts = value
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean);
                    if (parts.length) {
                      setTagsFilter((prev) =>
                        Array.from(
                          new Set([...prev, ...parts.map((t) => t.toLowerCase())])
                        )
                      );
                    }
                    setTagInput('');
                  } else {
                    setTagInput(value);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    const value = tagInput.trim();
                    if (value) {
                      setTagsFilter((prev) =>
                        prev.includes(value.toLowerCase())
                          ? prev
                          : [...prev, value.toLowerCase()]
                      );
                      setTagInput('');
                    }
                  } else if (
                    e.key === 'Backspace' &&
                    tagInput === '' &&
                    tagsFilter.length > 0
                  ) {
                    setTagsFilter((prev) => prev.slice(0, -1));
                  }
                }}
                className="flex-1 min-w-[140px] outline-none bg-transparent text-sm h-full"
                placeholder="Filter by tags, press Enter or ,"
              />
            </div>
          </div>
        </div>
      </div>


      <div className="mt-8 space-y-6">
        {loading ? (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <PostCardSkeleton key={index} />
            ))}
          </>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Something went wrong</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button
              onClick={() => fetchPostsByTab(selectedTab)}
              className="btn-primary px-4 py-2 rounded-lg text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No posts found</h3>
            <p className="text-muted-foreground mb-4">
              {tagsFilter.length > 0 ?
                'No posts match these tags.' :
                selectedTab === 'following'
                  ? "You're not following anyone yet. Start following some authors to see their posts here."
                  : "Be the first to share something amazing with the community!"
              }
            </p>
            <a
              href="/write"
              className="btn-primary px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Write Your First Post
            </a>
          </div>
        ) : (
          filteredPosts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
}
