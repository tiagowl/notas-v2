"use client";

import { Box } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { markdownSanitizeSchema } from "@/lib/markdown/sanitize-schema";
import { isHtmlContent } from "@/lib/utils/content-format";
import type { Components } from "react-markdown";
import type { PluggableList } from "unified";
import { CodeBlock } from "./CodeBlock";

interface MarkdownContentProps {
  content: string;
  maxW?: string;
}

const markdownStyles = {
  "& h1, & h2, & h3, & h4": { mt: 8, mb: 3, fontWeight: 700, lineHeight: 1.3 },
  "& h1": { fontSize: "1.875rem", pb: 2, borderBottomWidth: "1px", borderColor: "border.emphasized" },
  "& h2": { fontSize: "1.5rem" },
  "& h3": { fontSize: "1.25rem" },
  "& h4": { fontSize: "1.1rem" },
  "& p": { mb: 4, lineHeight: 1.8 },
  "& ul, & ol": { pl: 6, mb: 4 },
  "& li": { mb: 1.5, lineHeight: 1.7 },
  "& li > p": { mb: 1 },
  "& blockquote": {
    borderLeftWidth: "4px",
    borderColor: "var(--chakra-colors-blue-500)",
    pl: 4,
    py: 1,
    my: 4,
    color: "fg.muted",
    fontStyle: "italic",
    bg: "bg.subtle",
    borderRadius: "md",
  },
  "& hr": { my: 8, borderColor: "border.emphasized" },
  "& table": {
    width: "100%",
    mb: 4,
    fontSize: "sm",
    borderCollapse: "collapse",
    display: "block",
    overflowX: "auto",
  },
  "& th, & td": {
    borderWidth: "1px",
    borderColor: "border.emphasized",
    p: 2,
    textAlign: "left",
  },
  "& th": { bg: "bg.subtle", fontWeight: 600 },
  "& tr:nth-of-type(even) td": { bg: "bg.subtle" },
  "& a": { color: "blue.500", textDecoration: "underline" },
  "& pre": { mb: 4, borderRadius: "md", overflow: "auto" },
  "& code:not(pre code)": {
    bg: "bg.subtle",
    px: 1.5,
    py: 0.5,
    borderRadius: "sm",
    fontSize: "0.9em",
    fontFamily: "mono",
  },
  "& img": { maxW: "100%", borderRadius: "md", my: 4 },
  "& strong": { fontWeight: 600 },
};

const sharedComponents: Components = {
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  pre: ({ children }) => <>{children}</>,
  code: ({ className, children }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <CodeBlock className={className}>{String(children).replace(/\n$/, "")}</CodeBlock>
      );
    }
    return <code className={className}>{children}</code>;
  },
};

export function MarkdownContent({ content, maxW = "65ch" }: MarkdownContentProps) {
  const asHtml = isHtmlContent(content);

  const sanitizePlugin = [rehypeSanitize, { schema: markdownSanitizeSchema }] as PluggableList[number];

  const rehypePlugins: PluggableList = asHtml
    ? [rehypeRaw, rehypeHighlight, sanitizePlugin]
    : [rehypeHighlight, sanitizePlugin];

  const remarkPlugins = asHtml ? [remarkGfm] : [remarkGfm, remarkBreaks];

  return (
    <Box className="markdown-body" maxW={maxW} mx="auto" css={markdownStyles}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={sharedComponents}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}
