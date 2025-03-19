
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DesktopNavMenu } from "./nav/DesktopNavMenu";
import { MobileNavMenu } from "./nav/MobileNavMenu";
import { AppLogo } from "./nav/AppLogo";
import { RightActions } from "./nav/RightActions";

// Define navigation items for main menu
const mainNavigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Mensal", href: "/monthly" },
  { name: "Anual", href: "/yearly" },
];

// Define submenu items for settings dropdown
const settingsSubMenu = [
  { name: "Categorias", href: "/categories" },
  { name: "Análise por Categoria", href: "/category-analysis" },
  { name: "Comparação Avançada", href: "/category-comparison" },
  { name: "Relatório de Categorias", href: "/category-report" },
  { name: "Configurações", href: "/settings" },
  { name: "Usuários", href: "/users" },
];

const Header = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to check if current path matches given href
  const isActivePath = (href: string) => {
    if (href === "/dashboard" && location.pathname === "/dashboard") {
      return true;
    }
    return location.pathname === href;
  };

  // Close menu (for mobile/responsive designs)
  const closeMenu = () => {
    setIsExpanded(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background backdrop-blur-lg">
      <div className="container flex h-16 items-center">
        <AppLogo />
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Desktop Navigation */}
          <DesktopNavMenu 
            mainNavigation={mainNavigation} 
            settingsSubMenu={settingsSubMenu} 
            isActivePath={isActivePath} 
            closeMenu={closeMenu}
          />
          
          {/* Right side actions (user menu, theme toggle, etc) */}
          <RightActions />
          
          {/* Mobile Navigation */}
          <MobileNavMenu 
            mainNavigation={mainNavigation} 
            settingsSubMenu={settingsSubMenu} 
            isActivePath={isActivePath} 
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
