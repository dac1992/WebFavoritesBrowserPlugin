import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TagManager } from '../TagManager';
import { getTags, createTag, updateTag, deleteTag } from '../../../common/chrome';

jest.mock('../../../common/chrome', () => ({
  getTags: jest.fn(),
  createTag: jest.fn(),
  updateTag: jest.fn(),
  deleteTag: jest.fn(),
}));

describe('TagManager', () => {
  const mockOnClose = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    (getTags as jest.Mock).mockResolvedValue([]);
    render(<TagManager onClose={mockOnClose} />);
    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  // ... existing tests ...
}); 