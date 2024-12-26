import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkListProps } from '../../common/types';

export const BookmarkList: React.FC<BookmarkListProps> = ({ searchQuery }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        setLoading(true);
        const result = await chrome.storage.sync.get(['bookmarks']);
        setBookmarks(result.bookmarks || []);
        setError(null);
      } catch (err) {
        setError('加载书签失败');
        console.error('Failed to load bookmarks:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, []);

  // 过滤书签
  const filteredBookmarks = bookmarks.filter(bookmark => 
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    bookmark.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="text-gray-500">加载中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredBookmarks.map((bookmark) => (
        <div key={bookmark.id} className="p-4 border rounded-lg hover:shadow-md">
          <a 
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-medium text-blue-600 hover:text-blue-800"
          >
            {bookmark.title}
          </a>
          
          <div className="mt-2 text-sm text-gray-600">
            {bookmark.description}
          </div>
          
          <div className="mt-2 space-x-2">
            {bookmark.tags.map((tag, index) => (
              <span 
                key={`${bookmark.id}-${index}`}
                className="inline-block px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
      
      {filteredBookmarks.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          没有找到相关书签
        </div>
      )}
    </div>
  );
};

export default BookmarkList; 