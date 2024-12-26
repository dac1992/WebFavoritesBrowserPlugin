// 监听安装事件
chrome.runtime.onInstalled.addListener(() => {
  // 初始化存储
  chrome.storage.sync.get(['bookmarks', 'settings'], (result) => {
    if (!result.bookmarks) {
      chrome.storage.sync.set({ bookmarks: [] });
    }
    if (!result.settings) {
      chrome.storage.sync.set({
        settings: {
          theme: 'system',
          defaultView: 'list',
          tagsDisplay: 'cloud'
        }
      });
    }
  });

  // 创建右键菜单
  chrome.contextMenus.create({
    id: 'saveToWebFavorites',
    title: '保存到收藏夹',
    contexts: ['page', 'selection', 'link']
  });
});

// 监听右键菜单点击
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'saveToWebFavorites' && tab?.id) {
    // 向当前标签页发送消息
    chrome.tabs.sendMessage(tab.id, {
      type: 'SAVE_PAGE',
      data: {
        url: info.pageUrl,
        title: tab.title,
        selection: info.selectionText
      }
    });
  }
});

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_PAGE_INFO') {
    sendResponse({
      url: sender.tab?.url,
      title: sender.tab?.title
    });
  }
}); 