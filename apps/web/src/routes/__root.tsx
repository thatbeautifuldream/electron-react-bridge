import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { getDesktopBridge } from "../desktopBridge";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const bridge = getDesktopBridge();
  const platform = bridge?.platform;
  const isMac = platform === "darwin";
  const isWindowsOrLinux = platform === "win32" || platform === "linux";

  return (
    <div className="isolate flex min-h-dvh flex-col bg-background text-foreground antialiased">
      <header
        className="sticky top-0 z-10 flex h-10 shrink-0 items-center gap-6 border-b border-border/60 bg-background/80 backdrop-blur select-none"
        style={{
          WebkitAppRegion: "drag",
          paddingLeft: isMac ? 80 : 12,
          paddingRight: isWindowsOrLinux ? 140 : 12,
        }}
      >
        <div className="flex items-center gap-2">
          <span aria-hidden className="size-1.5 rounded-full bg-foreground/60" />
          <span className="text-xs font-medium text-foreground/80">
            Electron React Bridge
          </span>
        </div>
        <nav
          className="flex items-center gap-0.5 text-sm"
          style={{ WebkitAppRegion: "no-drag" }}
        >
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}

function NavLink({ to, children }: { to: "/" | "/about"; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="rounded-md px-2.5 py-1 text-[0.8rem] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground [&.active]:bg-accent [&.active]:text-foreground"
    >
      {children}
    </Link>
  );
}
