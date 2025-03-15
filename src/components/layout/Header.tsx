
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const navigationItems = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/monthly", label: "Mensal" },
  { path: "/yearly", label: "Anual" },
  { path: "/category-analysis", label: "Análise por Categoria" },
  { path: "/categories", label: "Gestão de Categorias" },
  { path: "/settings", label: "Definições" },
];

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link to="/" className="font-bold text-2xl">
          CDW <span className="text-primary">Financeiro</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === item.path
                  ? "text-primary"
                  : "text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Entrar
          </Button>
          <Button size="sm">Criar Conta</Button>
          {isMobile && (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-sm">
                <div className="grid gap-4 py-4">
                  <Link to="/" className="font-bold text-2xl">
                    CDW <span className="text-primary">Financeiro</span>
                  </Link>
                  <Button
                    variant="ghost"
                    className="justify-start px-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link
                      to="/dashboard"
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        location.pathname === "/dashboard"
                          ? "text-primary"
                          : "text-foreground"
                      )}
                    >
                      Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start px-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link
                      to="/monthly"
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        location.pathname === "/monthly"
                          ? "text-primary"
                          : "text-foreground"
                      )}
                    >
                      Mensal
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start px-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link
                      to="/yearly"
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        location.pathname === "/yearly"
                          ? "text-primary"
                          : "text-foreground"
                      )}
                    >
                      Anual
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start px-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link
                      to="/category-analysis"
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        location.pathname === "/category-analysis"
                          ? "text-primary"
                          : "text-foreground"
                      )}
                    >
                      Análise por Categoria
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start px-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link
                      to="/categories"
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        location.pathname === "/categories"
                          ? "text-primary"
                          : "text-foreground"
                      )}
                    >
                      Gestão de Categorias
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start px-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link
                      to="/settings"
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        location.pathname === "/settings"
                          ? "text-primary"
                          : "text-foreground"
                      )}
                    >
                      Definições
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    Entrar
                  </Button>
                  <Button size="sm">Criar Conta</Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
