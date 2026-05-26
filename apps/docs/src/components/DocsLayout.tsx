import * as React from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  BookOpen,
  Code,
  GithubIcon,
  Home,
  Layout,
  Moon,
  Package,
  Play,
  Sun,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
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

function DocsSidebar() {
  const location = useLocation()

  return (
    <Sidebar collapsible="offcanvas" className="border-r">
      <SidebarHeader className="border-b">
        <div className="flex h-14 items-center px-4">
          <NavLink to="/" className="flex items-center gap-2 font-semibold">
            <Layout className="h-5 w-5" />
            <span>MCP Interactive UI</span>
          </NavLink>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {SIDEBAR_NAV.map((section) => (
            <SidebarGroup key={section.category}>
              <SidebarGroupLabel>{section.category}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.href
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                          <NavLink to={item.href}>
                            {Icon && <Icon className="h-4 w-4" />}
                            <span>{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
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
      </SidebarFooter>
    </Sidebar>
  )
}

export function DocsLayout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen">
        <DocsSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4 md:px-8">
              <div className="flex flex-1 items-center gap-4">
                <SidebarTrigger />
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
                    <GithubIcon className="h-4 w-4" />
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
    </SidebarProvider>
  )
}
