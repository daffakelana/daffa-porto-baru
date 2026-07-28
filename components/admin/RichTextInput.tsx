"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { useEffect } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const btn = (active: boolean) =>
    `px-2 py-0.5 rounded label-3 border transition-colors ${
      active
        ? "bg-[var(--background-color-hover)] border-[var(--primary-base)]"
        : "border-[var(--divider-color)] hover:bg-[var(--background-color-hover)]"
    }`;

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL:", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b p-1.5 border-[var(--divider-color)]">
      <button type="button" className={btn(editor.isActive("bold"))}
        onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
      <button type="button" className={btn(editor.isActive("italic"))}
        onClick={() => editor.chain().focus().toggleItalic().run()}><em>i</em></button>
      <button type="button" className={btn(editor.isActive("bulletList"))}
        onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
      <button type="button" className={btn(editor.isActive("orderedList"))}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
      <button type="button" className={btn(editor.isActive("link"))}
        onClick={setLink}>Link</button>
        <span className="mx-1 h-4 w-px bg-[var(--divider-color)]" />

      {[
        { label: "Default (body)", value: null },
        { label: "Hitam", value: "var(--text-color-default)" },
        { label: "Primary", value: "var(--primary-base)" },
        { label: "Merah", value: "#DC2626" },
        { label: "Hijau", value: "#059669" },
        { label: "Kuning", value: "#D97706" },
      ].map((c) => (
        <button
          key={c.label}
          type="button"
          title={c.label}
          onClick={() =>
            c.value
              ? editor.chain().focus().setColor(c.value).run()
              : editor.chain().focus().unsetColor().run()
          }
          className="size-5 rounded-full border border-[var(--divider-color)]"
          style={{
            backgroundColor: c.value ?? "var(--text-color-default)",
          }}
        />
      ))}
    </div>
  );
}

export function RichTextInput({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      Link.configure({ openOnClick: false, autolink: false }),
      TextStyle,
      Color,
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "rich-text body-1 min-h-[80px] px-3 py-2 outline-none text-[var(--text-color-default)]",
        "data-placeholder": placeholder ?? "",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Sinkronkan bila value diganti dari luar (mis. ganti section).
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="rounded-md border bg-[var(--background-color-white)] border-[var(--divider-color)]">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

export default RichTextInput;