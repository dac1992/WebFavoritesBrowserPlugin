import { Bookmark, Tag, StorageData } from './types';

// 保存书签
export const saveBookmark = async (bookmark: Bookmark): Promise<void> => {
  try {
    const result = await chrome.storage.sync.get(['bookmarks']);
    const bookmarks: Bookmark[] = result.bookmarks || [];
    bookmarks.push(bookmark);
    await chrome.storage.sync.set({ bookmarks });
  } catch (error) {
    console.error('Failed to save bookmark:', error);
    throw new Error('保存书签失败');
  }
};

// 获取所有书签
export const getBookmarks = async (): Promise<Bookmark[]> => {
  try {
    const result = await chrome.storage.sync.get(['bookmarks']);
    return result.bookmarks || [];
  } catch (error) {
    console.error('Failed to get bookmarks:', error);
    throw new Error('获取书签失败');
  }
};

// 删除书签
export const deleteBookmark = async (bookmarkId: string): Promise<void> => {
  try {
    const result = await chrome.storage.sync.get(['bookmarks']);
    const bookmarks: Bookmark[] = result.bookmarks || [];
    const updatedBookmarks = bookmarks.filter(b => b.id !== bookmarkId);
    await chrome.storage.sync.set({ bookmarks: updatedBookmarks });
  } catch (error) {
    console.error('Failed to delete bookmark:', error);
    throw new Error('删除书签失败');
  }
};

// 更新书签
export const updateBookmark = async (bookmark: Bookmark): Promise<void> => {
  try {
    const result = await chrome.storage.sync.get(['bookmarks']);
    const bookmarks: Bookmark[] = result.bookmarks || [];
    const index = bookmarks.findIndex(b => b.id === bookmark.id);
    if (index !== -1) {
      bookmarks[index] = bookmark;
      await chrome.storage.sync.set({ bookmarks });
    }
  } catch (error) {
    console.error('Failed to update bookmark:', error);
    throw new Error('更新书签失败');
  }
};

// 获取当前标签页信息
export const getCurrentTab = async (): Promise<chrome.tabs.Tab> => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  } catch (error) {
    console.error('Failed to get current tab:', error);
    throw new Error('获取当前标签页失败');
  }
};

// 获取所有标签
export const getTags = async (): Promise<Tag[]> => {
  try {
    const result = await chrome.storage.sync.get(['tags']);
    return result.tags || [];
  } catch (error) {
    console.error('Failed to get tags:', error);
    throw new Error('获取标签失败');
  }
};

// 更新标签使用次数
export const updateTagCount = async (tagNames: string[]): Promise<void> => {
  try {
    const result = await chrome.storage.sync.get(['tags']);
    const tags: Tag[] = result.tags || [];
    const updatedTags = tags.map(tag => {
      if (tagNames.includes(tag.name)) {
        return { ...tag, count: tag.count + 1 };
      }
      return tag;
    });
    await chrome.storage.sync.set({ tags: updatedTags });
  } catch (error) {
    console.error('Failed to update tag count:', error);
    throw new Error('更新标签使用次数失败');
  }
};

// 删除标签
export const deleteTag = async (tagId: string): Promise<void> => {
  try {
    const result = await chrome.storage.sync.get(['tags', 'bookmarks']);
    const tags: Tag[] = result.tags || [];
    const bookmarks: Bookmark[] = result.bookmarks || [];

    // 从标签列表中删除
    const updatedTags = tags.filter(tag => tag.id !== tagId);

    // 从所有书签中移除该标签
    const tagName = tags.find(t => t.id === tagId)?.name;
    const updatedBookmarks = bookmarks.map(bookmark => ({
      ...bookmark,
      tags: bookmark.tags.filter(t => t !== tagName)
    }));

    await chrome.storage.sync.set({
      tags: updatedTags,
      bookmarks: updatedBookmarks
    });
  } catch (error) {
    console.error('Failed to delete tag:', error);
    throw new Error('删除标签失败');
  }
};

// 重命名标签
export const renameTag = async (tagId: string, newName: string): Promise<void> => {
  try {
    const result = await chrome.storage.sync.get(['tags', 'bookmarks']);
    const tags: Tag[] = result.tags || [];
    const bookmarks: Bookmark[] = result.bookmarks || [];

    const oldTag = tags.find(t => t.id === tagId);
    if (!oldTag) return;

    // 更新标签列表
    const updatedTags = tags.map(tag =>
      tag.id === tagId ? { ...tag, name: newName } : tag
    );

    // 更新所有书签中的标签名
    const updatedBookmarks = bookmarks.map(bookmark => ({
      ...bookmark,
      tags: bookmark.tags.map(t => t === oldTag.name ? newName : t)
    }));

    await chrome.storage.sync.set({
      tags: updatedTags,
      bookmarks: updatedBookmarks
    });
  } catch (error) {
    console.error('Failed to rename tag:', error);
    throw new Error('重命名标签失败');
  }
}; 