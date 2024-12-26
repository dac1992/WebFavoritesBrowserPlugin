import React, { useState, useEffect, ChangeEvent } from 'react';
import { BookmarkFormData } from '../../common/types';
import { saveBookmark } from '../../common/chrome';
import { generateId, normalizeTags } from '../../common/utils';

export const SaveBookmark: React.FC = () => {
  const [formData, setFormData] = useState<BookmarkFormData>({
    title: '',
    url: '',
    tags: [],
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 获取当前标签页信息
  useEffect(() => {
    const loadCurrentTab = async () => {
      try {
        const tab = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab[0]) {
          setFormData(prev => ({
            ...prev,
            title: tab[0].title || '',
            url: tab[0].url || ''
          }));
        }
      } catch (err) {
        setError('获取页面信息失败');
        console.error('Failed to get current tab:', err);
      }
    };

    loadCurrentTab();
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFormData(prev => ({ ...prev, tags: normalizeTags(tags) }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await saveBookmark({
        id: generateId(),
        ...formData,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      setSuccess(true);
      // 重置表单
      setFormData({
        title: '',
        url: '',
        tags: [],
        description: ''
      });
    } catch (err) {
      setError('保存失败');
      console.error('Failed to save bookmark:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-2 text-red-500 bg-red-50 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="p-2 text-green-500 bg-green-50 rounded">
          保存成功！
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">标题</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">标签</label>
        <input
          type="text"
          value={formData.tags.join(', ')}
          onChange={handleTagsChange}
          placeholder="用逗号分隔多个标签"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">描述</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows={3}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          loading
            ? 'bg-blue-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {loading ? '保存中...' : '保存书签'}
      </button>
    </div>
  );
};

export default SaveBookmark; 