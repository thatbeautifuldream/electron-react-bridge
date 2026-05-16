# electron-react-bridge

<img width="1212" height="832" alt="Screenshot 2026-05-17 at 12 05 06 AM" src="https://github.com/user-attachments/assets/310bbc39-3dc4-4625-824a-eaae0128dc3d" />

<img width="1212" height="832" alt="Screenshot 2026-05-17 at 12 05 01 AM" src="https://github.com/user-attachments/assets/7a391912-6817-44b0-9f79-47d32f247083" />

Minimal monorepo template: an Electron desktop app shell + a Vite/React renderer that also runs as a plain web app. Renderer and main process talk through a strongly typed `window.desktopBridge` defined once in `packages/contracts`.

## Layout

```
apps/
  desktop/   Electron main + preload (tsdown -> dist-electron/*.cjs)
  web/       Vite + React renderer (also runnable as a standalone web app)
packages/
  contracts/ Shared DesktopBridge interface + IPC channel constants
```

## Develop

```sh
bun install
bun run dev
```

This starts Vite on `http://localhost:5173` and Electron, which loads the dev server. Edit web code and HMR works; edit desktop code and the launcher restarts Electron.

## Build

```sh
bun run build   # builds web -> apps/web/dist and desktop -> apps/desktop/dist-electron
bun run start   # runs the built Electron app against the built renderer
```

## Package (installer)

```sh
bun run --cwd apps/desktop package         # current platform
bun run --cwd apps/desktop package:mac     # DMG (arm64 + x64)
bun run --cwd apps/desktop package:win     # NSIS installer
bun run --cwd apps/desktop package:linux   # AppImage
```

Output lands in `apps/desktop/release/`. Config: `apps/desktop/electron-builder.config.cjs`.

## Stack

- **Renderer**: Vite 5, React 19, TanStack Router (file-based routing in `apps/web/src/routes/`), Tailwind v4 (`@tailwindcss/vite`).
- **Main**: Electron 33, bundled with tsdown to CJS in `dist-electron/`.
- **Contract**: shared `DesktopBridge` interface in `packages/contracts`.
- **Packaging**: electron-builder.

## Adding an IPC method

1. Add the method to `DesktopBridge` and add a channel constant in `packages/contracts/src/index.ts`.
2. Expose it in `apps/desktop/src/preload.ts` (one line forwarding to `ipcRenderer.invoke`).
3. Handle it in `apps/desktop/src/ipc/handlers.ts` with `ipcMain.handle(CHANNEL, ...)`.
4. Call it from the renderer via `window.desktopBridge.yourMethod(...)`.

The interface is the contract — TypeScript will tell you if any of the four sides drifts.
