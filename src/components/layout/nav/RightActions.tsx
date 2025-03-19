
import { useIsMobile } from "@/hooks/use-mobile";
import useAuth from "@/hooks/useAuth";
import { ModeToggle } from "@/components/ui/mode-toggle";
import UserMenu from "@/components/auth/UserMenu";
import { MobileNavMenu } from "./MobileNavMenu";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BrainCircuit } from "lucide-react";
import AiChatDialog from "@/components/ai/AiChatDialog";

export interface RightActionsProps {
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
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  return (
    <div className="flex flex-1 items-center justify-end space-x-2">
      <nav className="flex items-center space-x-2">
        {isAuthenticated && (
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setIsAiChatOpen(true)}
            title="Assistente IA"
            className="text-purple-500 border-purple-200 hover:bg-purple-100 hover:text-purple-700 dark:border-purple-800 dark:hover:bg-purple-900 dark:text-purple-400"
          >
            <BrainCircuit className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        )}
        
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

      {/* Dialog do Assistente IA */}
      <AiChatDialog open={isAiChatOpen} onOpenChange={setIsAiChatOpen} />
    </div>
  );
}
