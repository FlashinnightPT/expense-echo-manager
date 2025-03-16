
import { useState, useEffect, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface UseIdleTimerProps {
  timeout: number; // tempo total em milissegundos
  onIdle: () => void;
  warningTime?: number; // tempo em milissegundos antes do timeout para mostrar aviso
}

export const useIdleTimer = ({
  timeout,
  onIdle,
  warningTime = 30000, // 30 segundos por padrão
}: UseIdleTimerProps) => {
  const [isIdle, setIsIdle] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(30);
  
  // Use refs to avoid dependency issues in useEffect
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const clearAllTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    clearAllTimers();
    
    if (showWarning) {
      setShowWarning(false);
      setCountdown(30);
    }

    // Definir o temporizador de aviso
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(30);
      
      // Iniciar contador regressivo
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    }, timeout - warningTime);

    // Definir o temporizador de logout
    timerRef.current = setTimeout(() => {
      setIsIdle(true);
      setShowWarning(false);
      onIdle();
    }, timeout);
  }, [timeout, warningTime, onIdle, showWarning, clearAllTimers]);

  const handleKeepSession = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  const handleLogout = useCallback(() => {
    setShowWarning(false);
    setIsIdle(true);
    onIdle();
  }, [onIdle]);

  useEffect(() => {
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click"
    ];

    // Inicializar os temporizadores
    resetTimer();

    // Adicionar os event listeners para monitorar atividade
    const resetTimerHandler = () => resetTimer();
    
    events.forEach((event) => {
      window.addEventListener(event, resetTimerHandler);
    });

    // Limpar os event listeners e temporizadores
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimerHandler);
      });

      clearAllTimers();
    };
  }, [resetTimer, clearAllTimers]);

  const IdleWarningDialog = useCallback(() => (
    <Dialog open={showWarning} onOpenChange={(open) => {
      if (!open) handleLogout();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex flex-col items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 text-yellow-600">
              <Clock className="h-6 w-6" />
            </div>
            <span>Sessão prestes a expirar</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6 text-center">
          <p className="mb-4">A sua sessão irá expirar em <span className="font-bold text-xl">{countdown}</span> segundos devido a inatividade.</p>
          <p className="font-medium">Quer manter a sessão iniciada?</p>
        </div>
        
        <DialogFooter className="flex justify-center gap-4 sm:justify-center">
          <Button 
            variant="outline" 
            onClick={handleLogout}
          >
            Não
          </Button>
          <Button 
            onClick={handleKeepSession}
          >
            Sim
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ), [showWarning, countdown, handleKeepSession, handleLogout]);

  return { 
    isIdle, 
    resetTimer,
    IdleWarningDialog
  };
};

export default useIdleTimer;
