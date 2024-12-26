// 书签数据类型
export interface Bookmark {
  id: string;
  title: string;
  url: string;
  tags: string[];
  description: string;
  createdAt: number;
  updatedAt: number;
}

// 搜索栏属性类型
export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

// 书签列表属性类型
export interface BookmarkListProps {
  searchQuery: string;
}

// 保存书签表单数据类型
export interface BookmarkFormData {
  title: string;
  url: string;
  tags: string[];
  description: string;
}

// 标签类型
export interface Tag {
  id: string;
  name: string;
  count: number;
  color?: string;
  createdAt: number;
}

// 标签云组件属性
export interface TagCloudProps {
  tags: Tag[];
  selectedTags: string[];
  onTagClick: (tagId: string) => void;
}

// 标签输入组件属性
export interface TagInputProps {
  value: string[];
  suggestions: Tag[];
  onChange: (tags: string[]) => void;
  onCreateTag?: (tagName: string) => void;
}

// 标签管理组件属性
export interface TagManagerProps {
  onClose: () => void;
}

// Chrome存储数据类型
export interface StorageData {
  bookmarks: Bookmark[];
  tags: Tag[];
  settings: {
    theme: 'light' | 'dark' | 'system';
    defaultView: 'list' | 'grid';
    tagsDisplay: 'cloud' | 'list';
  };
} 