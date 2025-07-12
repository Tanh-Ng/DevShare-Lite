// pages/post/[id].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getCoverImageUrl } from '../../utils/cloudinary';
import ReactMarkdown from 'react-markdown';

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3000/posts/${id}`)
      .then(res => res.json())
      .then(data => setPost(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!id || !post) {
    return <p className="text-center text-gray-500 mt-10">Đang tải bài viết...</p>;
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString();

  return (
    <div className="grid grid-cols-12 gap-6 max-w-screen-xl mx-auto mt-6 px-6">
      {/* Left Sidebar */}
      <aside className="col-span-2 sticky top-20 self-start space-y-4 border-r pr-4 text-sm text-gray-600">
        <div>
          <p className="font-medium">👤 {post.author?.name}</p>
        </div>
        <div>❤️ {post.likes?.length ?? 0} likes</div>
        <div>🔖 {post.bookmarks?.length ?? 0} bookmarks</div>
        <div>👁️ {post.views} views</div>
        <div>🕒 {formattedDate}</div>
      </aside>

      {/* Center content */}
      <main className="col-span-7">
        {/* Ảnh bìa */}
        {post.coverImage && (
          <>
            {console.log("Optimized Cover Image URL:", getCoverImageUrl(post.coverImage))}

            <div className="w-full aspect-video overflow-hidden rounded-lg mb-6 shadow">
              <img
                src={getCoverImageUrl(post.coverImage)}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
          </>
        )}

        {/* Tiêu đề */}
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

        {/* Nội dung */}
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </main>

      {/* Right sidebar - comments */}
      <aside className="col-span-3 space-y-3">
        <h2 className="text-lg font-semibold mb-2">💬 Bình luận</h2>
        {post.comments?.length > 0 ? (
          post.comments.map((comment: any) => (
            <div key={comment._id} className="border-b pb-2">
              <p className="text-sm text-gray-800 font-medium">{comment.author?.name || 'Anonymous'}</p>
              <p className="text-sm text-gray-600">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400">Chưa có bình luận.</p>
        )}
      </aside>
    </div>
  );
}
