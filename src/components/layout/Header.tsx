
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/ui/mode-toggle";
import UserMenu from "@/components/auth/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isAuthenticated, canEdit } = useAuth();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const mainNavigation = [
    { name: "Painel", href: "/dashboard" },
    { name: "Mensal", href: "/monthly" },
    { name: "Anual", href: "/yearly" },
    { name: "Análise por Categoria", href: "/category-analysis" },
  ];

  const settingsSubMenu = [
    { name: "Configurações Gerais", href: "/settings" },
    { name: "Categorias", href: "/categories" },
    ...(canEdit ? [{ name: "Utilizadores", href: "/users" }] : []),
  ];

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
              {mainNavigation.map((item) => (
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
              
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger 
                      className={`transition-colors hover:text-foreground/80 ${
                        ['/settings', '/categories', '/users'].some(path => isActivePath(path)) ? 
                        "text-foreground font-semibold" : "text-foreground/60"
                      }`}>
                      Configurações
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[200px] gap-1 p-2">
                        {settingsSubMenu.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={`block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                              isActivePath(item.href) ? "bg-accent text-accent-foreground" : ""
                            }`}
                            onClick={closeMenu}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
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
                    {mainNavigation.map((item) => (
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
                    
                    <div className="py-2">
                      <p className="mb-2 text-lg">Configurações</p>
                      <div className="pl-4 space-y-2 border-l">
                        {settingsSubMenu.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center py-1 text-md hover:text-primary ${
                              isActivePath(item.href) ? "font-semibold text-primary" : ""
                            }`}
                            onClick={closeMenu}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
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
