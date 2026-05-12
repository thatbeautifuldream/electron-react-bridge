export const IpcChannels = {
  GET_APP_VERSION: "app:get-version",
  PICK_FOLDER: "dialog:pick-folder",
  OPEN_EXTERNAL: "shell:open-external",
  SET_THEME: "theme:set",
  ON_THEME_CHANGED: "theme:changed",
} as const;

export type Theme = "light" | "dark" | "system";
export type Platform = "darwin" | "win32" | "linux";

export interface DesktopBridge {
  readonly platform: Platform;
  getAppVersion(): Promise<string>;
  pickFolder(): Promise<string | null>;
  openExternal(url: string): Promise<void>;
  setTheme(theme: Theme): Promise<void>;
  onThemeChanged(listener: (theme: Theme) => void): () => void;
}

declare global {
  interface Window {
    desktopBridge?: DesktopBridge;
  }
}
