'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Helper tạo ID từ text tiêu đề cho Anchor / Table of Contents
const createHeadingId = (text) => {
  if (typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function MarkdownViewer({ content }) {
  if (!content) return null;

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2({ node, children, ...props }) {
            const headingText = String(children);
            const id = createHeadingId(headingText);
            return (
              <h2 id={id} {...props}>
                {children}
              </h2>
            );
          },
          h3({ node, children, ...props }) {
            const headingText = String(children);
            const id = createHeadingId(headingText);
            return (
              <h3 id={id} {...props}>
                {children}
              </h3>
            );
          },
          table({ node, children, ...props }) {
            return (
              <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
                <table {...props}>{children}</table>
              </div>
            );
          },
          a({ node, children, href, ...props }) {
            const isExternal = href?.startsWith('http');
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                style={{ color: 'var(--primary)', textDecoration: 'underline', fontWeight: 500 }}
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
