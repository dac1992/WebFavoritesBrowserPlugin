/// <reference types="react" />
/// <reference types="chrome" />

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

// 扩展Window接口
declare interface Window {
  chrome: typeof chrome;
} 