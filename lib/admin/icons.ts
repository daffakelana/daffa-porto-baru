export const AVAILABLE_ICONS = [
  "PenTool",
  "Search",
  "Palette",
  "Code",
  "Layers",
  "Figma",
  "LineChart",
  "Users",
] as const;

export type AvailableIcon = (typeof AVAILABLE_ICONS)[number];