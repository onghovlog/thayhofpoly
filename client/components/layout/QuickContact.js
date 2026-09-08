'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { PhoneCall } from 'lucide-react';
import { getPublicSettings } from '@/services/settingService';
import { SITE_CONFIG } from '@/utils/constants';

// Zalo SVG Icon
function ZaloIcon({ size = 24, color = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24 4C12.954 4 4 12.507 4 23C4 28.536 6.556 33.498 10.638 36.96L8.85 43.194C8.682 43.782 9.246 44.298 9.804 44.088L16.896 41.424C19.11 42.132 21.504 42.528 24 42.528C35.046 42.528 44 34.02 44 23.526C44 12.507 35.046 4 24 4Z"
        fill="#0068FF"
      />
      <path
        d="M17.5 17H30.5C31.328 17 32 17.672 32 18.5C32 19.064 31.684 19.554 31.22 19.804L20.89 27.5H31C31.552 27.5 32 27.948 32 28.5C32 29.052 31.552 29.5 31 29.5H17.5C16.672 29.5 16 28.828 16 28C16 27.436 16.316 26.946 16.78 26.696L27.11 19H17.5C16.948 19 16.5 18.552 16.5 18C16.5 17.448 16.948 17 17.5 17Z"
        fill={color}
      />
    </svg>
  );
}

// Messenger SVG Icon
function MessengerIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="msg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00C6FF" />
          <stop offset="100%" stopColor="#0078FF" />
        </linearGradient>
      </defs>
      <path
        d="M24 4C12.954 4 4 12.444 4 22.868C4 28.326 6.516 33.22 10.534 36.634V42.668C10.534 43.432 11.388 43.918 12.034 43.512L17.708 39.946C19.712 40.504 21.816 40.812 24 40.812C35.046 40.812 44 32.368 44 21.944C44 12.444 35.046 4 24 4Z"
        fill="url(#msg-grad)"
      />
      <path
        d="M13.2 26.544L19.2 19.988C19.866 19.262 20.978 19.278 21.624 20.022L26 25.012L34.8 19.988C35.844 19.394 37.034 20.584 36.44 21.628L30.44 28.184C29.774 28.91 28.662 28.894 28.016 28.15L23.64 23.16L14.84 28.184C13.796 28.778 12.606 27.588 13.2 26.544Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export default function QuickContact() {
  const pathname = usePathname();
  const [settings, setSettings] = useState({
    hotline: '0988 123 456',
    zalo: '0988 123 456',
    facebook: 'https://www.facebook.com/thayhotb',
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await getPublicSettings();
        if (res.success && res.data) {
          setSettings({
            hotline: res.data.hotline || '0988 123 456',
            zalo: res.data.zalo || '0988 123 456',
            facebook: res.data.facebook || 'https://www.facebook.com/thayhotb',
          });
        }
      } catch (e) {
        // Fallback to defaults
      }
    };
    loadSettings();
  }, []);

  // Không hiển thị trên trang Admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Format phone number for tel: and zalo link
  const cleanPhone = settings.hotline.replace(/\s+/g, '');
  const cleanZalo = (settings.zalo || settings.hotline).replace(/\s+/g, '');

  // Extract Facebook page username or ID for m.me link
  let messengerUrl = 'https://m.me/thayhotb';
  if (settings.facebook && settings.facebook.includes('facebook.com/')) {
    const handle = settings.facebook.split('facebook.com/')[1]?.replace(/\/$/, '');
    if (handle) {
      messengerUrl = `https://m.me/${handle}`;
    }
  }

  const zaloUrl = `https://zalo.me/${cleanZalo}`;
  const telUrl = `tel:${cleanPhone}`;

  return (
    <>
      {/* 1. Desktop Floating Quick Contact Buttons (Bottom Right) */}
      <div className="quick-contact-desktop" aria-label="Kênh liên hệ nhanh">
        {/* Messenger Floating Button */}
        <a
          href={messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="quick-contact-btn messenger-btn"
          title="Chat qua Facebook Messenger"
          aria-label="Chat qua Facebook Messenger"
        >
          <div className="pulse-ring pulse-messenger"></div>
          <div className="icon-wrapper">
            <MessengerIcon size={34} />
          </div>
          <span className="tooltip-label">Chat Messenger</span>
        </a>

        {/* Zalo Floating Button */}
        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="quick-contact-btn zalo-btn"
          title="Chat qua Zalo"
          aria-label="Chat qua Zalo"
        >
          <div className="pulse-ring pulse-zalo"></div>
          <div className="icon-wrapper">
            <ZaloIcon size={34} />
          </div>
          <span className="tooltip-label">Chat Zalo</span>
        </a>
      </div>

      {/* 2. Mobile Fixed Bottom Navigation Bar (3 Action Buttons) */}
      <nav className="mobile-bottom-nav" aria-label="Thanh liên hệ nhanh di động">
        <a
          href={telUrl}
          className="mobile-nav-item call-action"
          aria-label="Gọi điện thoại tư vấn"
        >
          <div className="mobile-icon-circle call-circle">
            <PhoneCall size={20} />
          </div>
          <span className="mobile-nav-text">Gọi điện</span>
        </a>

        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-nav-item zalo-action"
          aria-label="Chat qua Zalo"
        >
          <div className="mobile-icon-circle zalo-circle">
            <ZaloIcon size={24} />
          </div>
          <span className="mobile-nav-text">Chat Zalo</span>
        </a>

        <a
          href={messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-nav-item messenger-action"
          aria-label="Chat qua Messenger"
        >
          <div className="mobile-icon-circle messenger-circle">
            <MessengerIcon size={24} />
          </div>
          <span className="mobile-nav-text">Messenger</span>
        </a>
      </nav>
    </>
  );
}
