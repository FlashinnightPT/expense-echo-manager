
import React, { useEffect, useState } from "react";
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [lastNavigationTime, setLastNavigationTime] = useState(0);
  
  // Function to check if current path matches given href
  const isActivePath = (href: string) => {
    // Check if we're on the dashboard page
    if (href === "/dashboard" && location.pathname === "/dashboard") {
      return true;
    }
    
    // Check if the current path exactly matches the href
    return location.pathname === href;
  };

  // Close menu (for mobile/responsive designs) and prevent rapid navigation
  const closeMenu = () => {
    // Debounce navigation clicks
    const now = Date.now();
    if (now - lastNavigationTime < 300) {
      // Skip if clicked too soon
      return;
    }
    
    setLastNavigationTime(now);
    setIsExpanded(false);
    
    // Set navigating state to prevent multiple clicks
    setIsNavigating(true);
    
    // Reset navigating state after navigation should be complete
    setTimeout(() => {
      setIsNavigating(false);
    }, 300);
  };
  
  // Debug current location
  useEffect(() => {
    console.log("Header: Current location is", location.pathname);
  }, [location.pathname]);

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
