
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useState, useEffect } from "react";

interface DesktopNavMenuProps {
  mainNavigation: Array<{ name: string; href: string }>;
  settingsSubMenu: Array<{ name: string; href: string }>;
  isActivePath: (path: string) => boolean;
  closeMenu: () => void;
}

export function DesktopNavMenu({ 
  mainNavigation, 
  settingsSubMenu, 
  isActivePath,
  closeMenu
}: DesktopNavMenuProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Function that handles navigation and closes the menu
  const handleNavigation = (e: React.MouseEvent, href: string) => {
    // Prevent default to ensure we have control over navigation
    e.preventDefault();
    
    // Skip if already navigating
    if (isNavigating) {
      console.log("DesktopNavMenu: Already navigating, skipping");
      return;
    }
    
    console.log(`DesktopNavMenu: Navigating from ${location.pathname} to ${href}`);
    
    // Set navigating flag
    setIsNavigating(true);
    
    // Close the menu
    closeMenu();
    
    // Use a separate timeout for navigation from problematic pages
    const problematicPages = ['/category-analysis', '/category-comparison'];
    const delay = problematicPages.includes(location.pathname) ? 250 : 50;
    
    setTimeout(() => {
      console.log(`DesktopNavMenu: Executing delayed navigation to ${href}`);
      navigate(href);
      
      // Reset navigating flag after a delay
      setTimeout(() => {
        setIsNavigating(false);
      }, 300);
    }, delay);
  };
  
  // Reset navigation state when location changes
  useEffect(() => {
    setIsNavigating(false);
  }, [location.pathname]);

  return (
    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
      {mainNavigation.map((item) => (
        <a
          key={item.name}
          href={item.href}
          className={`transition-colors hover:text-foreground/80 ${
            isActivePath(item.href) ? "text-foreground font-semibold" : "text-foreground/60"
          }`}
          onClick={(e) => handleNavigation(e, item.href)}
        >
          {item.name}
        </a>
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
                  <a
                    key={item.name}
                    href={item.href}
                    className={`block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                      isActivePath(item.href) ? "bg-accent text-accent-foreground" : ""
                    }`}
                    onClick={(e) => handleNavigation(e, item.href)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
