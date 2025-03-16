
import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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
  
  // Simple direct close function without delays
  const handleNavigation = () => {
    closeMenu();
  };

  return (
    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
      {mainNavigation.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={`transition-colors hover:text-foreground/80 ${
            isActivePath(item.href) ? "text-foreground font-semibold" : "text-foreground/60"
          }`}
          onClick={handleNavigation}
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
                    onClick={handleNavigation}
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
  );
}
