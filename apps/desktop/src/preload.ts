import { contextBridge, ipcRenderer } from "electron";
import { IpcChannels, type DesktopBridge, type Platform, type Theme } from "@app/contracts";

const platform = process.platform as Platform;

const bridge: DesktopBridge = {
  platform,
  getAppVersion: () => ipcRenderer.invoke(IpcChannels.GET_APP_VERSION),
  pickFolder: () => ipcRenderer.invoke(IpcChannels.PICK_FOLDER),
  openExternal: (url) => ipcRenderer.invoke(IpcChannels.OPEN_EXTERNAL, url),
  setTheme: (theme) => ipcRenderer.invoke(IpcChannels.SET_THEME, theme),
  onThemeChanged: (listener) => {
    const wrapped = (_event: Electron.IpcRendererEvent, theme: Theme) => listener(theme);
    ipcRenderer.on(IpcChannels.ON_THEME_CHANGED, wrapped);
    return () => ipcRenderer.removeListener(IpcChannels.ON_THEME_CHANGED, wrapped);
  },
};

contextBridge.exposeInMainWorld("desktopBridge", bridge);
