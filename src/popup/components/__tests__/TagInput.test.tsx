import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TagInput } from '../TagInput';

describe('TagInput', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input field', () => {
    render(<TagInput tags={[]} onChange={mockOnChange} />);
    expect(screen.getByPlaceholderText('输入标签，按回车或逗号添加')).toBeInTheDocument();
  });

  it('displays existing tags', () => {
    const tags = ['React', 'TypeScript'];
    render(<TagInput tags={tags} onChange={mockOnChange} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('adds new tag on Enter key', () => {
    render(<TagInput tags={[]} onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText('输入标签，按回车或逗号添加');
    
    fireEvent.change(input, { target: { value: 'JavaScript' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnChange).toHaveBeenCalledWith(['JavaScript']);
  });

  it('adds new tag on comma', () => {
    render(<TagInput tags={[]} onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText('输入标签，按回车或逗号添加');
    
    fireEvent.change(input, { target: { value: 'JavaScript' } });
    fireEvent.keyDown(input, { key: ',' });

    expect(mockOnChange).toHaveBeenCalledWith(['JavaScript']);
  });

  it('adds new tag on blur', () => {
    render(<TagInput tags={[]} onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText('输入标签，按回车或逗号添加');
    
    fireEvent.change(input, { target: { value: 'JavaScript' } });
    fireEvent.blur(input);

    expect(mockOnChange).toHaveBeenCalledWith(['JavaScript']);
  });

  it('removes tag when clicking remove button', () => {
    const tags = ['React', 'TypeScript'];
    render(<TagInput tags={tags} onChange={mockOnChange} />);
    
    const removeButtons = screen.getAllByText('×');
    fireEvent.click(removeButtons[0]);

    expect(mockOnChange).toHaveBeenCalledWith(['TypeScript']);
  });

  it('does not add empty tags', () => {
    render(<TagInput tags={[]} onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText('输入标签，按回车或逗号添加');
    
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('does not add duplicate tags', () => {
    render(<TagInput tags={['React']} onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText('输入标签，按回车或逗号添加');
    
    fireEvent.change(input, { target: { value: 'React' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnChange).not.toHaveBeenCalled();
  });
}); 