
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import { AppLogo } from "./nav/AppLogo";
import { DesktopNavMenu } from "./nav/DesktopNavMenu";
import { RightActions } from "./nav/RightActions";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
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

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <AppLogo />
          
          {isAuthenticated && (
            <DesktopNavMenu 
              mainNavigation={mainNavigation}
              settingsSubMenu={settingsSubMenu}
              isActivePath={isActivePath}
              closeMenu={closeMenu}
            />
          )}
        </div>
        
        <RightActions 
          mainNavigation={mainNavigation}
          settingsSubMenu={settingsSubMenu}
          isActivePath={isActivePath}
        />
      </div>
    </header>
  );
}

export default Header;
