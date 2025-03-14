
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { PieChart, BarChart3, Calendar, Settings, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const navItems = [
    { name: "Painel", href: "/", icon: PieChart },
    { name: "Mensal", href: "/monthly", icon: Calendar },
    { name: "Anual", href: "/yearly", icon: BarChart3 },
    { name: "Definições", href: "/settings", icon: Settings },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass shadow-sm" : "bg-transparent",
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-primary font-semibold text-xl flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <PieChart className="h-5 w-5" />
              </span>
              <span>FinanceEcho</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        className={cn(
          "fixed inset-0 z-40 glass transform transition-transform duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full pt-20 px-4">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
          <Separator className="my-4" />
          <Button
            variant="outline"
            className="mt-auto mb-8"
            onClick={() => setMobileMenuOpen(false)}
          >
            Fechar Menu
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
