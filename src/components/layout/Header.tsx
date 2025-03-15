
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
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
      <div className="container flex h-20 items-center justify-between py-2">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-20 h-20 flex items-center justify-center">
            <img 
              src="/lovable-uploads/d5b7136a-b85f-4a1d-9a4f-68f2d49b7347.png" 
              alt="AC Morais Logo" 
              className="max-h-full max-w-full object-contain" 
            />
          </div>
          <span className="font-bold text-2xl">
            CDW <span className="text-primary">Financeiro</span>
          </span>
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
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <img 
                        src="/lovable-uploads/d5b7136a-b85f-4a1d-9a4f-68f2d49b7347.png" 
                        alt="AC Morais Logo" 
                        className="max-h-full max-w-full object-contain" 
                      />
                    </div>
                    <span className="font-bold text-2xl">
                      CDW <span className="text-primary">Financeiro</span>
                    </span>
                  </div>
                  {navigationItems.map((item) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      className="justify-start px-4"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link
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
                    </Button>
                  ))}
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
