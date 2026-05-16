import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRightIcon } from "lucide-react";
import { getDesktopBridge } from "../desktopBridge";

export const Route = createFileRoute("/about")({
  component: AboutRoute,
});

const STACK = [
  {
    label: "Renderer",
    value: "React 19 + TanStack Router",
    href: "https://tanstack.com/router",
  },
  { label: "Bundler", value: "Vite 5", href: "https://vitejs.dev" },
  { label: "Shell", value: "Electron", href: "https://www.electronjs.org" },
  { label: "Styling", value: "Tailwind v4 + shadcn/ui", href: "https://ui.shadcn.com" },
  { label: "Type system", value: "TypeScript (strict)", href: "https://www.typescriptlang.org" },
  { label: "Build orchestrator", value: "Turborepo + Bun", href: "https://turbo.build" },
] as const;

function AboutRoute() {
  const bridge = getDesktopBridge();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          About
        </p>
        <h1 className="max-w-[24ch] text-4xl font-semibold tracking-tight text-balance">
          A minimal template for typed desktop apps.
        </h1>
        <p className="max-w-[60ch] text-pretty text-muted-foreground">
          electron-react-bridge wires a React renderer to an Electron shell through a single shared
          contract package, so every IPC call is type-checked end-to-end. The same bundle also runs
          standalone in a browser for fast iteration.
        </p>
      </header>

      <section aria-labelledby="stack" className="mt-12">
        <h2 id="stack" className="text-sm font-medium text-foreground">
          Stack
        </h2>
        <dl className="mt-4 divide-y divide-border/60 border-y border-border/60">
          {STACK.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-3 items-baseline gap-4 px-1 py-3 sm:grid-cols-4"
            >
              <dt className="col-span-1 truncate text-sm font-medium text-foreground">
                {row.label}
              </dt>
              <dd className="col-span-2 text-sm text-muted-foreground sm:col-span-3">
                <a
                  href={row.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (bridge) {
                      e.preventDefault();
                      bridge.openExternal(row.href);
                    }
                  }}
                  className="inline-flex items-center gap-1 text-foreground hover:underline"
                >
                  {row.value}
                  <ArrowUpRightIcon aria-hidden className="size-3.5 text-muted-foreground" />
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="how" className="mt-12">
        <h2 id="how" className="text-sm font-medium text-foreground">
          How it works
        </h2>
        <ol role="list" className="mt-4 space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span
              aria-hidden
              className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-muted text-[0.7rem] font-medium text-foreground tabular-nums"
            >
              1
            </span>
            <p className="text-pretty">
              <span className="text-foreground">Contracts</span> are declared once in{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.8rem]">
                @app/contracts
              </code>{" "}
              and re-used by the renderer and the main process.
            </p>
          </li>
          <li className="flex gap-3">
            <span
              aria-hidden
              className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-muted text-[0.7rem] font-medium text-foreground tabular-nums"
            >
              2
            </span>
            <p className="text-pretty">
              The Electron <span className="text-foreground">preload script</span> implements that
              contract, exposing a single{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.8rem]">
                window.desktopBridge
              </code>{" "}
              object to the renderer.
            </p>
          </li>
          <li className="flex gap-3">
            <span
              aria-hidden
              className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-muted text-[0.7rem] font-medium text-foreground tabular-nums"
            >
              3
            </span>
            <p className="text-pretty">
              The renderer detects the bridge at runtime and gracefully degrades when it isn't
              present, so the same code runs in the browser.
            </p>
          </li>
        </ol>
      </section>
    </div>
  );
}
