import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Tag, TagManagerProps } from '../../common/types';
import { generateId } from '../../common/utils';

export const TagManager: React.FC<TagManagerProps> = React.memo(({ onClose }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  // 加载标签
  useEffect(() => {
    const loadTags = async () => {
      try {
        setLoading(true);
        const result = await chrome.storage.sync.get(['tags']);
        setTags(result.tags || []);
        setError(null);
      } catch (err) {
        setError('加载标签失败');
        console.error('Failed to load tags:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTags();
  }, []);

  // 保存标签
  const saveTags = useCallback(async (newTags: Tag[]) => {
    try {
      await chrome.storage.sync.set({ tags: newTags });
      setTags(newTags);
      setError(null);
    } catch (err) {
      setError('保存标签失败');
      console.error('Failed to save tags:', err);
    }
  }, []);

  // 添加标签
  const handleAddTag = useCallback(async () => {
    if (!newTagName.trim()) return;

    const newTag: Tag = {
      id: generateId(),
      name: newTagName.trim(),
      count: 0,
      createdAt: Date.now()
    };

    await saveTags([...tags, newTag]);
    setNewTagName('');
  }, [newTagName, tags, saveTags]);

  // 更新标签
  const handleUpdateTag = useCallback(async (tag: Tag) => {
    if (!tag.name.trim()) return;

    const updatedTags = tags.map(t => 
      t.id === tag.id ? { ...tag, name: tag.name.trim() } : t
    );

    await saveTags(updatedTags);
    setEditingTag(null);
  }, [tags, saveTags]);

  // 删除标签
  const handleDeleteTag = useCallback(async (tagId: string) => {
    if (!window.confirm('确定要删除这个标签吗？')) return;

    const updatedTags = tags.filter(tag => tag.id !== tagId);
    await saveTags(updatedTags);
  }, [tags, saveTags]);

  // 使用useMemo缓存渲染的标签列表
  const renderedTags = useMemo(() => (
    tags.map(tag => (
      <div
        key={tag.id}
        className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        {editingTag?.id === tag.id ? (
          <input
            type="text"
            value={editingTag.name}
            onChange={e => setEditingTag({ ...editingTag, name: e.target.value })}
            className="flex-1 px-2 py-1 border rounded"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-medium">{tag.name}</span>
            <span className="text-sm text-gray-500">({tag.count}次使用)</span>
          </div>
        )}
        <div className="flex gap-2">
          {editingTag?.id === tag.id ? (
            <>
              <button
                onClick={() => handleUpdateTag(editingTag)}
                className="text-green-600 hover:text-green-700"
              >
                保存
              </button>
              <button
                onClick={() => setEditingTag(null)}
                className="text-gray-500 hover:text-gray-600"
              >
                取消
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditingTag(tag)}
                className="text-blue-600 hover:text-blue-700"
              >
                编辑
              </button>
              <button
                onClick={() => handleDeleteTag(tag.id)}
                className="text-red-600 hover:text-red-700"
              >
                删除
              </button>
            </>
          )}
        </div>
      </div>
    ))
  ), [tags, editingTag, handleUpdateTag, handleDeleteTag]);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <span>加载中...</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">标签管理</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      {error && (
        <div className="mb-4 p-2 text-red-500 bg-red-50 rounded">
          {error}
        </div>
      )}

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newTagName}
          onChange={e => setNewTagName(e.target.value)}
          placeholder="输入新标签名称"
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddTag}
          disabled={!newTagName.trim()}
          className={`px-4 py-2 rounded-lg ${
            newTagName.trim()
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          添加
        </button>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {renderedTags}
      </div>
    </div>
  );
});

TagManager.displayName = 'TagManager';

export default TagManager; 