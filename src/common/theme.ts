import { StorageData } from './types';

// 主题类型
export type Theme = 'light' | 'dark' | 'system';

// 获取系统主题
export const getSystemTheme = (): 'light' | 'dark' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// 获取当前主题
export const getCurrentTheme = async (): Promise<Theme> => {
  const result = await chrome.storage.sync.get(['theme']);
  return result.theme || 'system';
};

// 设置主题
export const setTheme = async (theme: Theme): Promise<void> => {
  await chrome.storage.sync.set({ theme });
  applyTheme(theme);
};

// 应用主题
export const applyTheme = (theme: Theme): void => {
  if (theme === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', isDark);
  } else {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
};

// 监听系统主题变化
export const watchSystemTheme = (callback: (isDark: boolean) => void): () => void => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const listener = (e: MediaQueryListEvent) => callback(e.matches);
  mediaQuery.addEventListener('change', listener);
  return () => mediaQuery.removeEventListener('change', listener);
}; 