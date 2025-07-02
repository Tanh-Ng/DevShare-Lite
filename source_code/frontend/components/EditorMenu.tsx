'use client';

import { Editor } from '@tiptap/react';

interface Props {
    editor: Editor | null;
}

export default function EditorMenu({ editor }: Props) {
    if (!editor) return null;

    const addImage = () => {
        const url = prompt('Enter image URL');
        if (url) editor.chain().focus().setImage({ src: url }).run();
    };

    const addYouTube = () => {
        const url = prompt('Enter YouTube URL');
        if (url)
            editor
                .chain()
                .focus()
                .setYoutubeVideo({
                    src: url,
                    width: 640,
                    height: 360,
                })
                .run();
    };

    return (
        <div className="flex flex-wrap gap-2 mb-4 border-b pb-2 border-border">
            <button onClick={() => editor.chain().focus().toggleBold().run()} className="btn">
                <b>B</b>
            </button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className="btn">
                <i>I</i>
            </button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="btn">
                H1
            </button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="btn">
                H2
            </button>
            <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className="btn">
                {'</>'}
            </button>
            <button onClick={addImage} className="btn">
                🖼️
            </button>
            <button onClick={addYouTube} className="btn">
                📹
            </button>
        </div>
    );
}
