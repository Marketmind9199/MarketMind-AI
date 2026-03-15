import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Sparkles } from "lucide-react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MarketMind AI ",
  description: "AI-powered marketing content and strategy planning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex flex-col bg-background text-foreground overflow-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <div className="flex h-full w-full overflow-hidden">
            <SidebarProvider>
              <AppSidebar />
              <main className="flex-1 flex flex-col h-full w-full bg-muted/20 relative">
                <header className="flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-10">
                  <SidebarTrigger />
                  <div className="font-semibold text-lg tracking-tight bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent flex items-center gap-2 select-none">
                    <Sparkles className="w-5 h-5 text-primary shrink-0" />
                    MarketMind AI
                  </div>
                </header>
                <div className="flex-1 flex flex-col overflow-hidden relative">
                  {children}
                </div>
              </main>
            </SidebarProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
