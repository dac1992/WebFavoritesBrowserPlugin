import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TagInput } from '../TagInput';
import { Tag } from '../../../common/types';

describe('TagInput', () => {
  const mockTags: Tag[] = [
    { id: '1', name: 'React', count: 5, createdAt: Date.now() },
    { id: '2', name: 'TypeScript', count: 3, createdAt: Date.now() },
    { id: '3', name: 'JavaScript', count: 7, createdAt: Date.now() },
  ];

  const mockProps = {
    value: ['React'],
    suggestions: mockTags,
    onChange: jest.fn(),
    onCreateTag: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input field and selected tags', () => {
    render(<TagInput {...mockProps} />);
    
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('输入标签...')).toBeInTheDocument();
  });

  it('shows suggestions when typing', () => {
    render(<TagInput {...mockProps} />);
    
    const input = screen.getByPlaceholderText('输入标签...');
    fireEvent.change(input, { target: { value: 'Type' } });
    
    expect(screen.getByText('TypeScript (3次使用)')).toBeInTheDocument();
  });

  it('filters out already selected tags from suggestions', () => {
    render(<TagInput {...mockProps} />);
    
    const input = screen.getByPlaceholderText('输入标签...');
    fireEvent.change(input, { target: { value: 'React' } });
    
    expect(screen.queryByText('React (5次使用)')).not.toBeInTheDocument();
  });

  it('calls onChange when removing a tag', () => {
    render(<TagInput {...mockProps} />);
    
    const removeButton = screen.getByText('×');
    fireEvent.click(removeButton);
    
    expect(mockProps.onChange).toHaveBeenCalledWith([]);
  });

  it('calls onChange and onCreateTag when adding a new tag', () => {
    render(<TagInput {...mockProps} />);
    
    const input = screen.getByPlaceholderText('输入标签...');
    fireEvent.change(input, { target: { value: 'NewTag' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(mockProps.onChange).toHaveBeenCalledWith(['React', 'NewTag']);
    expect(mockProps.onCreateTag).toHaveBeenCalledWith('NewTag');
  });

  it('adds existing tag from suggestions without calling onCreateTag', () => {
    render(<TagInput {...mockProps} />);
    
    const input = screen.getByPlaceholderText('输入标签...');
    fireEvent.change(input, { target: { value: 'Type' } });
    
    const suggestion = screen.getByText('TypeScript (3次使用)');
    fireEvent.click(suggestion);
    
    expect(mockProps.onChange).toHaveBeenCalledWith(['React', 'TypeScript']);
    expect(mockProps.onCreateTag).not.toHaveBeenCalled();
  });

  it('handles keyboard navigation in suggestions', () => {
    render(<TagInput {...mockProps} />);
    
    const input = screen.getByPlaceholderText('输入标签...');
    fireEvent.change(input, { target: { value: 'Script' } });
    
    // 按下箭头键选择建议
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(mockProps.onChange).toHaveBeenCalledWith(['React', 'TypeScript']);
  });

  it('clears input after adding a tag', () => {
    render(<TagInput {...mockProps} />);
    
    const input = screen.getByPlaceholderText('输入标签...');
    fireEvent.change(input, { target: { value: 'NewTag' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(input).toHaveValue('');
  });

  it('removes the last tag when pressing backspace with empty input', () => {
    render(<TagInput {...mockProps} />);
    
    const input = screen.getByPlaceholderText('输入标签...');
    fireEvent.keyDown(input, { key: 'Backspace' });
    
    expect(mockProps.onChange).toHaveBeenCalledWith([]);
  });
}); 