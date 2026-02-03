import { Inter } from "next/font/google"

import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"
import { PlayerBar } from "../components/player-bar"
import { Sidebar } from "../components/sidebar"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased dark`}>
        <Providers>
          <div className="flex h-screen w-full bg-background">
            <Sidebar />
            <main className="flex-1 overflow-auto pb-20">
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
            <PlayerBar />
          </div>
        </Providers>
      </body>
    </html>
  )
}
