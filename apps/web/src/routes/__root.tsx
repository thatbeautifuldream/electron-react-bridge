import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { getDesktopBridge } from "../desktopBridge";

export const Route = createRootRoute({
  component: RootLayout,
});

const TITLEBAR_HEIGHT = 40;

function RootLayout() {
  const bridge = getDesktopBridge();
  const platform = bridge?.platform;
  const isMac = platform === "darwin";
  const isWindowsOrLinux = platform === "win32" || platform === "linux";

  return (
    <div className="min-h-full flex flex-col">
      <header
        className="flex items-center border-b border-neutral-800 select-none bg-neutral-950/80 backdrop-blur"
        style={{
          height: TITLEBAR_HEIGHT,
          // Make the whole titlebar a macOS drag region; opt buttons out below.
          WebkitAppRegion: "drag",
          // Reserve space for traffic lights on macOS / window controls on Win+Linux.
          paddingLeft: isMac ? 80 : 12,
          paddingRight: isWindowsOrLinux ? 140 : 12,
        }}
      >
        <div className="text-xs font-medium text-neutral-300 mr-6">Electron React Bridge</div>
        <nav className="flex gap-1 text-sm" style={{ WebkitAppRegion: "no-drag" }}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

function NavLink({ to, children }: { to: "/" | "/about"; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="px-2.5 py-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-900 [&.active]:text-white [&.active]:bg-neutral-900"
    >
      {children}
    </Link>
  );
}
