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
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
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
          parentCommentId: parentCommentId || null,
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

        {editingCommentId === comment._id ? (
          <div className="mt-2">
            <MarkdownEditor
              value={editContent}
              onChange={setEditContent}
              height="120px"
              mode="simple"
            />
            <div className="mt-1 flex gap-2">
              <button
                onClick={() => handleEditComment(comment._id)}
                className="text-xs bg-green-600 text-white rounded px-2 py-1 hover:bg-green-700"
              >
                Cập nhật
              </button>
              <button
                onClick={() => {
                  setEditingCommentId(null);
                  setEditContent('');
                }}
                className="text-xs text-gray-500 hover:underline"
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          <div className="prose prose-sm text-gray-700">
            <ReactMarkdown>{comment.content}</ReactMarkdown>
          </div>
        )}

        {/* Các nút điều khiển */}
        <div className="flex flex-wrap gap-2 mt-1 ml-2 text-xs text-gray-500">
          {user && (
            <button
              onClick={() =>
                setActiveReplyId(activeReplyId === comment._id ? null : comment._id)
              }
              className="text-blue-600 hover:underline"
            >
              {activeReplyId === comment._id ? 'Hủy trả lời' : 'Trả lời'}
            </button>
          )}

          {user?._id === comment.author?._id && (
            <>
              <button
                onClick={() => {
                  setEditingCommentId(comment._id);
                  setEditContent(comment.content);
                }}
                className="text-yellow-600 hover:underline"
              >
                Sửa
              </button>

              <button
                onClick={() => handleDeleteComment(comment._id)}
                className="text-red-600 hover:underline"
              >
                Xóa
              </button>
            </>
          )}
        </div>

        {/* Ô trả lời */}
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

        {/* Các comment con */}
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

  const handleEditComment = async (commentId: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/comments/${commentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: editContent }),
    });

    if (res.ok) {
      setEditingCommentId(null);
      setEditContent('');
      await fetchComments();
    } else {
      alert('Lỗi khi sửa bình luận');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xoá bình luận này không?')) return;

    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/comments/${commentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      await fetchComments();
    } else {
      alert('Lỗi khi xoá bình luận');
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;

    const token = localStorage.getItem('token');

    const res = await fetch(`http://localhost:3000/posts/${post._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      router.push('/');
    } else {
      const error = await res.json();
      alert(error.message || 'Không thể xóa bài viết.');
    }
  };
  const formattedDate = new Date(post.createdAt).toLocaleDateString();
  const isAuthorMe = user?._id === post.author?._id;

  return (
    <div className="grid grid-cols-12 gap-6 max-w-screen-xl mx-auto mt-6 px-6">
      {/* Left Sidebar */}
      <aside className="col-span-2 sticky top-20 self-start space-y-4 bg-white p-4 border rounded-2xl shadow-sm text-sm text-gray-700">
        <div className="flex items-center gap-3">
          <img
            src={post.author?.avatarUrl || '/avatar.png'}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border"
          />
          <span className="font-semibold">{post.author?.username}</span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Image src="/star.png" alt="like" width={16} height={16} />
            {post.starredBy?.length ?? 0} starred
          </div>
          <div className="flex items-center gap-2">
            <Image src="/views.png" alt="view" width={16} height={16} />
            {post.views} lượt xem
          </div>
          <div className="flex items-center gap-2">
            <Image src="/time.png" alt="date" width={16} height={16} />
            {formattedDate}
          </div>
        </div>

        {isAuthorMe && (
          <>
            <Link
              href={{ pathname: '/write', query: { edit: post._id } }}
              className="block mt-4 px-3 py-1 text-center text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
            >
              Sửa bài viết
            </Link>
            <button
              onClick={handleDeletePost}
              className="block mt-2 w-full px-3 py-1 text-center text-red-600 border border-red-600 rounded hover:bg-red-50"
            >
              Xóa bài viết
            </button>
          </>
        )}
      </aside>

      {/* Main content */}
      <main className="col-span-7 bg-white rounded-2xl p-6 shadow-md">
        {post.coverImage && (
          <div className="w-full aspect-video overflow-hidden rounded-lg mb-6 shadow-sm">
            <img
              src={getCoverImageUrl(post.coverImage)}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <div className="prose prose-lg max-w-none text-gray-800">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </main>

      {/* Comments Sidebar */}
      <aside className="col-span-3 space-y-4 bg-white p-4 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800">💬 Bình luận</h2>

        {user ? (
          <div>
            <h3 className="font-semibold text-gray-700 mb-1">Viết bình luận</h3>
            <MarkdownEditor
              value={commentContent}
              onChange={setCommentContent}
              height="160px"
              mode="simple"
            />
            <button
              onClick={() => handleCommentSubmit()}
              disabled={loading}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'Đang gửi...' : 'Gửi bình luận'}
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Hãy{' '}
            <Link href="/login" className="text-blue-600 underline hover:text-blue-800">
              đăng nhập
            </Link>{' '}
            để bình luận.
          </p>
        )}

        <div className="space-y-4">
          {comments.length > 0 ? renderComments(comments) : (
            <p className="text-sm text-gray-400">Chưa có bình luận nào.</p>
          )}
        </div>
      </aside>

    </div>
  );
}
