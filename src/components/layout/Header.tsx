
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/ui/mode-toggle";
import UserMenu from "@/components/auth/UserMenu";
import { useAuth } from "@/hooks/useAuth";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isAuthenticated, canEdit } = useAuth();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Mensal", href: "/monthly" },
    { name: "Anual", href: "/yearly" },
    { name: "Categorias", href: "/categories" },
    { name: "Análise por Categoria", href: "/category-analysis" },
    { name: "Configurações", href: "/settings" },
  ];

  // Para utilizadores com permissão de editor, adicionar a gestão de utilizadores
  if (canEdit) {
    navigation.push({ name: "Utilizadores", href: "/users" });
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Gestão Financeira</span>
          </Link>
          
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`transition-colors hover:text-foreground/80 ${
                    isActivePath(item.href) ? "text-foreground font-semibold" : "text-foreground/60"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            
            <UserMenu />
            
            {isAuthenticated && isMobile && (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden"
                    onClick={toggleMenu}
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader className="mb-4">
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>
                      Navegue pela aplicação
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-2 py-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center py-2 text-lg hover:text-primary ${
                          isActivePath(item.href) ? "font-semibold text-primary" : ""
                        }`}
                        onClick={closeMenu}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
