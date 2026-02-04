import { ErrorBoundary } from "@/components/error-boundary"

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="min-h-screen w-full bg-black selection:bg-white/20 selection:text-black">
      <ErrorBoundary>{children}</ErrorBoundary>
    </main>
  )
}
