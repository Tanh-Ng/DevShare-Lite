// src/app/page.tsx
import { mockPosts } from '../data/mockPosts';
import PostCard from '../components/PostCard';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto mt-6 px-4">
      <h1 className="text-2xl font-bold mb-4">Latest Posts</h1>
      {mockPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
