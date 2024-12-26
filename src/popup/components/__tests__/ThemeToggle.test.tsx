import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeToggle } from '../ThemeToggle';
import { getCurrentTheme, setTheme } from '../../../common/theme';
import { jest } from '@jest/globals';

// Mock theme functions
jest.mock('../../../common/theme');

const mockGetCurrentTheme = getCurrentTheme as jest.MockedFunction<typeof getCurrentTheme>;
const mockSetTheme = setTheme as jest.MockedFunction<typeof setTheme>;

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCurrentTheme.mockResolvedValue('system');
  });

  it('renders theme toggle button', async () => {
    render(<ThemeToggle />);
    
    // 等待主题加载
    await waitFor(() => {
      expect(screen.getByLabelText('切换主题')).toBeInTheDocument();
    });
  });

  it('shows theme options when clicked', async () => {
    render(<ThemeToggle />);
    
    // 等待主题加载
    await waitFor(() => {
      const button = screen.getByLabelText('切换主题');
      expect(button).toBeInTheDocument();
    });

    // 点击按钮显示选项
    fireEvent.click(screen.getByLabelText('切换主题'));
    
    expect(screen.getByText('浅色')).toBeInTheDocument();
    expect(screen.getByText('深色')).toBeInTheDocument();
    expect(screen.getByText('跟随系统')).toBeInTheDocument();
  });

  it('changes theme when option is selected', async () => {
    render(<ThemeToggle />);
    
    // 等待主题加载
    await waitFor(() => {
      const button = screen.getByLabelText('切换主题');
      expect(button).toBeInTheDocument();
    });

    // 点击按钮显示选项
    fireEvent.click(screen.getByLabelText('切换主题'));
    
    // 选择深色主题
    fireEvent.click(screen.getByText('深色'));
    
    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  it('loads current theme on mount', async () => {
    render(<ThemeToggle />);
    
    await waitFor(() => {
      expect(getCurrentTheme).toHaveBeenCalled();
    });
  });

  it('closes dropdown when theme is selected', async () => {
    render(<ThemeToggle />);
    
    // 等待主题加载
    await waitFor(() => {
      const button = screen.getByLabelText('切换主题');
      expect(button).toBeInTheDocument();
    });

    // 点击按钮显示选项
    fireEvent.click(screen.getByLabelText('切换主题'));
    
    // 选择主题
    fireEvent.click(screen.getByText('浅色'));
    
    // 检查下拉菜单是否关闭
    expect(screen.queryByText('深色')).not.toBeInTheDocument();
  });
}); 