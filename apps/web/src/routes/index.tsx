import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getDesktopBridge, isDesktop } from "../desktopBridge";

export const Route = createFileRoute("/")({
  component: HomeRoute,
});

function HomeRoute() {
  const bridge = getDesktopBridge();
  const [version, setVersion] = useState<string | null>(null);
  const [folder, setFolder] = useState<string | null>(null);

  useEffect(() => {
    bridge?.getAppVersion().then(setVersion);
  }, [bridge]);

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">electron-react-bridge</h1>
      <p className="text-neutral-400">
        Running in: <span className="text-white">{isDesktop ? "Electron" : "Browser"}</span>
      </p>
      {bridge ? (
        <div className="space-y-3">
          <p>App version: {version ?? "…"}</p>
          <button
            className="rounded bg-white px-3 py-1.5 text-sm text-black hover:bg-neutral-200"
            onClick={async () => setFolder(await bridge.pickFolder())}
          >
            Pick a folder
          </button>
          {folder && <p className="text-sm text-neutral-400">Picked: {folder}</p>}
          <button
            className="rounded border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-900"
            onClick={() => bridge.openExternal("https://example.com")}
          >
            Open example.com externally
          </button>
        </div>
      ) : (
        <p className="text-neutral-400">
          Desktop bridge unavailable. This page is running in a plain browser.
        </p>
      )}
    </div>
  );
}
