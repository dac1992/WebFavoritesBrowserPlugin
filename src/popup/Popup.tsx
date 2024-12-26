import React, { Suspense, lazy, useState, useCallback, useMemo } from 'react';
import { ThemeToggle } from './components/ThemeToggle';

// 懒加载组件
const TagManager = lazy(() => import('./components/TagManager'));
const TagCloud = lazy(() => import('./components/TagCloud'));
const TagInput = lazy(() => import('./components/TagInput'));
const SearchBar = lazy(() => import('./components/SearchBar'));
const BookmarkList = lazy(() => import('./components/BookmarkList'));
const SaveBookmark = lazy(() => import('./components/SaveBookmark'));

// 加载状态组件
const LoadingSpinner = React.memo(() => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
));

// 导航按钮组件
const NavButton = React.memo<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}>(({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-md ${
      active
        ? 'bg-blue-500 text-white'
        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
    }`}
  >
    {children}
  </button>
));

export const Popup: React.FC = () => {
  const [view, setView] = useState<'list' | 'save'>('list');
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 使用useCallback优化事件处理函数
  const handleViewChange = useCallback((newView: 'list' | 'save') => {
    setView(newView);
  }, []);

  const handleTagManagerOpen = useCallback(() => {
    setIsTagManagerOpen(true);
  }, []);

  const handleTagManagerClose = useCallback(() => {
    setIsTagManagerOpen(false);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  // 使用useMemo优化渲染内容
  const mainContent = useMemo(() => (
    <Suspense fallback={<LoadingSpinner />}>
      {view === 'list' ? (
        <>
          <SearchBar value={searchQuery} onChange={handleSearchChange} />
          <BookmarkList searchQuery={searchQuery} />
        </>
      ) : (
        <SaveBookmark />
      )}
    </Suspense>
  ), [view, searchQuery, handleSearchChange]);

  const tagManagerModal = useMemo(() => (
    isTagManagerOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-[80%] max-h-[80%] overflow-auto">
          <Suspense fallback={<LoadingSpinner />}>
            <TagManager onClose={handleTagManagerClose} />
          </Suspense>
        </div>
      </div>
    )
  ), [isTagManagerOpen, handleTagManagerClose]);

  return (
    <div className="w-[400px] h-[600px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* 顶部导航栏 */}
      <nav className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <div className="flex space-x-2">
          <NavButton
            active={view === 'list'}
            onClick={() => handleViewChange('list')}
          >
            收藏列表
          </NavButton>
          <NavButton
            active={view === 'save'}
            onClick={() => handleViewChange('save')}
          >
            新建收藏
          </NavButton>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleTagManagerOpen}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            标签管理
          </button>
          <ThemeToggle />
        </div>
      </nav>

      {/* 主要内容区域 */}
      <main className="p-4">
        {mainContent}
      </main>

      {/* 标签管理器模态框 */}
      {tagManagerModal}
    </div>
  );
}; 