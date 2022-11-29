import { I18nextLng } from "./i18n";
import { CompactMode, DarkMode, PrimaryColor } from "./style/theme";

export type DefaultConfig = {
  language: I18nextLng;
  primaryColor: PrimaryColor;
  darkMode: DarkMode;
  compactMode: CompactMode;
};

const defaultConfig: DefaultConfig = {
  language: "en-US",
  primaryColor: PrimaryColor.purple, // TODO import
  darkMode: true,
  compactMode: false,
};

export default defaultConfig;
