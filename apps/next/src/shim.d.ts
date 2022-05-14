declare module 'micro';
declare module 'micro-cors';
declare module '*.css';
type ToolbarItem = {
  name: string,
  image: string,
}

type ToolbarState = {
  slotSelected: number;
  slotContents: ToolbarItem[]
};
