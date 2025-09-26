"use client";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { useTheme } from "../hooks/useTheme";

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
  const { theme } = useTheme();

  return (
    <div
      data-color-mode={theme === "light" ? "d" : "light"}
      style={{ height }}
      className="rounded-md overflow-hidden"
    >
      <MDEditor
        key={theme} 
        value={value}
        onChange={(val) => onChange(val || "")}
        height={parseInt(height)}
        hideToolbar={isSimple}
        preview={isSimple ? "edit" : "live"}
      />
    </div>
  );
}
