import React, { useState, useEffect } from 'react';
import { Tag } from '../../common/types';
import { getTags, deleteTag, renameTag } from '../../common/chrome';
import { generateId } from '../../common/utils';

interface TagManagerProps {
  onClose: () => void;
}

export const TagManager: React.FC<TagManagerProps> = ({ onClose }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTagName, setEditingTagName] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'count' | 'date'>('name');
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const loadedTags = await getTags();
      setTags(loadedTags);
      setError(null);
    } catch (err) {
      setError('加载标签失败');
      console.error('Failed to load tags:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTagId(tag.id);
    setEditingTagName(tag.name);
  };

  const handleSave = async () => {
    if (!editingTagId || !editingTagName.trim()) return;

    try {
      await renameTag(editingTagId, editingTagName.trim());
      setTags(tags.map(tag =>
        tag.id === editingTagId
          ? { ...tag, name: editingTagName.trim() }
          : tag
      ));
      setEditingTagId(null);
      setEditingTagName('');
      setError(null);
    } catch (err) {
      setError('保存标签失败');
      console.error('Failed to save tag:', err);
    }
  };

  const handleDelete = async (tagId: string) => {
    if (!window.confirm('确定要删除这个标签吗？')) return;

    try {
      await deleteTag(tagId);
      setTags(tags.filter(tag => tag.id !== tagId));
      setError(null);
    } catch (err) {
      setError('删除标签失败');
      console.error('Failed to delete tag:', err);
    }
  };

  const handleCreate = async () => {
    const name = window.prompt('请输入新标签名称');
    if (!name?.trim()) return;

    const newTag: Tag = {
      id: generateId(),
      name: name.trim(),
      count: 0,
      createdAt: Date.now()
    };

    try {
      const updatedTags = [...tags, newTag];
      await chrome.storage.sync.set({ tags: updatedTags });
      setTags(updatedTags);
      setError(null);
    } catch (err) {
      setError('创建标签失败');
      console.error('Failed to create tag:', err);
    }
  };

  const sortTags = (tagsToSort: Tag[]) => {
    return [...tagsToSort].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'count':
          return b.count - a.count;
        case 'date':
          return b.createdAt - a.createdAt;
        default:
          return 0;
      }
    });
  };

  const filteredAndSortedTags = sortTags(
    tags.filter(tag => 
      tag.name.toLowerCase().includes(filterText.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="tag-manager">
        <div className="empty-state">加载中...</div>
      </div>
    );
  }

  return (
    <div className="tag-manager">
      <div className="tag-manager-header">
        <h2>标签管理</h2>
        <button onClick={onClose} className="close-button">×</button>
      </div>

      {error && (
        <div className="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <div className="controls">
        <input
          type="text"
          placeholder="搜索标签..."
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          className="search-input"
        />
        <div className="sort-controls">
          <span>排序：</span>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as 'name' | 'count' | 'date')}>
            <option value="name">名称</option>
            <option value="count">使用次数</option>
            <option value="date">创建时间</option>
          </select>
        </div>
      </div>

      <button onClick={handleCreate} className="create-button">
        新建标签
      </button>

      <div className="tag-list">
        {filteredAndSortedTags.map(tag => (
          <div key={tag.id} className="tag-item">
            {editingTagId === tag.id ? (
              <input
                type="text"
                value={editingTagName}
                onChange={e => setEditingTagName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                autoFocus
              />
            ) : (
              <div className="flex-1">
                <span className="tag-name">{tag.name}</span>
                <span className="tag-count">
                  {tag.count} 次使用
                </span>
              </div>
            )}

            <div className="actions">
              {editingTagId === tag.id ? (
                <>
                  <button onClick={handleSave} className="edit">
                    保存
                  </button>
                  <button onClick={() => setEditingTagId(null)} className="delete">
                    取消
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEdit(tag)} className="edit">
                    编辑
                  </button>
                  <button onClick={() => handleDelete(tag.id)} className="delete">
                    删除
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {filteredAndSortedTags.length === 0 && (
          <div className="empty-state">
            <p>{filterText ? '没有找到匹配的标签' : '还没有创建任何标签'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagManager; 