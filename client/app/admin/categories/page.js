'use client';

import { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/services/categoryService';
import { Plus, Edit2, Trash2, Save, X, Layers } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    type: 'both',
    order: 0,
    active: true,
  });

  const fetchCats = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      if (res.success) {
        setCategories(res.data || []);
      }
    } catch (e) {
      console.error('Lỗi tải danh mục:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      type: cat.type || 'both',
      order: cat.order || 0,
      active: cat.active !== false,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', description: '', type: 'both', order: 0, active: true });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await updateCategory(editingId, formData);
        if (res.success) {
          alert('Cập nhật chủ đề thành công');
        }
      } else {
        const res = await createCategory(formData);
        if (res.success) {
          alert('Thêm chủ đề mới thành công');
        }
      }
      handleCancel();
      fetchCats();
    } catch (err) {
      alert(err.message || 'Đã có lỗi xảy ra');
    }
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Bạn có chắc chắn muốn xóa chủ đề "${name}"?`)) {
      try {
        const res = await deleteCategory(id);
        if (res.success) {
          alert('Xóa chủ đề thành công');
          fetchCats();
        }
      } catch (err) {
        alert(err.message || 'Lỗi khi xóa chủ đề');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--secondary)', marginBottom: '0.25rem' }}>
            Quản lý Chuyên mục & Chủ đề
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Tổng cộng: {categories.length} chuyên ngành đào tạo
          </p>
        </div>

        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Thêm chủ đề mới</span>
          </button>
        )}
      </div>

      {/* Add / Edit Form Drawer */}
      {showForm && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)' }}>
              {editingId ? 'Chỉnh sửa Chủ đề' : 'Thêm Chủ đề Mới'}
            </h3>
            <button onClick={handleCancel} className="btn btn-ghost btn-sm">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Tên chủ đề *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  placeholder="Ví dụ: Lập trình Mobile"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Slug URL</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="form-input"
                  placeholder="lap-trinh-mobile"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mô tả ngắn</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="form-textarea"
                placeholder="Mô tả về chuyên ngành này..."
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
              <button type="submit" className="btn btn-primary">
                <Save size={16} />
                <span>{editingId ? 'Lưu thay đổi' : 'Tạo chủ đề'}</span>
              </button>
              <button type="button" onClick={handleCancel} className="btn btn-outline">
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Table */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-alt)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '0.85rem 1rem', color: 'var(--secondary)', fontWeight: 600 }}>Tên chủ đề</th>
              <th style={{ padding: '0.85rem 1rem', color: 'var(--secondary)', fontWeight: 600 }}>Slug</th>
              <th style={{ padding: '0.85rem 1rem', color: 'var(--secondary)', fontWeight: 600 }}>Số khóa học</th>
              <th style={{ padding: '0.85rem 1rem', color: 'var(--secondary)', fontWeight: 600 }}>Số bài viết</th>
              <th style={{ padding: '0.85rem 1rem', color: 'var(--secondary)', fontWeight: 600, textAlign: 'right' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Đang tải danh sách chủ đề...
                </td>
              </tr>
            ) : categories.map((cat) => (
              <tr key={cat._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--secondary)' }}>
                  {cat.name}
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                  /chu-de/{cat.slug}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span className="badge">{cat.courseCount || 0} khóa</span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span className="badge">{cat.articleCount || 0} bài</span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => handleEdit(cat)}
                      className="btn btn-outline btn-sm"
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id, cat.name)}
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--danger)' }}
                      title="Xóa chủ đề"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
