// pages/post/[id].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getCoverImageUrl } from '../../utils/cloudinary';
import ReactMarkdown from 'react-markdown';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import Link from 'next/link';
import Image from 'next/image';


export default function PostDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useCurrentUser();

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
  const isAuthorMe = user?._id === post.author?._id;

  return (
    <div className="grid grid-cols-12 gap-6 max-w-screen-xl mx-auto mt-6 px-6">
      {/* Left Sidebar */}
      <aside className="col-span-2 sticky top-20 self-start space-y-4 border-r pr-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <img
            src={post.author?.avatarUrl || '/avatar.png'}
            alt={post.author?.username || 'Avatar'}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-semibold">{post.author?.username || 'Unknown'}</span>
        </div>

        <div className="flex items-center gap-2">
          <Image src="/icons/like.png" alt="like" width={16} height={16} />
          {post.likes?.length ?? 0} lượt thích
        </div>

        <div className="flex items-center gap-2">
          <Image src="/icons/bookmark.png" alt="bookmark" width={16} height={16} />
          {post.bookmarks?.length ?? 0} bookmark
        </div>

        <div className="flex items-center gap-2">
          <Image src="/icons/view.png" alt="views" width={16} height={16} />
          {post.views} lượt xem
        </div>

        <div className="flex items-center gap-2">
          <Image src="/icons/clock.png" alt="clock" width={16} height={16} />
          Ngày đăng: {formattedDate}
        </div>

        {isAuthorMe && (
          <Link
            href={{ pathname: '/write', query: { edit: post._id } }}
            className="inline-flex items-center gap-1 mt-4 px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 text-center"
          >
            <Image src="/edit.png" alt="edit" width={16} height={16} />
            Sửa bài viết
          </Link>
        )}
      </aside>

      {/* Center content */}
      <main className="col-span-7">
        {post.coverImage && (
          <div className="w-full aspect-video overflow-hidden rounded-lg mb-6 shadow">
            <img
              src={getCoverImageUrl(post.coverImage)}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          </div>
        )}

        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

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
