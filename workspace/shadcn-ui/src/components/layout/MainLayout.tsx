import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
  if (isDesktop) {
    return (
      <div className="flex h-full">
        <div className="w-64 h-full">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="h-14 border-b flex items-center px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>
        <h1 className="ml-4 text-lg font-semibold">Simple Scribble</h1>
      </div>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}