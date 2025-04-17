
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface MobileNavMenuProps {
  mainNavigation: Array<{ name: string; href: string }>;
  settingsSubMenu: Array<{ name: string; href: string }>;
  isActivePath: (path: string) => boolean;
}

export function MobileNavMenu({ 
  mainNavigation, 
  settingsSubMenu, 
  isActivePath 
}: MobileNavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [lastNavigationTime, setLastNavigationTime] = useState(0);

  const handleNavClick = (href: string) => {
    // Prevent navigation if already navigating
    if (isNavigating) {
      console.log("MobileNavMenu: Navigation already in progress, skipping");
      return;
    }
    
    // Debounce navigation clicks
    const now = Date.now();
    if (now - lastNavigationTime < 300) {
      console.log("MobileNavMenu: Navigation clicked too soon, skipping");
      return;
    }
    
    console.log(`MobileNavMenu: Navigating from ${location.pathname} to ${href}`);
    setLastNavigationTime(now);
    
    // Close the menu first
    setIsOpen(false);
    
    // Set navigating state to prevent multiple clicks
    setIsNavigating(true);
    
    // Add additional delay if coming from problematic pages
    const problematicPages = ['/category-analysis', '/category-comparison'];
    const delay = problematicPages.includes(location.pathname) ? 250 : 100;
    
    setTimeout(() => {
      console.log(`MobileNavMenu: Executing delayed navigation to ${href}`);
      navigate(href);
      
      // Reset navigating state after navigation should be complete
      setTimeout(() => {
        setIsNavigating(false);
      }, 300);
    }, delay);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 md:hidden"
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
            <Button
              key={item.name}
              variant="ghost"
              className={`justify-start px-2 ${
                isActivePath(item.href) ? "font-semibold text-primary" : ""
              }`}
              onClick={() => handleNavClick(item.href)}
            >
              {item.name}
            </Button>
          ))}
          
          <div className="py-2">
            <p className="mb-2 text-lg">Configurações</p>
            <div className="pl-4 space-y-2 border-l">
              {settingsSubMenu.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  className={`justify-start px-2 ${
                    isActivePath(item.href) ? "font-semibold text-primary" : ""
                  }`}
                  onClick={() => handleNavClick(item.href)}
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
