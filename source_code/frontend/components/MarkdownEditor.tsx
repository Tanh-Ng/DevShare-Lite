import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import 'react-markdown-editor-lite/lib/index.css';

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), { ssr: false });

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    height?: string;
    mode?: 'full' | 'simple'; // 👈 thêm prop để chọn chế độ
}

export default function MarkdownEditor({
    value,
    onChange,
    height = '300px',
    mode = 'full', // default là full
}: MarkdownEditorProps) {
    const isSimple = mode === 'simple';

    return (
        <MdEditor
            value={value}
            style={{ height }}
            config={{
                view: {
                    menu: !isSimple,
                    md: true,
                    html: !isSimple,
                },
            }}
            renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
            onChange={({ text }) => onChange(text)}
        />
    );
}
