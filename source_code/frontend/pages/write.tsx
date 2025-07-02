'use client';

import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import CodeBlock from '@tiptap/extension-code-block';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';

import EditorMenu from '../components/EditorMenu';
import Navbar from '../components/Navbar';

export default function WritePage() {
  const [title, setTitle] = useState('');

  const editor = useEditor({
    extensions: [StarterKit, Image, CodeBlock, Link, Youtube],
    content: '<p>Start writing your story...</p>',
  });

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-16">
        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          className="w-full text-4xl font-bold text-foreground placeholder-muted-foreground bg-transparent border-none focus:outline-none mb-6"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Toolbar */}
        <EditorMenu editor={editor} />

        {/* Editor */}
        <div className="prose max-w-none border border-border rounded p-4 min-h-[300px] bg-white text-black">
          <EditorContent editor={editor} />
        </div>

        {/* Publish Button */}
        <div className="mt-8 flex justify-end">
          <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition">
            Publish
          </button>
        </div>
      </div>
    </>
  );
}
