'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import CodeBlock from '@tiptap/extension-code-block';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';

import TitleInput from '../components/TitleInput';
import CoverImageUploader from '../components/CoverImageUploader';
import RichEditor from '../components/RichEditor';
import PostPreview from '../components/PostPreview';

export default function WritePage() {
  const router = useRouter();
  const { edit } = router.query; // lấy postId nếu có

  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Image, CodeBlock, Link, Youtube],
    content: '<p>Hãy bắt đầu viết câu chuyện của bạn...</p>',
  });

  useEffect(() => {
    if (edit) {
      setIsEditing(true);
      setLoading(true);

      fetch(`http://localhost:3000/posts/${edit}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title);
          setCoverImage(data.coverImage || '');
          editor?.commands.setContent(data.content);
        })
        .catch((err) => {
          console.error('Lỗi tải bài viết:', err);
          alert('Không thể tải bài viết để chỉnh sửa');
        })
        .finally(() => setLoading(false));
    }
  }, [edit, editor]);

  const handlePublish = async () => {
    const content = editor?.getHTML();
    const token = localStorage.getItem('token');

    try {
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
          body: JSON.stringify({ title, content, coverImage }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert(isEditing ? 'Đã cập nhật bài viết' : 'Đăng bài thành công');
      router.push(`/post/${data._id}`);
    } catch (err) {
      console.error(err);
      alert('Có lỗi khi đăng hoặc cập nhật bài viết');
    }
  };

  if (loading) return <p className="p-10 text-gray-500">Đang tải bài viết...</p>;

  return (
    <div className="min-h-screen bg-white text-black px-8 py-10 grid grid-cols-12 gap-10">
      <div className="col-span-8 space-y-8">
        <TitleInput title={title} setTitle={setTitle} />
        <CoverImageUploader coverImage={coverImage} setCoverImage={setCoverImage} />
        <RichEditor editor={editor} />
        <div className="flex justify-end">
          <button
            onClick={handlePublish}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            {isEditing ? 'Cập nhật' : 'Đăng bài'}
          </button>
        </div>
      </div>
      <div className="col-span-4 sticky top-10">
        <PostPreview title={title} coverImage={coverImage} content={editor?.getText() || ''} />
      </div>
    </div>
  );
}
