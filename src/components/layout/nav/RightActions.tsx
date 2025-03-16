
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { ModeToggle } from "@/components/ui/mode-toggle";
import UserMenu from "@/components/auth/UserMenu";
import { MobileNavMenu } from "./MobileNavMenu";

interface RightActionsProps {
  mainNavigation: Array<{ name: string; href: string }>;
  settingsSubMenu: Array<{ name: string; href: string }>;
  isActivePath: (path: string) => boolean;
}

export function RightActions({ 
  mainNavigation, 
  settingsSubMenu, 
  isActivePath 
}: RightActionsProps) {
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();

  const closeMenu = () => {}; // No-op, just for maintaining the API

  return (
    <div className="flex flex-1 items-center justify-end space-x-2">
      <nav className="flex items-center space-x-2">
        <ModeToggle />
        
        <UserMenu />
        
        {isAuthenticated && isMobile && (
          <MobileNavMenu 
            mainNavigation={mainNavigation}
            settingsSubMenu={settingsSubMenu}
            isActivePath={isActivePath}
          />
        )}
      </nav>
    </div>
  );
}
