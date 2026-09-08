'use client';

import { useState } from 'react';
import { Youtube, ExternalLink, Play } from 'lucide-react';

export default function YoutubePlayer({
  playlistId,
  playlistUrl,
  title,
  syllabus = [],
}) {
  const [activeVideoId, setActiveVideoId] = useState(null);

  if (!playlistId) {
    return (
      <div
        style={{
          padding: '2.5rem',
          textAlign: 'center',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <p>Đang cập nhật video bài giảng cho khóa học này...</p>
      </div>
    );
  }

  // URL nhúng playlist hoặc video đơn
  const embedSrc = activeVideoId
    ? `https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&rel=0`
    : `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&rel=0`;

  const externalUrl = playlistUrl || `https://www.youtube.com/playlist?list=${playlistId}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {/* 16:9 Responsive Video Iframe */}
      <div className="video-responsive">
        <iframe
          src={embedSrc}
          title={title || 'YouTube Video Player'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>

      {/* Player Header / Action Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          padding: '0.85rem 1.25rem',
          backgroundColor: 'var(--bg-alt)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--secondary)', fontWeight: 600 }}>
          <Youtube size={18} color="#EF4444" />
          <span>Bài giảng trực tiếp từ Playlist YouTube chính thức</span>
        </div>

        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline btn-sm"
          style={{ fontSize: '0.82rem' }}
        >
          <span>Mở trên YouTube</span>
          <ExternalLink size={13} />
        </a>
      </div>

      {/* Syllabus / Video List Selector if available */}
      {syllabus && syllabus.length > 0 && (
        <div
          style={{
            marginTop: '1rem',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '0.85rem 1.25rem',
              backgroundColor: 'var(--bg-alt)',
              borderBottom: '1px solid var(--border)',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: 'var(--secondary)',
            }}
          >
            Danh sách bài học trong khóa ({syllabus.length} bài)
          </div>

          <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
            {syllabus.map((item, idx) => {
              const isSelected = activeVideoId === item.videoId;
              return (
                <button
                  key={idx}
                  onClick={() => item.videoId && setActiveVideoId(item.videoId)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    border: 'none',
                    borderBottom: '1px solid var(--border)',
                    backgroundColor: isSelected ? 'var(--primary-light)' : '#FFFFFF',
                    color: isSelected ? 'var(--primary-hover)' : 'var(--secondary)',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.88rem',
                    textAlign: 'left',
                    cursor: item.videoId ? 'pointer' : 'default',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Play size={14} color={isSelected ? 'var(--primary)' : 'var(--text-muted)'} />
                    <span>Bài {idx + 1}: {item.title}</span>
                  </div>
                  {item.duration && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {item.duration}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
