
import React from "react";
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
  { name: "Análise por Categoria", href: "/category-analysis" },
  { name: "Comparação Avançada", href: "/category-comparison" },
  { name: "Relatório de Categorias", href: "/category-report" },
];

// Define submenu items for settings dropdown
const settingsSubMenu = [
  { name: "Categorias", href: "/categories" },
  { name: "Configurações", href: "/settings" },
  { name: "Usuários", href: "/users" },
];

const Header = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isNavigating, setIsNavigating] = React.useState(false);

  // Function to check if current path matches given href
  const isActivePath = (href: string) => {
    // Check if we're on the dashboard page
    if (href === "/dashboard" && location.pathname === "/dashboard") {
      return true;
    }
    
    // Check if the current path exactly matches the href
    return location.pathname === href;
  };

  // Close menu (for mobile/responsive designs)
  const closeMenu = () => {
    setIsExpanded(false);
    
    // Set navigating state to prevent multiple clicks
    setIsNavigating(true);
    
    // Reset navigating state after navigation should be complete
    setTimeout(() => {
      setIsNavigating(false);
    }, 200);
  };

  // Check if we're on the login page, don't show the header
  if (location.pathname === "/login") {
    return null;
  }

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
          <RightActions 
            mainNavigation={mainNavigation}
            settingsSubMenu={settingsSubMenu}
            isActivePath={isActivePath}
          />
          
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
