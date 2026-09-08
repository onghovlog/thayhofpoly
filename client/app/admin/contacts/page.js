'use client';

import { useState, useEffect } from 'react';
import { getContacts, deleteContact, updateContactStatus } from '@/services/contactService';
import {
  Mail,
  Trash2,
  CheckCircle,
  Clock,
  RefreshCw,
  Search,
  MessageSquare,
  Phone,
  User,
  ExternalLink,
} from 'lucide-react';

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterType !== 'all') params.type = filterType;
      if (filterStatus !== 'all') params.status = filterStatus;

      const res = await getContacts(params);
      if (res.success) {
        setContacts(res.data || []);
      }
    } catch (err) {
      console.error('Lỗi khi tải tin nhắn:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [filterType, filterStatus]);

  const handleDelete = async (id, name) => {
    if (confirm(`Bạn có chắc muốn xóa tin nhắn từ "${name}"?`)) {
      try {
        const res = await deleteContact(id);
        if (res.success) {
          fetchContacts();
        }
      } catch (err) {
        alert(err.message || 'Lỗi khi xóa tin nhắn');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await updateContactStatus(id, newStatus);
      if (res.success) {
        fetchContacts();
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi cập nhật trạng thái');
    }
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--secondary)', marginBottom: '0.25rem' }}>
            Tin nhắn Liên hệ & Đăng ký
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Tổng cộng: {contacts.length} yêu cầu từ khách truy cập và học viên
          </p>
        </div>

        <button onClick={fetchContacts} className="btn btn-outline btn-sm">
          <RefreshCw size={15} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="form-input"
          style={{ width: 'auto', minWidth: '180px' }}
        >
          <option value="all">Tất cả loại tin nhắn</option>
          <option value="contact">Liên hệ chung</option>
          <option value="consultation">Đăng ký tư vấn 1 kèm 1</option>
          <option value="registration">Đăng ký khóa học</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="form-input"
          style={{ width: 'auto', minWidth: '150px' }}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="new">Mới nhận (Chưa xem)</option>
          <option value="read">Đã xem</option>
          <option value="replied">Đã phản hồi</option>
        </select>
      </div>

      {/* Contacts List */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw className="animate-spin" size={30} style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
          <p>Đang tải danh sách tin nhắn...</p>
        </div>
      ) : contacts.length === 0 ? (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '3.5rem 2rem',
            textAlign: 'center',
          }}
        >
          <Mail size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '0.4rem' }}>
            Chưa có tin nhắn nào
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Các tin nhắn và đăng ký từ người dùng sẽ xuất hiện tại đây.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {contacts.map((c) => {
            const isNew = c.status === 'new';
            return (
              <div
                key={c._id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: isNew ? '2px solid var(--primary)' : '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--secondary)' }}>
                      {c.name}
                    </span>

                    <span
                      className="badge"
                      style={{
                        backgroundColor:
                          c.type === 'consultation'
                            ? '#FEF3C7'
                            : c.type === 'registration'
                            ? '#DCFCE7'
                            : '#EFF6FF',
                        color:
                          c.type === 'consultation'
                            ? '#B45309'
                            : c.type === 'registration'
                            ? '#15803D'
                            : '#1D4ED8',
                        fontWeight: 600,
                      }}
                    >
                      {c.type === 'consultation'
                        ? '🎯 Tư vấn 1 kèm 1'
                        : c.type === 'registration'
                        ? '📚 Đăng ký khóa học'
                        : '✉️ Liên hệ'}
                    </span>

                    {c.course && (
                      <span className="badge" style={{ backgroundColor: '#F1F5F9', color: 'var(--secondary)' }}>
                        Khóa: {c.course}
                      </span>
                    )}

                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={13} />
                      {new Date(c.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <select
                      value={c.status}
                      onChange={(e) => handleStatusChange(c._id, e.target.value)}
                      className="form-input"
                      style={{
                        padding: '0.3rem 0.6rem',
                        fontSize: '0.82rem',
                        height: 'auto',
                        width: 'auto',
                        fontWeight: 600,
                      }}
                    >
                      <option value="new">🔴 Mới</option>
                      <option value="read">🟡 Đã xem</option>
                      <option value="replied">🟢 Đã phản hồi</option>
                    </select>

                    <button
                      onClick={() => handleDelete(c._id, c.name)}
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--danger)' }}
                      title="Xóa tin nhắn"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.75rem', fontSize: '0.88rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                  <div>
                    <strong>Email:</strong> <a href={`mailto:${c.email}`} style={{ color: 'var(--primary)' }}>{c.email}</a>
                  </div>
                  {c.phone && (
                    <div>
                      <strong>SĐT:</strong> <a href={`tel:${c.phone}`} style={{ color: 'var(--primary)' }}>{c.phone}</a>
                    </div>
                  )}
                  {c.subject && (
                    <div>
                      <strong>Chủ đề:</strong> {c.subject}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--bg-alt)',
                    padding: '1rem',
                    borderRadius: 'var(--radius)',
                    fontSize: '0.92rem',
                    color: '#334155',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {c.message}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
