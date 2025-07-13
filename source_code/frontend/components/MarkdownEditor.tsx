import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import 'react-markdown-editor-lite/lib/index.css';

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

export default function MarkdownEditor({ value, onChange, height = '300px' }: MarkdownEditorProps) {
  return (
    <MdEditor
      value={value}
      style={{ height }}
      renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
      onChange={({ text }) => onChange(text)}
    />
  );
}
