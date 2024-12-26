// 监听来自background的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SAVE_PAGE') {
    // 获取页面元数据
    const metadata = {
      title: document.title,
      description: getMetaDescription(),
      url: window.location.href,
      selection: message.data.selection || '',
      favicon: getFaviconUrl()
    };

    // 打开收藏弹窗
    chrome.runtime.sendMessage({
      type: 'OPEN_POPUP',
      data: metadata
    });
  }
});

// 获取页面描述
function getMetaDescription(): string {
  const meta = document.querySelector('meta[name="description"]') ||
               document.querySelector('meta[property="og:description"]');
  return meta?.getAttribute('content') || '';
}

// 获取网站图标
function getFaviconUrl(): string {
  const favicon = document.querySelector('link[rel="icon"]') ||
                 document.querySelector('link[rel="shortcut icon"]');
  return favicon?.getAttribute('href') || '/favicon.ico';
}

// 监听页面加载完成
document.addEventListener('DOMContentLoaded', () => {
  // 向background发送页面信息
  chrome.runtime.sendMessage({
    type: 'PAGE_LOADED',
    data: {
      title: document.title,
      url: window.location.href,
      description: getMetaDescription(),
      favicon: getFaviconUrl()
    }
  });
}); 