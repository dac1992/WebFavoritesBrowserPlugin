import React, { useState } from 'react';
import { SaveBookmark } from './SaveBookmark';
import { BookmarkList } from './BookmarkList';
import { TagManager } from './TagManager';
import { SearchBar } from './SearchBar';

const MainView: React.FC = () => {
  const [view, setView] = useState<'save' | 'list'>('save');
  const [showTagManager, setShowTagManager] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="main-view">
      <div className="header">
        <button onClick={() => setView('save')} className={view === 'save' ? 'active' : ''}>
          保存书签
        </button>
        <button onClick={() => setView('list')} className={view === 'list' ? 'active' : ''}>
          书签列表
        </button>
        <button onClick={() => setShowTagManager(true)}>
          标签管理
        </button>
      </div>

      {view === 'save' ? (
        <SaveBookmark />
      ) : (
        <>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <BookmarkList searchQuery={searchQuery} />
        </>
      )}

      {showTagManager && (
        <div className="modal">
          <TagManager onClose={() => setShowTagManager(false)} />
        </div>
      )}
    </div>
  );
};

export default MainView; 