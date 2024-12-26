import React, { useState, useEffect } from 'react';
import { getCurrentTab, saveBookmark } from '../../common/chrome';
import { generateId } from '../../common/utils';
import { TagInput } from './TagInput';

export const SaveBookmark: React.FC = () => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadCurrentTab();
  }, []);

  const loadCurrentTab = async () => {
    try {
      const tab = await getCurrentTab();
      setTitle(tab.title || '');
      setUrl(tab.url || '');
    } catch (err) {
      console.error('Failed to load current tab:', err);
      setError('获取当前标签页信息失败');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await saveBookmark({
        id: generateId(),
        title: title.trim(),
        url: url.trim(),
        description: description.trim(),
        tags,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      setSuccess(true);
      setDescription('');
      setTags([]);
      
      // 3秒后清除成功提示
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to save bookmark:', err);
      setError('保存书签失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="save-bookmark" onSubmit={handleSubmit}>
      {error && (
        <div className="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          保存成功！
        </div>
      )}

      <div className="form-group">
        <label htmlFor="title">标题</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="url">网址</label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">描述</label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="添加一些描述..."
        />
      </div>

      <TagInput
        tags={tags}
        onChange={setTags}
      />

      <button type="submit" disabled={loading || !title.trim() || !url.trim()}>
        {loading ? (
          <>
            <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeLinecap="round" />
            </svg>
            保存中...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 0H6v10h8V5z" clipRule="evenodd" />
            </svg>
            保存书签
          </>
        )}
      </button>
    </form>
  );
};

export default SaveBookmark; 