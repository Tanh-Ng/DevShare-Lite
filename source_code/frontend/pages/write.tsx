'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TitleInput from '../components/TitleInput';
import CoverImageUploader from '../components/CoverImageUploader';
import PostPreview from '../components/PostPreview';
import MarkdownEditor from '../components/MarkdownEditor';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';

export default function WritePage() {
  const router = useRouter();
  const { edit } = router.query;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toasts, success, error, warning, removeToast } = useToast();

  useEffect(() => {
    if (edit) {
      setIsEditing(true);
      setLoading(true);

      fetch(`http://localhost:3000/posts/${edit}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title);
          setCoverImage(data.coverImage || '');
          setContent(data.content);
          setSummary(data.summary || '');
          setTags(Array.isArray(data.tags) ? data.tags : []);
        })
        .catch((err) => {
          console.error('An error occurred', err);
          error('Failed to load post data: ' + err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [edit]);

  const handlePublish = async () => {
    const token = localStorage.getItem('token');

    try {
      if (!title.trim()) {
        warning('Please enter a title');
        return;
      }
      if (!content.trim()) {
        warning('Please enter content');
        return;
      }
      const res = await fetch(
        isEditing
          ? `http://localhost:3000/posts/${edit}`
          : 'http://localhost:3000/posts',
        {
          method: isEditing ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, content, coverImage, summary, tags }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      success(isEditing ? 'Edited successful' : 'Post created successfully');
      setTimeout(() => router.push(`/post/${data._id}`), 300);
    } catch (err) {
      console.error(err);
      error('Failed to publish post: ' + (err as Error).message);
    }
  };

  if (loading) return <p className="p-10 text-muted-foreground">Getting post</p>;

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-8 grid grid-cols-12 gap-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="col-span-12 lg:col-span-8 space-y-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <TitleInput title={title} setTitle={setTitle} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Summary</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full border border-border bg-card text-card-foreground rounded p-2 min-h-[80px]"
            placeholder="Short summary of your post"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="w-full border border-border bg-card text-card-foreground rounded p-2 flex items-center gap-2 flex-wrap">
            {tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded bg-muted text-muted-foreground">
                #{tag}
                <button
                  type="button"
                  aria-label={`Remove ${tag}`}
                  className="ml-1 hover:text-foreground"
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
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
                  const parts = value.split(',').map((t) => t.trim()).filter(Boolean);
                  if (parts.length) {
                    setTags((prev) => Array.from(new Set([...prev, ...parts.map((t) => t.toLowerCase())])));
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
                    setTags((prev) => (prev.includes(value.toLowerCase()) ? prev : [...prev, value.toLowerCase()]));
                    setTagInput('');
                  }
                } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
                  setTags((prev) => prev.slice(0, -1));
                }
              }}
              onPaste={(e) => {
                const text = e.clipboardData.getData('text');
                if (text.includes(',')) {
                  e.preventDefault();
                  const parts = text.split(',').map((t) => t.trim()).filter(Boolean);
                  if (parts.length) {
                    setTags((prev) => Array.from(new Set([...prev, ...parts.map((t) => t.toLowerCase())])));
                  }
                }
              }}
              className="flex-1 min-w-[140px] outline-none bg-transparent"
              placeholder="Type a tag and press Enter or ,"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Press Enter or comma to add. Click × to remove.</p>
        </div>
        <CoverImageUploader
          coverImage={coverImage}
          setCoverImage={setCoverImage}
        />
        <div className="bg-card border border-border rounded-xl">
          <MarkdownEditor
            value={content}
            onChange={setContent}
            height="500px"
            mode="full"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={handlePublish}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            {isEditing ? 'Cập nhật' : 'Đăng bài'}
          </button>
        </div>
      </div>
      <div className="hidden lg:block col-span-12 lg:col-span-4 sticky top-10">
        <div className="bg-card border border-border rounded-xl p-3">
          <PostPreview
            title={title}
            coverImage={coverImage}
            content={content}
          />
        </div>
      </div>
    </div>
  );
}
