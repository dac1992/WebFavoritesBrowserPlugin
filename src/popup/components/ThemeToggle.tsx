import React, { useEffect, useState } from 'react';
import { Theme, getCurrentTheme, setTheme, watchSystemTheme } from '../../common/theme';

export const ThemeToggle: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('system');
  const [isOpen, setIsOpen] = useState(false);

  // 加载当前主题
  useEffect(() => {
    const loadTheme = async () => {
      const theme = await getCurrentTheme();
      setCurrentTheme(theme);
    };
    loadTheme();
  }, []);

  // 监听系统主题变化
  useEffect(() => {
    if (currentTheme === 'system') {
      const unwatch = watchSystemTheme(async () => {
        const theme = await getCurrentTheme();
        setCurrentTheme(theme);
      });
      return unwatch;
    }
  }, [currentTheme]);

  // 处理主题切换
  const handleThemeChange = async (theme: Theme) => {
    await setTheme(theme);
    setCurrentTheme(theme);
    setIsOpen(false);
  };

  // 获取主题图标
  const getThemeIcon = () => {
    switch (currentTheme) {
      case 'light':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'dark':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="切换主题"
      >
        {getThemeIcon()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex items-center w-full px-4 py-2 text-sm ${
                currentTheme === 'light'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              浅色
            </button>

            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex items-center w-full px-4 py-2 text-sm ${
                currentTheme === 'dark'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              深色
            </button>

            <button
              onClick={() => handleThemeChange('system')}
              className={`flex items-center w-full px-4 py-2 text-sm ${
                currentTheme === 'system'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              跟随系统
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 