import React, { useMemo, useCallback } from 'react';
import { TagCloudProps } from '../../common/types';

export const TagCloud: React.FC<TagCloudProps> = React.memo(({
  tags,
  selectedTags,
  onTagClick
}) => {
  // 计算标签大小范围
  const { minCount, maxCount, range } = useMemo(() => {
    const minCount = Math.min(...tags.map(t => t.count));
    const maxCount = Math.max(...tags.map(t => t.count));
    const range = maxCount - minCount;
    return { minCount, maxCount, range };
  }, [tags]);

  // 计算标签大小
  const getTagSize = useCallback((count: number): string => {
    const normalized = range === 0 ? 1 : (count - minCount) / range;
    const minSize = 0.75; // 最小字体比例
    const maxSize = 1.5;  // 最大字体比例
    const size = minSize + normalized * (maxSize - minSize);
    return `${size}rem`;
  }, [minCount, range]);

  // 计算标签颜色深度
  const getTagColor = useCallback((count: number, isSelected: boolean): string => {
    if (isSelected) {
      return 'bg-blue-500 text-white';
    }
    const normalized = range === 0 ? 1 : (count - minCount) / range;
    const colorLevels = [100, 200, 300, 400, 500];
    const colorIndex = Math.floor(normalized * (colorLevels.length - 1));
    return `bg-blue-${colorLevels[colorIndex]} text-blue-900`;
  }, [minCount, range]);

  // 使用useMemo缓存标签渲染结果
  const renderedTags = useMemo(() => (
    tags.map(tag => {
      const isSelected = selectedTags.includes(tag.id);
      return (
        <button
          key={tag.id}
          onClick={() => onTagClick(tag.id)}
          className={`
            px-3 py-1 rounded-full transition-all
            hover:shadow-md
            ${getTagColor(tag.count, isSelected)}
            ${isSelected ? 'ring-2 ring-blue-500' : ''}
          `}
          style={{ fontSize: getTagSize(tag.count) }}
        >
          {tag.name}
          <span className="ml-1 text-xs opacity-75">
            {tag.count}
          </span>
        </button>
      );
    })
  ), [tags, selectedTags, onTagClick, getTagSize, getTagColor]);

  return (
    <div className="flex flex-wrap gap-2 p-4">
      {renderedTags}
    </div>
  );
});

TagCloud.displayName = 'TagCloud';

export default TagCloud; 