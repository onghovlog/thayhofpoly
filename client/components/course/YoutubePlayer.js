'use client';

import { useState } from 'react';
import { Play, ChevronLeft, ChevronRight, Download, FileText, Youtube, ExternalLink, Clock, CheckCircle2 } from 'lucide-react';

export default function YoutubePlayer({
  lessons = [],
  playlistId,
  playlistUrl,
  title,
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Danh sách bài học chuẩn hóa
  const lessonList = lessons && lessons.length > 0
    ? lessons
    : playlistId
      ? [{
          order: 1,
          title: title || 'Bài giảng tổng hợp',
          videoId: playlistId,
          youtubeUrl: playlistUrl || `https://www.youtube.com/playlist?list=${playlistId}`,
          thumbnail: `https://i.ytimg.com/vi/${playlistId}/hqdefault.jpg`,
          duration: 'Tự học theo tiến độ',
          fileName: '',
          fileUrl: '',
        }]
      : [];

  const currentLesson = lessonList[activeIndex] || lessonList[0];
  const totalLessons = lessonList.length;

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < totalLessons - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  if (!currentLesson) {
    return (
      <div
        style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <p style={{ color: '#94A3B8', fontSize: '1.05rem' }}>Đang cập nhật video bài giảng cho khóa học này...</p>
      </div>
    );
  }

  // URL nhúng video YouTube
  const isPlaylistOnly = !lessons || lessons.length === 0;
  const embedSrc = isPlaylistOnly && playlistId
    ? `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&rel=0`
    : `https://www.youtube-nocookie.com/embed/${currentLesson.videoId}?rel=0`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      {/* 1. Video Player Container */}
      <div
        style={{
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          backgroundColor: '#000000',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border)',
        }}
      >
        <div className="video-responsive">
          <iframe
            src={embedSrc}
            title={currentLesson.title || title || 'Bài giảng'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>

        {/* Player Controls & Lesson Quick Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '1rem 1.25rem',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Active Lesson Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '240px', flex: 1 }}>
            <span
              style={{
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
              }}
            >
              Bài {activeIndex + 1}/{totalLessons}
            </span>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#F8FAFC', lineHeight: 1.3 }}>
              {currentLesson.title}
            </div>
          </div>

          {/* Navigation & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className="btn btn-outline btn-sm"
              style={{
                color: activeIndex === 0 ? '#475569' : '#FFFFFF',
                borderColor: activeIndex === 0 ? '#334155' : 'rgba(255, 255, 255, 0.3)',
                padding: '0.45rem 0.85rem',
                fontSize: '0.82rem',
                cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronLeft size={16} />
              <span>Bài trước</span>
            </button>

            <button
              onClick={handleNext}
              disabled={activeIndex >= totalLessons - 1}
              className="btn btn-primary btn-sm"
              style={{
                padding: '0.45rem 0.85rem',
                fontSize: '0.82rem',
                opacity: activeIndex >= totalLessons - 1 ? 0.5 : 1,
                cursor: activeIndex >= totalLessons - 1 ? 'not-allowed' : 'pointer',
              }}
            >
              <span>Bài sau</span>
              <ChevronRight size={16} />
            </button>

            {currentLesson.youtubeUrl && (
              <a
                href={currentLesson.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
                title="Mở video trên YouTube"
                style={{
                  color: '#CBD5E1',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '0.45rem 0.75rem',
                  fontSize: '0.82rem',
                }}
              >
                <Youtube size={15} color="#EF4444" />
                <span className="hide-mobile">YouTube</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 2. File tài liệu đính kèm (nếu có ở bài học hiện tại) */}
      {(currentLesson.fileName || currentLesson.fileUrl) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '0.85rem 1.25rem',
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: 'var(--radius)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText size={18} color="#2563EB" />
            <div>
              <span style={{ fontSize: '0.82rem', color: '#1E40AF', fontWeight: 700, textTransform: 'uppercase' }}>
                Tài liệu đính kèm bài học:
              </span>
              <span style={{ fontSize: '0.9rem', color: '#1E3A8A', fontWeight: 600, marginLeft: '0.5rem' }}>
                {currentLesson.fileName || 'Tài liệu thực hành đính kèm'}
              </span>
            </div>
          </div>

          <a
            href={currentLesson.fileUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-primary btn-sm"
            style={{ fontSize: '0.82rem', backgroundColor: '#FFFFFF' }}
          >
            <Download size={14} />
            <span>Tải tài liệu</span>
          </a>
        </div>
      )}

      {/* 3. Danh sách TẤT CẢ bài học trong khóa học */}
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: '#FFFFFF',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--bg-alt)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--secondary)', fontWeight: 700 }}>
              Danh sách bài học
            </h3>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--primary)',
                backgroundColor: 'var(--primary-light)',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {totalLessons} bài học
            </span>
          </div>

          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Click vào bài bất kỳ để xem
          </span>
        </div>

        <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
          {lessonList.map((lesson, idx) => {
            const isPlaying = activeIndex === idx;
            const lessonThumb = lesson.thumbnail || (lesson.videoId ? `https://i.ytimg.com/vi/${lesson.videoId}/hqdefault.jpg` : '');

            return (
              <button
                key={lesson._id || idx}
                onClick={() => setActiveIndex(idx)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  border: 'none',
                  borderBottom: '1px solid var(--border)',
                  backgroundColor: isPlaying ? 'var(--primary-light)' : '#FFFFFF',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                  {/* Thumbnail Preview */}
                  <div
                    style={{
                      width: '4.5rem',
                      height: '2.8rem',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      backgroundColor: '#0F172A',
                      flexShrink: 0,
                      position: 'relative',
                    }}
                  >
                    {lessonThumb ? (
                      <img
                        src={lessonThumb}
                        alt={lesson.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#FFFFFF' }}>
                        <Play size={14} />
                      </div>
                    )}
                    {isPlaying && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'rgba(234, 88, 12, 0.65)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                        }}
                      >
                        <Play size={16} />
                      </div>
                    )}
                  </div>

                  {/* Title & Info */}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: isPlaying ? 'var(--primary-hover)' : 'var(--text-muted)',
                        }}
                      >
                        Bài {idx + 1}
                      </span>
                      {isPlaying && (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            backgroundColor: 'var(--primary)',
                            color: '#FFFFFF',
                            padding: '0.05rem 0.35rem',
                            borderRadius: '3px',
                          }}
                        >
                          Đang phát
                        </span>
                      )}
                      {lesson.fileName && (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            color: '#2563EB',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                          }}
                          title={`Có file đính kèm: ${lesson.fileName}`}
                        >
                          <FileText size={11} />
                          <span>File</span>
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: isPlaying ? 700 : 500,
                        color: isPlaying ? 'var(--primary-hover)' : 'var(--secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {lesson.title}
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  <Clock size={13} />
                  <span>{lesson.duration || '15:00'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
