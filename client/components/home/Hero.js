'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Palette,
  Code2,
  Users,
  CheckCircle2,
  Laptop,
  Send,
  X,
  PhoneCall,
  Flame,
  Award,
} from 'lucide-react';

const SLIDES = [
  {
    id: 'design',
    badge: '🎨 Khoá học Thiết kế Đồ họa & UI/UX',
    badgeBg: 'rgba(234, 88, 12, 0.1)',
    badgeColor: '#EA580C',
    titlePrefix: 'Học thiết kế',
    titleHighlight: 'cùng Thầy Hộ.',
    description:
      'Làm chủ Photoshop, Illustrator, Figma & Tư duy thị giác thực chiến. Học từ con số 0 đến hoàn thiện sản phẩm Portfolio chuyên nghiệp chuẩn doanh nghiệp.',
    primaryCta: {
      text: 'Khám phá môn Thiết kế',
      href: '/chu-de/ui-ux-design',
    },
    secondaryCta: {
      text: 'Xem tất cả khoá học',
      href: '/khoa-hoc?category=ui-ux-design',
    },
    image: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Học thiết kế UI/UX cùng Thầy Hộ',
    floatingBadges: [
      {
        icon: Palette,
        iconColor: '#EA580C',
        title: 'Figma & Photoshop',
        desc: 'Thực chiến 100% dự án',
        position: 'top-right',
      },
      {
        icon: Award,
        iconColor: '#16A34A',
        title: 'Xây dựng Portfolio',
        desc: 'Tự tin ứng tuyển ngay',
        position: 'bottom-left',
      },
    ],
  },
  {
    id: 'vibe-coding',
    badge: '⚡ Xu hướng Vibe Coding & Web Hiện Đại',
    badgeBg: 'rgba(37, 99, 235, 0.1)',
    badgeColor: '#2563EB',
    titlePrefix: 'Học vibe coding',
    titleHighlight: 'cùng Thầy Hộ.',
    description:
      'Lập trình web thời đại AI cực nhanh với HTML, CSS, JavaScript, React & Next.js. Học tư duy giải quyết vấn đề, kết hợp AI Coding để biến ý tưởng thành sản phẩm thực tế.',
    primaryCta: {
      text: 'Khám phá môn Lập trình Web',
      href: '/chu-de/lap-trinh-web',
    },
    secondaryCta: {
      text: 'Xem lộ trình Frontend',
      href: '/lo-trinh',
    },
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Học Vibe Coding cùng Thầy Hộ',
    floatingBadges: [
      {
        icon: Code2,
        iconColor: '#2563EB',
        title: 'Vibe Coding + AI',
        desc: 'Tăng tốc độ làm web x5',
        position: 'top-right',
      },
      {
        icon: Laptop,
        iconColor: '#EA580C',
        title: 'Next.js & React',
        desc: 'Full-stack công nghệ mới',
        position: 'bottom-left',
      },
    ],
  },
  {
    id: 'one-on-one',
    badge: '🎯 Huấn luyện Kèm Cặp Riêng Biệt',
    badgeBg: 'rgba(5, 150, 105, 0.1)',
    badgeColor: '#059669',
    titlePrefix: 'Học 1 kèm 1',
    titleHighlight: 'cùng Thầy Hộ.',
    description:
      'Chương trình Coaching 1-on-1 theo sát lộ trình cá nhân hóa. Sửa đồ án tốt nghiệp, giải bài tập lab thực tế, định hướng nghề nghiệp và cam kết làm được việc ngay.',
    primaryCta: {
      text: 'Đăng ký tư vấn 1 kèm 1',
      isModal: true,
    },
    secondaryCta: {
      text: 'Liên hệ tư vấn chi tiết',
      href: '/lien-he',
    },
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Học 1 kèm 1 cùng Thầy Hộ',
    floatingBadges: [
      {
        icon: Users,
        iconColor: '#059669',
        title: 'Coaching 1-on-1',
        desc: 'Kèm cặp trực tiếp từng buổi',
        position: 'top-right',
      },
      {
        icon: CheckCircle2,
        iconColor: '#2563EB',
        title: 'Cam kết đầu ra',
        desc: 'Làm chủ kỹ năng thực tế',
        position: 'bottom-left',
      },
    ],
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('1-on-1');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: 'Học 1 kèm 1 cùng Thầy Hộ',
    note: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Auto-play timer
  useEffect(() => {
    if (isPaused || isModalOpen) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused, isModalOpen]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const openRegistrationModal = (defaultCourse = 'Học 1 kèm 1 cùng Thầy Hộ') => {
    setFormData((prev) => ({ ...prev, course: defaultCourse }));
    setFormSubmitted(false);
    setIsModalOpen(true);
  };

  const handleSubmitRegistration = (e) => {
    e.preventDefault();
    setFormLoading(true);

    // Simulate API registration call
    setTimeout(() => {
      setFormLoading(false);
      setFormSubmitted(true);
    }, 600);
  };

  const current = SLIDES[currentSlide];

  return (
    <section
      className="hero-slider-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container">
        {/* Slider Frame */}
        <div className="hero-slider-wrapper">
          {SLIDES.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slide.id}
                className={`hero-slide ${isActive ? 'active' : ''}`}
                aria-hidden={!isActive}
              >
                <div className="hero-grid">
                  {/* Left Column: Text & CTA */}
                  <div className="hero-content">
                    {/* Badge Pill */}
                    <div
                      className="hero-pill"
                      style={{
                        backgroundColor: slide.badgeBg,
                        color: slide.badgeColor,
                      }}
                    >
                      <Sparkles size={14} />
                      <span>{slide.badge}</span>
                    </div>

                    {/* Main Title */}
                    <h1 className="hero-title">
                      {slide.titlePrefix} <br />
                      <span style={{ color: 'var(--primary)' }}>{slide.titleHighlight}</span>
                    </h1>

                    {/* Description */}
                    <p className="hero-desc">{slide.description}</p>

                    {/* CTAs */}
                    <div className="hero-actions">
                      {slide.primaryCta.isModal ? (
                        <button
                          type="button"
                          onClick={() => openRegistrationModal(slide.titlePrefix + ' ' + slide.titleHighlight)}
                          className="btn btn-primary btn-lg"
                        >
                          <span>{slide.primaryCta.text}</span>
                          <ArrowRight size={18} />
                        </button>
                      ) : (
                        <Link href={slide.primaryCta.href} className="btn btn-primary btn-lg">
                          <span>{slide.primaryCta.text}</span>
                          <ArrowRight size={18} />
                        </Link>
                      )}

                      {slide.secondaryCta && (
                        <Link href={slide.secondaryCta.href} className="btn btn-outline btn-lg">
                          <span>{slide.secondaryCta.text}</span>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Right Column: High Quality Visual & Floating Badges */}
                  <div className="hero-media-wrapper">
                    <div className="hero-image-card">
                      <img
                        src={slide.image}
                        alt={slide.imageAlt}
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                      <div className="hero-media-overlay" />
                    </div>

                    {/* Floating Badges */}
                    {slide.floatingBadges.map((item, bIndex) => {
                      const Icon = item.icon;
                      const isTop = item.position === 'top-right';
                      return (
                        <div
                          key={bIndex}
                          className={`hero-float-badge ${
                            isTop ? 'hero-float-badge-1' : 'hero-float-badge-2'
                          }`}
                        >
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '10px',
                              backgroundColor: `${item.iconColor}15`,
                              color: item.iconColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Icon size={20} />
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: '0.88rem',
                                fontWeight: 700,
                                color: 'var(--secondary)',
                                lineHeight: 1.2,
                              }}
                            >
                              {item.title}
                            </div>
                            <div
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)',
                                fontWeight: 500,
                              }}
                            >
                              {item.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Slider Controls Bar (Centered: Left Arrow -> 3 Dots -> Right Arrow) */}
        <div className="hero-slider-controls">
          <button
            type="button"
            onClick={prevSlide}
            className="hero-nav-arrow"
            aria-label="Slide trước"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="hero-slider-dots">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`hero-slider-dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Chuyển tới slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextSlide}
            className="hero-nav-arrow"
            aria-label="Slide tiếp theo"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* ===================================================================
          REGISTRATION MODAL (Form Đăng Ký Học 1 Kèm 1 / Tư Vấn Khóa Học)
          =================================================================== */}
      {isModalOpen && (
        <div
          className="registration-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="registration-modal-card">
            {/* Modal Header */}
            <div className="modal-header">
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: 'var(--primary)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.3rem',
                }}
              >
                <Users size={14} />
                <span>Đồng hành cùng Thầy Hộ</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--secondary)', margin: 0 }}>
                Đăng ký Tư vấn & Học 1 kèm 1
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Điền thông tin bên dưới để nhận lộ trình cá nhân hóa và xếp lịch học sớm nhất.
              </p>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="modal-close-btn"
                aria-label="Đóng biểu mẫu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {formSubmitted ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
                  <div
                    style={{
                      width: '4rem',
                      height: '4rem',
                      borderRadius: '50%',
                      backgroundColor: 'var(--success-bg)',
                      color: 'var(--success)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem',
                    }}
                  >
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 style={{ fontSize: '1.3rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
                    Đăng ký thành công!
                  </h4>
                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.92rem',
                      lineHeight: 1.6,
                      marginBottom: '1.5rem',
                    }}
                  >
                    Cảm ơn <strong>{formData.name}</strong>. Thầy Hộ và ban quản trị sẽ liên hệ trực tiếp qua số điện thoại/Zalo <strong>{formData.phone}</strong> trong thời gian sớm nhất!
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-primary"
                    style={{ minWidth: '160px' }}
                  >
                    Hoàn tất & Đóng
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitRegistration}>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Họ và tên của bạn *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Nguyễn Văn An"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Số điện thoại / Zalo *</label>
                      <input
                        type="tel"
                        required
                        placeholder="0988 xxx xxx"
                        className="form-input"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Địa chỉ Email</label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        className="form-input"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Chương trình bạn quan tâm *</label>
                    <select
                      className="form-select"
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    >
                      <option value="Học 1 kèm 1 cùng Thầy Hộ">🎯 Học 1 kèm 1 cùng Thầy Hộ (Coaching riêng)</option>
                      <option value="Học Vibe Coding & Web Development">⚡ Học Vibe Coding & Lập trình Web</option>
                      <option value="Học Thiết kế UI/UX & Đồ họa">🎨 Học Thiết kế UI/UX & Đồ họa</option>
                      <option value="Hỗ trợ sửa đồ án tốt nghiệp">🎓 Hỗ trợ sửa đồ án tốt nghiệp & Lab</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label">Mục tiêu học tập hoặc ghi chú thêm</label>
                    <textarea
                      rows={3}
                      placeholder="Mục tiêu của bạn (ví dụ: làm đồ án web, chuyển ngành design, học cấp tốc xin việc...)"
                      className="form-textarea"
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="btn btn-outline"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="btn btn-primary"
                    >
                      {formLoading ? (
                        <span>Đang xử lý...</span>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Gửi đăng ký ngay</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
