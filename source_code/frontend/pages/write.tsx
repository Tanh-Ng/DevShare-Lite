'use client';

import { useState } from 'react';
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
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const editor = useEditor({
    extensions: [StarterKit, Image, CodeBlock, Link, Youtube],
    content: '<p>Hãy bắt đầu viết câu chuyện của bạn...</p>',
  });

  const handlePublish = async () => {
    const content = editor?.getHTML();
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // JWT để xác thực
        },
        body: JSON.stringify({
          title,
          content,
          coverImage,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert(' Đăng bài thành công!');
      // Ví dụ redirect về trang chi tiết bài viết
      // router.push(`/posts/${data.id}`);
    } catch (err) {
      console.error(err);
      alert('Có lỗi khi đăng bài');
    }
  };

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
            Publish
          </button>
        </div>
      </div>
      <div className="col-span-4 sticky top-10">
        <PostPreview title={title} coverImage={coverImage} content={editor?.getText() || ''} />
      </div>
    </div>
  );
}
