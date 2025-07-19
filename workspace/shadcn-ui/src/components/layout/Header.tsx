import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { StickyNote } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-background sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <StickyNote className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Simple Scribble</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-4">
            <Link to="/notes">
              <Button variant="ghost">My Notes</Button>
            </Link>
            <Link to="/#features">
              <Button variant="ghost">Features</Button>
            </Link>
            <Link to="/#pricing">
              <Button variant="ghost">Pricing</Button>
            </Link>
          </div>
          <ThemeToggle />
          <Link to="/notes" className="hidden sm:block">
            <Button>Go to App</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}