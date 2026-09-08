'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logoutAdmin, getCurrentUser } from '@/services/authService';
import {
  LayoutDashboard,
  Video,
  FileText,
  Layers,
  Milestone,
  LogOut,
  Globe,
  PlusCircle,
  Menu,
  X,
  User,
  Settings,
  Mail,
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (pathname === '/admin/login') return;

    const token = localStorage.getItem('thayhotb_token');
    const currentUser = getCurrentUser();

    if (!token) {
      router.push('/admin/login');
    } else {
      setUser(currentUser);
    }
  }, [pathname, router]);

  // Không hiển thị sidebar cho trang login
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isClient) return null;

  const navItems = [
    { label: 'Tổng quan', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Quản lý Khóa học', href: '/admin/courses', icon: Video },
    { label: 'Quản lý Bài viết', href: '/admin/articles', icon: FileText },
    { label: 'Quản lý Chủ đề', href: '/admin/categories', icon: Layers },
    { label: 'Quản lý Lộ trình', href: '/admin/learning-paths', icon: Milestone },
    { label: 'Thông tin Giảng viên', href: '/admin/instructor', icon: User },
    { label: 'Tin nhắn & Liên hệ', href: '/admin/contacts', icon: Mail },
    { label: 'Cài đặt hệ thống', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-alt)' }}>
      {/* Admin Sidebar */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#0F172A',
          color: '#94A3B8',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 40,
          transition: 'transform 0.2s ease',
          transform: sidebarOpen ? 'translateX(0)' : undefined,
        }}
        className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}
      >
        {/* Brand */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #1E293B',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <img
              src="/images/logo.png"
              alt="Thầy HOTB"
              style={{
                width: '2.2rem',
                height: '2.2rem',
                borderRadius: 'var(--radius-sm)',
                objectFit: 'contain',
                backgroundColor: '#FFFFFF',
                padding: '2px',
              }}
            />
            <div>
              <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1rem' }}>THẦY HOTB</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                Admin CMS
              </div>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="mobile-close-btn"
            style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'none' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius)',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.92rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div style={{ padding: '1rem', borderTop: '1px solid #1E293B', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link
            href="/"
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.5rem 0.85rem',
              color: '#94A3B8',
              fontSize: '0.88rem',
              borderRadius: 'var(--radius)',
            }}
          >
            <Globe size={16} />
            <span>Xem Website</span>
          </Link>

          <button
            onClick={logoutAdmin}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.5rem 0.85rem',
              color: '#F87171',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
            }}
          >
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }} className="admin-main">
        {/* Admin Header Bar */}
        <header
          style={{
            height: '4rem',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.75rem',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="admin-menu-toggle"
              style={{ background: 'transparent', border: 'none', color: 'var(--secondary)', cursor: 'pointer', display: 'none' }}
            >
              <Menu size={22} />
            </button>
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--secondary)' }}>
              Hệ thống Quản trị Nội dung
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '2.2rem',
                  height: '2.2rem',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}
              >
                H
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--secondary)' }}>
                {user?.name || 'Thầy HOTB'}
              </span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main style={{ padding: '2rem', flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}
