import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { TagInputProps, Tag } from '../../common/types';

export const TagInput: React.FC<TagInputProps> = React.memo(({
  value,
  suggestions,
  onChange,
  onCreateTag = () => {}
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // 使用useMemo优化过滤逻辑
  const filteredSuggestions = useMemo(() => {
    if (!inputValue.trim()) return [];
    
    return suggestions
      .filter(tag => 
        tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        !value.includes(tag.name)
      )
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [inputValue, suggestions, value]);

  // 使用useCallback优化事件处理函数
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setActiveSuggestion(-1);
    setShowSuggestions(true);
  }, []);

  const handleAddTag = useCallback((tagName: string) => {
    if (!tagName.trim() || value.includes(tagName)) return;

    const existingTag = suggestions.find(t => t.name === tagName);
    if (existingTag) {
      onChange([...value, tagName]);
    } else {
      onCreateTag(tagName);
      onChange([...value, tagName]);
    }
    
    setInputValue('');
    setShowSuggestions(false);
    setActiveSuggestion(-1);
    inputRef.current?.focus();
  }, [value, suggestions, onChange, onCreateTag]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  }, [value, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      if (activeSuggestion >= 0 && filteredSuggestions[activeSuggestion]) {
        handleAddTag(filteredSuggestions[activeSuggestion].name);
      } else {
        handleAddTag(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      handleRemoveTag(value[value.length - 1]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => prev > 0 ? prev - 1 : prev);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }
  }, [inputValue, value, filteredSuggestions, activeSuggestion, handleAddTag, handleRemoveTag]);

  // 点击外部关闭建议列表
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 使用useMemo缓存渲染的标签
  const renderedTags = useMemo(() => (
    value.map(tag => (
      <span
        key={tag}
        className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
      >
        {tag}
        <button
          type="button"
          onClick={() => handleRemoveTag(tag)}
          className="text-blue-600 hover:text-blue-800"
        >
          ×
        </button>
      </span>
    ))
  ), [value, handleRemoveTag]);

  // 使用useMemo缓存渲染的建议列表
  const renderedSuggestions = useMemo(() => (
    showSuggestions && filteredSuggestions.length > 0 && (
      <div
        ref={suggestionsRef}
        className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg"
      >
        {filteredSuggestions.map((suggestion, index) => (
          <div
            key={suggestion.id}
            onClick={() => handleAddTag(suggestion.name)}
            className={`px-4 py-2 cursor-pointer ${
              index === activeSuggestion
                ? 'bg-blue-50 text-blue-700'
                : 'hover:bg-gray-50'
            }`}
          >
            <span className="font-medium">{suggestion.name}</span>
            <span className="ml-2 text-sm text-gray-500">
              ({suggestion.count}次使用)
            </span>
          </div>
        ))}
      </div>
    )
  ), [showSuggestions, filteredSuggestions, activeSuggestion, handleAddTag]);

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 p-2 border rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
        {renderedTags}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          className="flex-1 min-w-[100px] outline-none bg-transparent"
          placeholder={value.length === 0 ? "输入标签..." : ""}
        />
      </div>
      {renderedSuggestions}
    </div>
  );
});

TagInput.displayName = 'TagInput';

export default TagInput; 