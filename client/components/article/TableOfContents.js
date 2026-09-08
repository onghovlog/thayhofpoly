'use client';

import { List } from 'lucide-react';

const createHeadingId = (text) => {
  if (typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function TableOfContents({ content }) {
  if (!content) return null;

  // Trích xuất các tiêu đề ## và ### từ Markdown content
  const lines = content.split('\n');
  const headings = [];

  lines.forEach((line) => {
    const h2Match = line.match(/^##\s+(.+)$/);
    const h3Match = line.match(/^###\s+(.+)$/);

    if (h2Match) {
      const text = h2Match[1].replace(/[#*`_]/g, '').trim();
      headings.push({ level: 2, text, id: createHeadingId(text) });
    } else if (h3Match) {
      const text = h3Match[1].replace(/[#*`_]/g, '').trim();
      headings.push({ level: 3, text, id: createHeadingId(text) });
    }
  });

  if (headings.length < 2) return null;

  return (
    <div
      style={{
        padding: '1.25rem',
        backgroundColor: 'var(--bg-alt)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '2rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.95rem',
          fontWeight: 700,
          color: 'var(--secondary)',
          marginBottom: '0.85rem',
        }}
      >
        <List size={18} color="var(--primary)" />
        <span>Mục lục nội dung</span>
      </div>

      <nav aria-label="Mục lục bài viết">
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {headings.map((h, index) => (
            <li
              key={index}
              style={{
                paddingLeft: h.level === 3 ? '1rem' : '0',
                fontSize: h.level === 3 ? '0.86rem' : '0.92rem',
              }}
            >
              <a
                href={`#${h.id}`}
                style={{
                  color: 'var(--text-main)',
                  lineHeight: 1.4,
                  display: 'inline-block',
                  transition: 'color 0.15s ease',
                }}
                className="toc-link"
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
