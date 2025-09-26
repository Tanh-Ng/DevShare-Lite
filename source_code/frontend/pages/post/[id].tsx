import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getCoverImageUrl } from '../../utils/cloudinary';
import ReactMarkdown from 'react-markdown';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import Link from 'next/link';
import Image from 'next/image';
import MarkdownEditor from '../../components/MarkdownEditor';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/Toast';
import { MessageCircle, Star, Eye, CalendarDays } from 'lucide-react';

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useCurrentUser();
  const { toasts, success, error, info, warning, removeToast } = useToast();

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
    console.log('Fetched comments:', data); 
    setComments(data);
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
    (async () => {
      if (!id) return;
      try {
        const token = localStorage.getItem('token');
        if (!token) return; // only count when logged in to identify author
        await fetch(`http://localhost:3000/posts/${id}/view`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {
        // ignore view errors
      }
    })();
  }, [id]);

  const handleCommentSubmit = async (parentCommentId?: string) => {
    const content = parentCommentId ? replyContent.trim() : commentContent.trim();
    if (!content) return;
    if (!user) {
      warning('Vui lòng đăng nhập để bình luận.');
      return;
    }

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
        error('Lỗi khi gửi bình luận', err.message);
      }
    } catch (err) {
      console.error(err);
      error('Lỗi không xác định khi gửi bình luận');
    } finally {
      setLoading(false);
    }
  };

  const renderComments = (commentList: any[], depth = 0) => {
    return commentList.map((comment) => (
      <div key={comment._id} style={{ marginLeft: depth * 16 }} className="mb-3 border border-border rounded-lg p-3 bg-card">
        <p className="text-sm font-semibold">{comment.author?.username || 'Anonymous'}</p>

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
          <div className="prose prose-sm">
            <ReactMarkdown>{comment.content}</ReactMarkdown>
          </div>
        )}

        {/* Các nút điều khiển */}
        <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
          {user && (
            <button
              onClick={() =>
                setActiveReplyId(activeReplyId === comment._id ? null : comment._id)
              }
              className="underline hover:text-foreground"
            >
              {activeReplyId === comment._id ? 'Cancel reply' : 'Reply'}
            </button>
          )}

          {user?._id === comment.author?._id && (
            <>
              <button
                onClick={() => {
                  setEditingCommentId(comment._id);
                  setEditContent(comment.content);
                }}
                className="underline"
              >
                Sửa
              </button>

              <button
                onClick={() => handleDeleteComment(comment._id)}
                className="underline text-destructive"
              >
                Xóa
              </button>
            </>
          )}
        </div>

        {/* Ô trả lời */}
        {activeReplyId === comment._id && (
          <div className="mt-2">
            <MarkdownEditor
              value={replyContent}
              onChange={setReplyContent}
              height="120px"
              mode="simple"
            />
            <button
              onClick={() => handleCommentSubmit(comment._id)}
              disabled={loading}
              className="text-xs btn-primary rounded px-3 py-1 mt-2 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reply'}
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
    return <p className="text-center text-gray-500 mt-10">Getting post ... </p>;
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
      error('Cannot update comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/comments/${commentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      success('Đã xoá bình luận');
      await fetchComments();
    } else {
      error('Lỗi khi xoá bình luận');
    }
  };

  const handleDeletePost = async () => {
    const token = localStorage.getItem('token');

    const res = await fetch(`http://localhost:3000/posts/${post._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      success('Post deleted successfully');
      setTimeout(() => router.push('/'), 300);
    } else {
      const err = await res.json();
      error('Unable to delete post', err.message);
    }
  };
  const formattedDate = new Date(post.createdAt).toLocaleDateString();
  const isAuthorMe = user?._id === post.author?._id;

  return (
    <div className="grid grid-cols-12 gap-6 max-w-screen-xl mx-auto mt-6 px-6 text-foreground">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {/* Left Sidebar */}
      <aside className="col-span-2 sticky top-20 self-start space-y-4 bg-card text-card-foreground p-4 border border-border rounded-2xl shadow-sm text-sm">
        <div className="flex items-center gap-3">
          <img
            src={post.author?.avatarUrl || '/avatar.png'}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border border-border"
          />
          <span className="font-semibold">{post.author?.username}</span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            {post.starredBy?.length ?? 0} starred
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            {post.views} views
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            {formattedDate}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag: string) => (
                <span key={tag} className="px-2 py-0.5 text-xs rounded bg-muted text-muted-foreground">#{tag}</span>
              ))}
            </div>
          )}
        </div>

        {isAuthorMe && (
          <>
            <Link
              href={{ pathname: '/write', query: { edit: post._id } }}
              className="block mt-4 px-3 py-1 text-center border rounded border-border hover:bg-accent hover:text-accent-foreground"
            >
              Edit Post
            </Link>
            <button
              onClick={handleDeletePost}
              className="block mt-2 w-full px-3 py-1 text-center border rounded border-destructive text-destructive hover:bg-destructive/10"
            >
              Delete post
            </button>
          </>
        )}
      </aside>

      {/* Main content */}
      <main className="col-span-7 bg-card text-card-foreground rounded-2xl p-6 shadow-md border border-border">
        {post.coverImage && (
          <div className="w-full aspect-video overflow-hidden rounded-lg mb-6 shadow-sm">
            <img
              src={getCoverImageUrl(post.coverImage)}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {post.summary && (
          <p className="text-sm text-muted-foreground mb-3">{post.summary}</p>
        )}
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </main>

      {/* Comments Sidebar */}
      <aside className="col-span-3 space-y-4 bg-card text-card-foreground p-4 rounded-2xl shadow-md border border-border">
        <h2 className="text-xl font-semibold flex items-center gap-2"><MessageCircle className="w-5 h-5" /> Bình luận</h2>

        {user ? (
          <div>
            <h3 className="font-semibold mb-1">Viết bình luận</h3>
            <MarkdownEditor
              value={commentContent}
              onChange={setCommentContent}
              height="160px"
              mode="simple"
            />
            <button
              onClick={() => handleCommentSubmit()}
              disabled={loading}
              className="mt-2 px-4 py-2 btn-primary rounded-md disabled:opacity-50 transition"
            >
              {loading ? 'Đang gửi...' : 'Gửi bình luận'}
            </button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Please{' '}
            <Link href="/login" className="underline">
              login
            </Link>{' '}
            to reply.
          </p>
        )}

        <div className="space-y-4">
          {comments.length > 0 ? renderComments(comments) : (
            <p className="text-sm text-muted-foreground">Chưa có bình luận nào.</p>
          )}
        </div>
      </aside>

    </div>
  );
}
