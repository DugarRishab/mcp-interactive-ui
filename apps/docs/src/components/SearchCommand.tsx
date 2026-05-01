import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import Fuse from "fuse.js"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { blocksMeta } from "@/data/blocks"
import { packagesMeta, packageOrder } from "@/data/packages"

type SearchItem = {
  title: string
  path: string
  description?: string
  category: string
}

// Generate block search items
const blockSearchItems: SearchItem[] = Object.values(blocksMeta).map(block => ({
  title: block.name,
  path: `/blocks/${block.id}`,
  description: block.description.slice(0, 60) + "...",
  category: `${block.category} Blocks`,
}))

// Generate package search items
const packageSearchItems: SearchItem[] = packageOrder.map(id => {
  const pkg = packagesMeta[id]
  return {
    title: pkg.name,
    path: `/api/${pkg.id}`,
    description: pkg.description.slice(0, 60) + "...",
    category: "Packages",
  }
})

const searchData: SearchItem[] = [
  { title: "Home", path: "/", category: "Navigation" },
  { title: "Getting Started", path: "/getting-started", category: "Documentation" },
  { title: "Introduction", path: "/getting-started", description: "What is MCP Interactive UI", category: "Documentation" },
  { title: "Installation", path: "/getting-started", description: "How to install packages", category: "Documentation" },
  { title: "Quick Start", path: "/getting-started", description: "First steps tutorial", category: "Documentation" },
  { title: "Block Components", path: "/blocks", category: "Components" },
  { title: "All Blocks", path: "/blocks", description: "View all 25 blocks", category: "Components" },
  ...blockSearchItems,
  { title: "Examples", path: "/examples", category: "Resources" },
  { title: "React Chat", path: "/examples", description: "Chat interface example", category: "Examples" },
  { title: "Vue Dashboard", path: "/examples", description: "Analytics dashboard", category: "Examples" },
  { title: "LangChain Agent", path: "/examples", description: "Agent with tool use", category: "Examples" },
  { title: "Node API", path: "/examples", description: "Express API example", category: "Examples" },
  { title: "API Reference", path: "/api", category: "Documentation" },
  { title: "All Packages", path: "/api", description: "View all 8 packages", category: "Documentation" },
  ...packageSearchItems,
]

const fuse = new Fuse(searchData, {
  keys: ["title", "description", "category"],
  threshold: 0.3,
})

export function SearchCommand() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const navigate = useNavigate()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const results = query ? fuse.search(query).map((r) => r.item) : searchData

  const groupedResults = results.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, SearchItem[]>)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative w-full justify-start text-muted-foreground sm:pr-12 md:w-40 lg:w-64 border"
      >
        <Search className="mr-2 h-4 w-4" />
        Search...
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type to search..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {Object.entries(groupedResults).map(([category, items]) => (
            <React.Fragment key={category}>
              <CommandGroup heading={category}>
                {items.map((item) => (
                  <CommandItem
                    key={item.title}
                    onSelect={() => {
                      navigate(item.path)
                      setOpen(false)
                    }}
                  >
                    <div className="flex flex-col">
                      <span>{item.title}</span>
                      {item.description && (
                        <span className="text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
