import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FolderOpenIcon, ExternalLinkIcon } from "lucide-react";
import { getDesktopBridge, isDesktop } from "../desktopBridge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  component: HomeRoute,
});

const PLATFORM_LABELS: Record<string, string> = {
  darwin: "macOS",
  win32: "Windows",
  linux: "Linux",
};

function HomeRoute() {
  const bridge = getDesktopBridge();
  const [version, setVersion] = useState<string | null>(null);
  const [folder, setFolder] = useState<string | null>(null);

  useEffect(() => {
    bridge?.getAppVersion().then(setVersion);
  }, [bridge]);

  const platformLabel = bridge ? PLATFORM_LABELS[bridge.platform] ?? bridge.platform : "Web";

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header className="flex flex-col gap-3">
        <Badge variant="secondary" className="w-fit">
          {isDesktop ? "Electron renderer" : "Browser preview"}
        </Badge>
        <h1 className="max-w-[24ch] text-4xl font-semibold tracking-tight text-balance">
          A typed bridge between Electron and your React app.
        </h1>
        <p className="max-w-[56ch] text-pretty text-muted-foreground">
          The same Vite bundle runs in the desktop shell and the browser. The page below renders
          live values from the preload bridge when available, and falls back to a read-only view
          otherwise.
        </p>
      </header>

      <section aria-labelledby="runtime" className="mt-12">
        <h2 id="runtime" className="text-sm font-medium text-foreground">
          Runtime
        </h2>
        <dl className="mt-4 grid grid-cols-1 divide-y divide-border/60 border-y border-border/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <Stat label="Environment" value={isDesktop ? "Electron" : "Browser"} className="sm:pl-0" />
          <Stat label="Platform" value={platformLabel} />
          <Stat
            label="App version"
            value={bridge ? version ?? "…" : "—"}
            className="sm:pr-0"
            mono
          />
        </dl>
      </section>

      <section aria-labelledby="actions" className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="actions" className="text-sm font-medium text-foreground">
              Bridge actions
            </h2>
            <p className="mt-1 max-w-[60ch] text-sm text-muted-foreground">
              Call into the Electron main process from the renderer via the typed IPC contract.
            </p>
          </div>
        </div>
        {bridge ? (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Button
              variant="default"
              onClick={async () => setFolder(await bridge.pickFolder())}
            >
              <FolderOpenIcon data-icon="inline-start" aria-hidden />
              Pick a folder
            </Button>
            <Button
              variant="outline"
              onClick={() => bridge.openExternal("https://example.com")}
            >
              <ExternalLinkIcon data-icon="inline-start" aria-hidden />
              Open example.com
            </Button>
          </div>
        ) : (
          <p className="mt-5 text-sm text-muted-foreground">
            The desktop bridge is not attached. Launch the Electron app to enable these actions.
          </p>
        )}
        {folder && (
          <div className="mt-5 rounded-lg border border-border/60 bg-card/60 px-4 py-3 text-sm">
            <p className="text-xs font-medium text-muted-foreground">Last picked folder</p>
            <p className="mt-1 truncate font-mono text-foreground" title={folder}>
              {folder}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  className,
  mono,
}: {
  label: string;
  value: string;
  className?: string;
  mono?: boolean;
}) {
  return (
    <div className={`px-4 py-4 ${className ?? ""}`}>
      <dt className="truncate text-xs font-medium text-muted-foreground">{label}</dt>
      <dd
        className={`mt-1 text-base text-foreground tabular-nums ${mono ? "font-mono" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
