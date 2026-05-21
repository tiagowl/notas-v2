"use client";

import { Box, Flex, IconButton, Separator } from "@chakra-ui/react";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useCallback } from "react";
import {
  LuBold,
  LuCode,
  LuHeading2,
  LuHeading3,
  LuItalic,
  LuLink,
  LuList,
  LuListOrdered,
  LuQuote,
  LuRedo,
  LuStrikethrough,
  LuUnderline,
  LuUndo,
} from "react-icons/lu";
import { Markdown } from "tiptap-markdown";

interface RichTextEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  minHeight?: string;
}

function ToolbarButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <IconButton
      aria-label={label}
      title={label}
      size="sm"
      variant={active ? "solid" : "ghost"}
      colorPalette={active ? "blue" : undefined}
      onClick={onClick}
    >
      {children}
    </IconButton>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Escreva ou cole o conteúdo da nota…",
  minHeight = "280px",
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Placeholder.configure({ placeholder }),
      Markdown.configure({
        html: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: value,
    contentType: "markdown",
    onUpdate: ({ editor: ed }) => {
      const md = ed.storage.markdown.getMarkdown();
      onChange(md);
    },
    editorProps: {
      attributes: {
        class: "tiptap-editor",
      },
    },
  });

  const syncExternalValue = useCallback(() => {
    if (!editor) return;
    const current = editor.storage.markdown.getMarkdown();
    if (value.trim() === current.trim()) return;
    editor.commands.setContent(value || "", { contentType: "markdown" });
  }, [editor, value]);

  useEffect(() => {
    if (!editor || editor.isFocused) return;
    syncExternalValue();
  }, [editor, value, syncExternalValue]);

  if (!editor) {
    return (
      <Box
        minH={minHeight}
        borderWidth="1px"
        borderRadius="md"
        borderColor="border.emphasized"
        p={4}
        color="fg.muted"
      >
        Carregando editor…
      </Box>
    );
  }

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL do link", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      borderColor="border.emphasized"
      overflow="hidden"
      bg="bg.panel"
    >
      <Flex
        wrap="wrap"
        gap={0.5}
        p={2}
        borderBottomWidth="1px"
        borderColor="border.emphasized"
        bg="bg.subtle"
        align="center"
      >
        <ToolbarButton
          label="Negrito"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <LuBold />
        </ToolbarButton>
        <ToolbarButton
          label="Itálico"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <LuItalic />
        </ToolbarButton>
        <ToolbarButton
          label="Sublinhado"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <LuUnderline />
        </ToolbarButton>
        <ToolbarButton
          label="Riscado"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <LuStrikethrough />
        </ToolbarButton>
        <Separator orientation="vertical" h="6" mx={1} />
        <ToolbarButton
          label="Título 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <LuHeading2 />
        </ToolbarButton>
        <ToolbarButton
          label="Título 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <LuHeading3 />
        </ToolbarButton>
        <Separator orientation="vertical" h="6" mx={1} />
        <ToolbarButton
          label="Lista"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <LuList />
        </ToolbarButton>
        <ToolbarButton
          label="Lista numerada"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <LuListOrdered />
        </ToolbarButton>
        <ToolbarButton
          label="Citação"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <LuQuote />
        </ToolbarButton>
        <ToolbarButton
          label="Código"
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <LuCode />
        </ToolbarButton>
        <ToolbarButton label="Link" active={editor.isActive("link")} onClick={setLink}>
          <LuLink />
        </ToolbarButton>
        <Separator orientation="vertical" h="6" mx={1} />
        <ToolbarButton
          label="Desfazer"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <LuUndo />
        </ToolbarButton>
        <ToolbarButton
          label="Refazer"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <LuRedo />
        </ToolbarButton>
      </Flex>
      <Box
        px={4}
        py={3}
        minH={minHeight}
        css={{
          "& .tiptap-editor": {
            outline: "none",
            minHeight: minHeight,
            lineHeight: 1.65,
            fontSize: "0.95rem",
          },
          "& .tiptap-editor p.is-editor-empty:first-child::before": {
            color: "var(--chakra-colors-fg-muted)",
            content: "attr(data-placeholder)",
            float: "left",
            height: 0,
            pointerEvents: "none",
          },
          "& .tiptap-editor h1": { fontSize: "1.5rem", fontWeight: 700, mt: 4, mb: 2 },
          "& .tiptap-editor h2": { fontSize: "1.25rem", fontWeight: 700, mt: 3, mb: 2 },
          "& .tiptap-editor h3": { fontSize: "1.1rem", fontWeight: 600, mt: 3, mb: 2 },
          "& .tiptap-editor p": { mb: 2 },
          "& .tiptap-editor ul, & .tiptap-editor ol": { pl: 6, mb: 2 },
          "& .tiptap-editor blockquote": {
            borderLeftWidth: "3px",
            borderColor: "var(--chakra-colors-blue-500)",
            pl: 3,
            color: "var(--chakra-colors-fg-muted)",
            fontStyle: "italic",
          },
          "& .tiptap-editor pre": {
            bg: "bg.emphasized",
            p: 3,
            borderRadius: "md",
            fontFamily: "mono",
            fontSize: "0.85rem",
            overflow: "auto",
            mb: 2,
          },
          "& .tiptap-editor code": {
            bg: "bg.subtle",
            px: 1,
            borderRadius: "sm",
            fontFamily: "mono",
            fontSize: "0.9em",
          },
          "& .tiptap-editor pre code": { bg: "transparent", p: 0 },
          "& .tiptap-editor a": {
            color: "var(--chakra-colors-blue-500)",
            textDecoration: "underline",
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}
