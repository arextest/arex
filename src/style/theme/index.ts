export type DarkMode = boolean;
export type CompactMode = boolean;

export enum Theme {
  dark = "dark",
  light = "light",
}

export enum PrimaryColor {
  purple = "purple",
  red = "red",
  green = "green",
}

export const primaryColorPalette: { key: string; name: PrimaryColor }[] = [
  { key: "#955cf4", name: PrimaryColor.purple },
  { key: "#ff4d4f", name: PrimaryColor.red },
  { key: "#7cb305", name: PrimaryColor.green },
];
