declare module 'micro';
declare module 'micro-cors';

type ToolbarItem = {
  name: string,
  image: string,
}

type ToolbarState = {
  slotSelected: number;
  slotContents: ToolbarItem[]
};
