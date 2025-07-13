import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getCoverImageUrl } from '../../utils/cloudinary';
import ReactMarkdown from 'react-markdown';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import Link from 'next/link';
import Image from 'next/image';
import MarkdownEditor from '../../components/MarkdownEditor';

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useCurrentUser();

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPost = async () => {
    if (!id) return;
    const res = await fetch(`http://localhost:3000/posts/${id}`);
    const data = await res.json();
    setPost(data);
  };

  const fetchComments = async () => {
    if (!id) return;
    const res = await fetch(`http://localhost:3000/comments/post/${id}`);
    const data = await res.json();
    console.log('Fetched comments:', data); // ✅ LOG KIỂM TRA
    setComments(data);
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (parentCommentId?: string) => {
    const content = parentCommentId ? replyContent.trim() : commentContent.trim();
    if (!content) return;
    if (!user) return alert('Vui lòng đăng nhập để bình luận.');

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/comments/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          parentComment: parentCommentId || null,
        }),
      });

      if (res.ok) {
        if (parentCommentId) {
          setReplyContent('');
          setActiveReplyId(null); // đóng ô reply sau khi gửi
        } else {
          setCommentContent('');
        }
        await fetchComments();
      } else {
        const err = await res.json();
        alert(err.message || 'Lỗi khi gửi bình luận.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderComments = (commentList: any[], depth = 0) => {
    return commentList.map((comment) => (
      <div key={comment._id} style={{ marginLeft: depth * 16 }} className="mb-3 border-b pb-2">
        <p className="text-sm font-semibold text-gray-800">{comment.author?.username || 'Ẩn danh'}</p>
        <div className="prose prose-sm text-gray-700">
          <ReactMarkdown>{comment.content}</ReactMarkdown>
        </div>

        {user && (
          <button
            onClick={() => setActiveReplyId(activeReplyId === comment._id ? null : comment._id)}
            className="text-xs text-blue-600 hover:underline mt-1 ml-2"
          >
            {activeReplyId === comment._id ? 'Hủy trả lời' : 'Trả lời'}
          </button>
        )}

        {activeReplyId === comment._id && (
          <div className="mt-2 ml-2">
            <MarkdownEditor
              value={replyContent}
              onChange={setReplyContent}
              height="120px"
              mode="simple"
            />
            <button
              onClick={() => handleCommentSubmit(comment._id)}
              disabled={loading}
              className="text-xs bg-blue-500 text-white rounded px-2 py-1 mt-1 hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Đang gửi...' : 'Gửi trả lời'}
            </button>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {renderComments(comment.replies, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  if (!post) {
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
            alt={post.author?.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-semibold">{post.author?.username}</span>
        </div>
        {/* ... các phần còn lại của sidebar */}
      </aside>

      {/* Main content */}
      <main className="col-span-7">
        {post.coverImage && (
          <div className="w-full aspect-video overflow-hidden rounded-lg mb-6 shadow">
            <img
              src={getCoverImageUrl(post.coverImage)}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </main>

      {/* Comments Sidebar */}
      <aside className="col-span-3 space-y-3">
        <h2 className="text-lg font-semibold mb-2">💬 Bình luận</h2>

        {user ? (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 mb-1">Viết bình luận của bạn</h3>
            <MarkdownEditor
              value={commentContent}
              onChange={setCommentContent}
              height="200px"
              mode="simple"
            />
            <button
              onClick={() => handleCommentSubmit()}
              disabled={loading}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Đang gửi...' : 'Gửi bình luận'}
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Hãy <Link href="/login" className="text-blue-600 underline">đăng nhập</Link> để bình luận.
          </p>
        )}

        {comments.length > 0 ? (
          renderComments(comments)
        ) : (
          <p className="text-sm text-gray-400">Chưa có bình luận.</p>
        )}
      </aside>
    </div>
  );
}
