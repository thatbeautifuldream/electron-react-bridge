import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutRoute,
});

function AboutRoute() {
  return (
    <div className="max-w-2xl space-y-3">
      <h1 className="text-2xl font-semibold">About</h1>
      <p className="text-neutral-400">
        This page is served from the same Vite bundle as the Electron renderer. The route was
        generated automatically by <code className="text-white">@tanstack/router-plugin</code>.
      </p>
    </div>
  );
}
