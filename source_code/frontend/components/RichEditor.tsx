'use client';
import { EditorContent, Editor } from '@tiptap/react';
import EditorMenu from './EditorMenu';

export default function RichEditor({ editor }: { editor: Editor | null }) {
    return (
        <div>
            <EditorMenu editor={editor} />
            <div className="prose prose-lg max-w-none border border-gray-300 rounded p-4 bg-white text-black min-h-[300px]">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}