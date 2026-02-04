import { ErrorBoundary } from "@/components/error-boundary";
import { PlayerBar } from "@/features/player";
import { Sidebar } from "../../components/sidebar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto pb-20">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <PlayerBar />
    </div>
  );
}
