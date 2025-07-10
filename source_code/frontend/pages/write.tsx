'use client';

import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import CodeBlock from '@tiptap/extension-code-block';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';

import EditorMenu from '../components/EditorMenu';

export default function WritePage() {
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const editor = useEditor({
    extensions: [StarterKit, Image, CodeBlock, Link, Youtube],
    content: '<p>Hãy bắt đầu viết câu chuyện của bạn...</p>',
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const res = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setCoverImage(data.url);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handlePublish = () => {
    const content = editor?.getHTML();
    console.log({ title, coverImage, content });
    // TODO: Gửi lên backend
  };

  const formattedDate = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-white text-black px-8 py-10 grid grid-cols-12 gap-10">
      {/* Vùng viết bài: chiếm 8 cột */}
      <div className="col-span-8 space-y-8">
        {/* Tiêu đề */}
        <div>
          <input
            type="text"
            placeholder="Tiêu đề bài viết..."
            className="w-full text-4xl font-bold placeholder-gray-400 border-b-2 border-gray-200 focus:border-blue-500 bg-transparent py-2 focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Ảnh bìa */}
        <div>
          {coverImage ? (
            <img src={coverImage} alt="Cover" className="w-full rounded-xl shadow mb-4" />
          ) : (
            <div className="border border-dashed border-gray-400 rounded p-6 text-center text-gray-500">
              {uploading ? 'Đang tải ảnh...' : 'Chưa chọn ảnh bìa'}
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2"
          />
        </div>

        {/* Editor */}
        <div>
          <EditorMenu editor={editor} />
          <div className="prose prose-lg max-w-none border border-gray-300 rounded p-4 bg-white text-black min-h-[300px]">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Nút Publish */}
        <div className="flex justify-end">
          <button
            onClick={handlePublish}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Publish
          </button>
        </div>
      </div>

      {/* Xem trước: chiếm 4 cột */}
      <div className="col-span-4 sticky top-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">🧪 Xem trước</h2>
        <div className="border p-4 rounded-xl shadow-md">
          {coverImage && (
            <img
              src={coverImage}
              alt="Preview"
              className="w-full h-40 object-cover rounded mb-3"
            />
          )}
          <h3 className="text-xl font-bold text-blue-600 mb-1">
            {title || 'Tiêu đề...'}
          </h3>
          <p className="text-gray-600 line-clamp-3 mb-2">
            {editor?.getText() || 'Tóm tắt bài viết'}
          </p>
          <div className="text-sm text-gray-500">
            👤 Tác giả: <span className="font-medium">Bạn</span> • 🗓️ {formattedDate}
          </div>
        </div>
      </div>
    </div>
  );
}
