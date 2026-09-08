'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDashboardStats } from '@/services/dashboardService';
import { formatDate } from '@/utils/formatters';
import {
  Video,
  FileText,
  Layers,
  Milestone,
  Plus,
  ArrowUpRight,
  ExternalLink,
  Clock,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (e) {
        console.error('Lỗi tải thống kê dashboard:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const counts = stats?.counts || {
    totalCourses: 0,
    totalArticles: 0,
    totalCategories: 0,
    totalLearningPaths: 0,
  };

  const statCards = [
    {
      label: 'Tổng số Khóa học',
      value: counts.totalCourses,
      icon: Video,
      color: 'var(--primary)',
      bg: 'var(--primary-light)',
      link: '/admin/courses',
    },
    {
      label: 'Tổng số Bài viết',
      value: counts.totalArticles,
      icon: FileText,
      color: '#2563EB',
      bg: '#DBEAFE',
      link: '/admin/articles',
    },
    {
      label: 'Chuyên mục / Chủ đề',
      value: counts.totalCategories,
      icon: Layers,
      color: '#7C3AED',
      bg: '#EDE9FE',
      link: '/admin/categories',
    },
    {
      label: 'Lộ trình học tập',
      value: counts.totalLearningPaths,
      icon: Milestone,
      color: '#059669',
      bg: '#D1FAE5',
      link: '/admin/learning-paths',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--secondary)', marginBottom: '0.3rem' }}>
            Tổng quan Hệ thống
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Chào mừng Thầy HOTB quay trở lại bảng điều khiển quản trị Learning Hub.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/admin/courses/new" className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Thêm khóa học mới</span>
          </Link>
          <Link href="/admin/articles/new" className="btn btn-outline btn-sm">
            <Plus size={16} />
            <span>Viết bài mới</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.link}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease',
              }}
              className="stat-card"
            >
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem' }}>
                  {card.label}
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--secondary)' }}>
                  {loading ? '...' : card.value}
                </div>
              </div>
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: 'var(--radius)',
                  backgroundColor: card.bg,
                  color: card.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={24} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* 2-Column Recent Items */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="admin-recent-grid">
        {/* Recent Courses */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--secondary)' }}>
              Khóa học mới nhất
            </h3>
            <Link href="/admin/courses" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
              Quản lý khóa học →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(stats?.recentCourses || []).slice(0, 5).map((course) => (
              <div
                key={course._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--bg-alt)',
                  borderRadius: 'var(--radius)',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--secondary)' }}>
                    {course.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {course.category?.name || 'Khóa học'} • {course.videoCount || 0} bài giảng
                  </div>
                </div>
                <Link href={`/admin/courses/edit/${course._id}`} className="btn btn-ghost btn-sm" style={{ fontSize: '0.8rem' }}>
                  Sửa
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Articles */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--secondary)' }}>
              Bài viết mới nhất
            </h3>
            <Link href="/admin/articles" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
              Quản lý bài viết →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(stats?.recentArticles || []).slice(0, 5).map((article) => (
              <div
                key={article._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--bg-alt)',
                  borderRadius: 'var(--radius)',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--secondary)' }}>
                    {article.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {article.category?.name || 'Bài viết'} • {formatDate(article.createdAt)}
                  </div>
                </div>
                <Link href={`/admin/articles/edit/${article._id}`} className="btn btn-ghost btn-sm" style={{ fontSize: '0.8rem' }}>
                  Sửa
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
