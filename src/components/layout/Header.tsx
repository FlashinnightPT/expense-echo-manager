
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const isMobile = useIsMobile();
  const location = useLocation();

  const links = [
    { name: "Início", path: "/" },
    { name: "Mensal", path: "/monthly" },
    { name: "Anual", path: "/yearly" },
    { name: "Categorias", path: "/categories" },
    { name: "Opções", path: "/settings" }
  ];

  // Determine if a link is active
  const isActive = (path: string) => {
    return path === "/"
      ? location.pathname === path
      : location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Finanças Pessoais
            </span>
          </Link>
          <Separator orientation="vertical" className="h-6" />
        </div>
        
        <div className="flex-1 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link to="/" className="flex items-center mb-6">
                <span className="font-bold">Finanças Pessoais</span>
              </Link>
              <nav className="grid gap-2 place-items-start">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-foreground/80 py-1 px-2 rounded-md w-full",
                      isActive(link.path)
                        ? "text-foreground bg-accent"
                        : "text-foreground/60"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        
        <Link to="/" className="md:hidden">
          <span className="font-bold">Finanças Pessoais</span>
        </Link>

        <nav className="hidden md:flex flex-1 items-center justify-center space-x-1">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
                isActive(link.path)
                  ? "text-foreground bg-accent"
                  : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* Placeholder for right side content (user account, theme toggle, etc.) */}
        </div>
      </div>
    </header>
  );
}

export default Header;
