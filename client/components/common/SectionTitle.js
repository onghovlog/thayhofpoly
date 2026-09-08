import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function SectionTitle({
  tag,
  title,
  description,
  align = 'left',
  actionLink,
  actionText,
}) {
  const isCenter = align === 'center';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isCenter ? 'center' : 'flex-start',
        textAlign: isCenter ? 'center' : 'left',
        marginBottom: '2.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: isCenter ? 'center' : 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          {tag && <span className="section-tag">{tag}</span>}
          <h2 className="section-title">{title}</h2>
          {description && <p className="section-desc">{description}</p>}
        </div>

        {actionLink && actionText && (
          <Link
            href={actionLink}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: 'var(--primary)',
              whiteSpace: 'nowrap',
            }}
          >
            <span>{actionText}</span>
            <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}
