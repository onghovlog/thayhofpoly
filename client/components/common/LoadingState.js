export default function LoadingState({ count = 3, type = 'card' }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        width: '100%',
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={{
            backgroundColor: 'var(--bg-main)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            height: type === 'card' ? '360px' : '180px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Skeleton Thumbnail */}
          <div
            style={{
              width: '100%',
              height: '180px',
              backgroundColor: '#F1F5F9',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
          {/* Skeleton Text */}
          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
            <div
              style={{
                width: '30%',
                height: '1rem',
                backgroundColor: '#F1F5F9',
                borderRadius: 'var(--radius-sm)',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
            <div
              style={{
                width: '90%',
                height: '1.3rem',
                backgroundColor: '#F1F5F9',
                borderRadius: 'var(--radius-sm)',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
            <div
              style={{
                width: '70%',
                height: '0.9rem',
                backgroundColor: '#F1F5F9',
                borderRadius: 'var(--radius-sm)',
                animation: 'pulse 1.5s ease-in-out infinite',
                marginTop: 'auto',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
