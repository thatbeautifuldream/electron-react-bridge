import { app, BrowserWindow } from "electron";
import * as path from "node:path";
import * as url from "node:url";
import { registerIpcHandlers } from "./ipc/handlers";

const isDev = !app.isPackaged;
const devServerUrl = process.env.VITE_DEV_SERVER_URL;

function resolveRendererIndex(): string {
  // Packaged: renderer is copied to resources/renderer by electron-builder.
  // Unpackaged build (bun run build && bun run start): load apps/web/dist directly.
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "renderer", "index.html");
  }
  return path.join(__dirname, "..", "..", "web", "dist", "index.html");
}

const TITLEBAR_HEIGHT = 40;

function createMainWindow(): BrowserWindow {
  const isMac = process.platform === "darwin";
  const window = new BrowserWindow({
    width: 1100,
    height: 720,
    title: "Electron React Bridge",
    backgroundColor: "#0a0a0a",
    titleBarStyle: isMac ? "hiddenInset" : "hidden",
    trafficLightPosition: isMac ? { x: 14, y: 13 } : undefined,
    titleBarOverlay: isMac
      ? undefined
      : {
          color: "#0a0a0a",
          symbolColor: "#f5f5f5",
          height: TITLEBAR_HEIGHT,
        },
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (isDev && devServerUrl) {
    void window.loadURL(devServerUrl);
    window.webContents.openDevTools({ mode: "detach" });
  } else {
    void window.loadURL(url.pathToFileURL(resolveRendererIndex()).toString());
  }

  return window;
}

app.whenReady().then(() => {
  registerIpcHandlers();
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
