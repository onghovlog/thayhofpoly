'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCourses, deleteCourse } from '@/services/courseService';
import { getCategories } from '@/services/categoryService';
import { formatLevel } from '@/utils/formatters';
import { Plus, Search, Edit2, Trash2, ExternalLink, Video } from 'lucide-react';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const fetchCourseList = async () => {
    setLoading(true);
    try {
      const res = await getCourses({
        limit: 50,
        search: search.trim() || undefined,
        category: category !== 'all' ? category : undefined,
        allStatus: 'true',
      });
      if (res.success) {
        setCourses(res.data || []);
      }
    } catch (e) {
      console.error('Lỗi tải danh sách khóa học:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories().then((res) => {
      if (res.success) setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    fetchCourseList();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourseList();
  };

  const handleDelete = async (id, title) => {
    if (confirm(`Bạn có chắc chắn muốn xóa khóa học "${title}"?`)) {
      try {
        const res = await deleteCourse(id);
        if (res.success) {
          alert('Xóa khóa học thành công');
          fetchCourseList();
        }
      } catch (e) {
        alert(e.message || 'Lỗi khi xóa khóa học');
      }
    }
  };

  return (
    <div>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--secondary)', marginBottom: '0.25rem' }}>
            Quản lý Khóa học
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Tổng số: {courses.length} khóa học trong hệ thống
          </p>
        </div>

        <Link href="/admin/courses/new" className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Tạo khóa học mới</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '1rem',
          backgroundColor: '#FFFFFF',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          marginBottom: '1.5rem',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', flex: '1 1 300px' }}>
          <input
            type="text"
            placeholder="Tìm theo tên khóa học..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
          />
          <Search
            size={16}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
          />
        </form>

        <div style={{ minWidth: '180px' }}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-select"
            style={{ padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
          >
            <option value="all">Tất cả chuyên mục</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Table */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-alt)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--secondary)', fontWeight: 600 }}>Tên khóa học</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--secondary)', fontWeight: 600 }}>Chủ đề</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--secondary)', fontWeight: 600 }}>Cấp độ</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--secondary)', fontWeight: 600 }}>Số video</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--secondary)', fontWeight: 600 }}>Trạng thái</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--secondary)', fontWeight: 600, textAlign: 'right' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Đang tải danh sách khóa học...
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Chưa có khóa học nào khớp với điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={course.thumbnail || '/images/default-course.jpg'}
                        alt={course.title}
                        style={{ width: '3.5rem', height: '2.2rem', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--secondary)' }}>{course.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>/{course.slug}</div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-main)' }}>
                      {course.category?.name || '---'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge badge-${course.level || 'beginner'}`}>
                        {formatLevel(course.level)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-main)' }}>
                      {course.videoCount || 0} bài
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: course.status === 'published' ? 'var(--success-bg)' : '#F1F5F9',
                          color: course.status === 'published' ? 'var(--success)' : 'var(--text-muted)',
                        }}
                      >
                        {course.status === 'published' ? 'Công khai' : 'Bản nháp'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <Link
                          href={`/khoa-hoc/${course.slug}`}
                          target="_blank"
                          className="btn btn-ghost btn-sm"
                          title="Xem trang"
                        >
                          <ExternalLink size={15} />
                        </Link>
                        <Link
                          href={`/admin/courses/edit/${course._id}`}
                          className="btn btn-outline btn-sm"
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(course._id, course.title)}
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--danger)' }}
                          title="Xóa khóa học"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
