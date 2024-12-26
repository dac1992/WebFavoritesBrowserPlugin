import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TagCloud } from '../TagCloud';
import { Tag } from '../../../common/types';

describe('TagCloud', () => {
  const mockTags: Tag[] = [
    { id: '1', name: 'React', count: 10, createdAt: Date.now() },
    { id: '2', name: 'TypeScript', count: 5, createdAt: Date.now() },
    { id: '3', name: 'JavaScript', count: 3, createdAt: Date.now() },
  ];

  const mockProps = {
    tags: mockTags,
    selectedTags: ['1'],
    onTagClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all tags', () => {
    render(<TagCloud {...mockProps} />);
    
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });

  it('shows tag usage count', () => {
    render(<TagCloud {...mockProps} />);
    
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls onTagClick when a tag is clicked', () => {
    render(<TagCloud {...mockProps} />);
    
    fireEvent.click(screen.getByText('TypeScript'));
    expect(mockProps.onTagClick).toHaveBeenCalledWith('2');
  });

  it('applies selected style to selected tags', () => {
    render(<TagCloud {...mockProps} />);
    
    const selectedTag = screen.getByText('React').closest('button');
    expect(selectedTag).toHaveClass('bg-blue-500');
    expect(selectedTag).toHaveClass('text-white');
  });

  it('applies different sizes based on tag count', () => {
    render(<TagCloud {...mockProps} />);
    
    const mostUsedTag = screen.getByText('React').closest('button');
    const leastUsedTag = screen.getByText('JavaScript').closest('button');
    
    const mostUsedSize = mostUsedTag?.style.fontSize;
    const leastUsedSize = leastUsedTag?.style.fontSize;
    
    expect(mostUsedSize).not.toBe(leastUsedSize);
  });

  it('applies hover effect on tags', () => {
    render(<TagCloud {...mockProps} />);
    
    const tag = screen.getByText('TypeScript').closest('button');
    expect(tag).toHaveClass('hover:shadow-md');
  });

  it('renders empty state when no tags provided', () => {
    render(<TagCloud {...mockProps} tags={[]} selectedTags={[]} onTagClick={jest.fn()} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('handles click on already selected tag', () => {
    render(<TagCloud {...mockProps} />);
    
    fireEvent.click(screen.getByText('React'));
    expect(mockProps.onTagClick).toHaveBeenCalledWith('1');
  });
}); 