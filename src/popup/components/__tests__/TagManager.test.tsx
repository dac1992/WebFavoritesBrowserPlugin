import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TagManager } from '../TagManager';
import { Tag } from '../../../common/types';

// Mock Chrome API
const mockChrome = {
  storage: {
    sync: {
      get: jest.fn(),
      set: jest.fn(),
    },
  },
};

// 使用类型断言
global.chrome = mockChrome as unknown as typeof chrome;

describe('TagManager', () => {
  const mockTags: Tag[] = [
    { id: '1', name: 'React', count: 5, createdAt: Date.now() },
    { id: '2', name: 'TypeScript', count: 3, createdAt: Date.now() },
  ];

  const mockProps = {
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockChrome.storage.sync.get.mockResolvedValue({ tags: mockTags });
  });

  it('renders loading state initially', () => {
    render(<TagManager {...mockProps} />);
    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('loads and displays tags', async () => {
    render(<TagManager {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });
  });

  it('adds new tag', async () => {
    render(<TagManager {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('输入新标签名称')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('输入新标签名称');
    fireEvent.change(input, { target: { value: 'NewTag' } });
    
    const addButton = screen.getByText('添加');
    fireEvent.click(addButton);

    expect(mockChrome.storage.sync.set).toHaveBeenCalled();
  });

  it('edits existing tag', async () => {
    render(<TagManager {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    // 点击编辑按钮
    const editButtons = screen.getAllByText('编辑');
    fireEvent.click(editButtons[0]);

    // 修改标签名
    const input = screen.getByDisplayValue('React');
    fireEvent.change(input, { target: { value: 'ReactJS' } });

    // 保存修改
    const saveButton = screen.getByText('保存');
    fireEvent.click(saveButton);

    expect(mockChrome.storage.sync.set).toHaveBeenCalled();
  });

  it('deletes tag', async () => {
    render(<TagManager {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    // Mock window.confirm
    const mockConfirm = jest.spyOn(window, 'confirm');
    mockConfirm.mockImplementation(() => true);

    // 点击删除按钮
    const deleteButtons = screen.getAllByText('删除');
    fireEvent.click(deleteButtons[0]);

    expect(mockChrome.storage.sync.set).toHaveBeenCalled();
    mockConfirm.mockRestore();
  });

  it('cancels tag editing', async () => {
    render(<TagManager {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    // 点击编辑按钮
    const editButtons = screen.getAllByText('编辑');
    fireEvent.click(editButtons[0]);

    // 修改标签名
    const input = screen.getByDisplayValue('React');
    fireEvent.change(input, { target: { value: 'ReactJS' } });

    // 取消编辑
    const cancelButton = screen.getByText('取消');
    fireEvent.click(cancelButton);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('ReactJS')).not.toBeInTheDocument();
  });

  it('shows error state when loading fails', async () => {
    mockChrome.storage.sync.get.mockRejectedValue(new Error('Failed to load'));
    
    render(<TagManager {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('加载标签失败')).toBeInTheDocument();
    });
  });

  it('disables add button when input is empty', async () => {
    render(<TagManager {...mockProps} />);
    
    await waitFor(() => {
      const addButton = screen.getByText('添加');
      expect(addButton).toBeDisabled();
    });
  });

  it('closes manager when close button is clicked', async () => {
    render(<TagManager {...mockProps} />);
    
    await waitFor(() => {
      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);
      expect(mockProps.onClose).toHaveBeenCalled();
    });
  });
}); 