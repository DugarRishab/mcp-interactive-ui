import * as React from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  BookOpen,
  Code,
  Github,
  Home,
  Layout,
  Menu,
  Moon,
  Package,
  Play,
  Sun,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SearchCommand } from "@/components/SearchCommand"
import { useTheme } from "@/hooks/use-theme"
import { blocksMeta } from "@/data/blocks"

const SIDEBAR_NAV = [
  {
    category: "Getting Started",
    items: [
      { title: "Home", href: "/", icon: Home },
      { title: "Getting Started", href: "/getting-started", icon: BookOpen },
    ],
  },
  {
    category: "Blocks",
    items: Object.values(blocksMeta).map((block) => ({
      title: block.name,
      href: `/blocks/${block.id}`,
      icon: null,
    })),
  },
  {
    category: "Packages",
    items: [
      { title: "@mcp-interactive-ui/core", href: "/api/core", icon: Package },
      { title: "@mcp-interactive-ui/react", href: "/api/react", icon: Package },
      { title: "@mcp-interactive-ui/types", href: "/api/types", icon: Package },
      { title: "@mcp-interactive-ui/server", href: "/api/server", icon: Package },
      { title: "@mcp-interactive-ui/anthropic", href: "/api/anthropic", icon: Package },
      { title: "@mcp-interactive-ui/langchain", href: "/api/langchain", icon: Package },
      { title: "@mcp-interactive-ui/vue", href: "/api/vue", icon: Package },
      { title: "@mcp-interactive-ui/cli", href: "/api/cli", icon: Package },
    ],
  },
  {
    category: "Resources",
    items: [
      { title: "Examples", href: "/examples", icon: Play },
      { title: "API Reference", href: "/api", icon: Code },
    ],
  },
]

function SidebarContent({ theme, setTheme }: { theme: string; setTheme: (t: string) => void }) {
  const location = useLocation()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <NavLink to="/" className="flex items-center gap-2 font-semibold">
          <Layout className="h-5 w-5" />
          <span>MCP Interactive UI</span>
        </NavLink>
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-6">
          {SIDEBAR_NAV.map((section) => (
            <div key={section.category} className="space-y-2">
              <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.category}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.href
                  return (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      )}
                    >
                      {Icon && <Icon className="h-4 w-4 shrink-0" />}
                      <span className={cn(!Icon && "pl-6")}>{item.title}</span>
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground text-center">
          Built with ❤️ by{" "}
          <a
            href="https://rishab-dugar.com.np"
            target="_blank"
            rel="noreferrer"
            className="font-medium hover:text-primary transition-colors"
          >
            Rishab Dugar
          </a>
        </p>
      </div>
    </div>
  )
}

export function DocsLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="absolute left-4 top-4 z-50">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarContent theme={theme} setTheme={setTheme} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden h-screen w-72 flex-col border-r bg-background md:flex">
        <SidebarContent theme={theme} setTheme={setTheme} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-4 md:px-8">
            <div className="flex flex-1 items-center gap-4">
              <div className="md:hidden w-8" />
              <SearchCommand />
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              <a
                href="https://www.npmjs.com/package/mcp-interactive-ui"
                target="_blank"
                rel="noreferrer"
                className="flex items-center"
              >
                <Button variant="outline" className="text-muted-foreground hover:text-foreground">
                  {/* <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                    <path d="M0 0v24h24V0H0zm19.2 18.12c-.48.48-1.44.24-2.64-.24.96-1.44 1.44-2.88 1.44-2.88-.96-.48-1.92-1.44-1.92-2.88 0-1.44 1.2-2.64 2.64-2.64-.48-1.68-2.16-2.64-2.64-2.64-.48 0-.48 0-.96.24v-1.68h-1.2V7.2h1.2V5.76c1.68-.48 3.36-.24 4.32 1.2.48-.48.96-1.2 1.2-1.68.24.48.48.96.96 1.2.48.48 1.2.96 2.16 1.2h1.2v1.44h-1.2c-1.44 0-2.64-.96-2.64-.96s-1.2.96-1.44 1.44c1.2.48 2.16.24 2.64-.24-.24-.96-.48-1.92-.48-1.92.48 0 2.16 1.44 2.16 1.44v3.6s-.96-.48-1.44-1.44c-.48 1.2-1.92 2.16-1.92 2.16s-.24-.96-.24-2.64c-.48 1.2-.96 2.4-2.16 3.12v2.88h1.2v1.2z"/>
                  </svg> */}
                  npm
                </Button>
              </a>
              
              <a
                href="https://github.com/DugarRishab/mcp-interactive-ui"
                target="_blank"
                rel="noreferrer"
                className="flex items-center"
              >
                <Button variant="outline" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Github className="h-4 w-4" />
                </Button>
              </a>
              
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
