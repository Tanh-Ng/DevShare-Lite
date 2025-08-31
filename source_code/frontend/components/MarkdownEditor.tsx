"use client"; // nếu dùng app directory
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  mode?: "full" | "simple";
}

export default function MarkdownEditor({
  value,
  onChange,
  height = "300px",
  mode = "full",
}: MarkdownEditorProps) {
  const isSimple = mode === "simple";

  return (
    <div data-color-mode="light" style={{ height }}>
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || "")}
        height={parseInt(height)} 
        hideToolbar={isSimple}
        preview={isSimple ? "edit" : "live"}
      />
    </div>
  );
}
