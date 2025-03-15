
import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [warningTimer, setWarningTimer] = useState<NodeJS.Timeout | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const navigate = useNavigate();

  const resetTimer = useCallback(() => {
    if (timer) clearTimeout(timer);
    if (warningTimer) clearTimeout(warningTimer);
    
    if (showWarning) {
      setShowWarning(false);
      setCountdown(30);
    }

    // Definir o temporizador de aviso
    const newWarningTimer = setTimeout(() => {
      setShowWarning(true);
      setCountdown(30);
      
      // Iniciar contador regressivo
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Limpar o intervalo quando o componente for desmontado
      return () => clearInterval(countdownInterval);
    }, timeout - warningTime);

    // Definir o temporizador de logout
    const newTimer = setTimeout(() => {
      setIsIdle(true);
      setShowWarning(false);
      onIdle();
    }, timeout);

    setWarningTimer(newWarningTimer);
    setTimer(newTimer);
  }, [timeout, warningTime, onIdle, timer, warningTimer, showWarning]);

  const handleKeepSession = () => {
    resetTimer();
  };

  const handleLogout = () => {
    setShowWarning(false);
    setIsIdle(true);
    onIdle();
  };

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
    const eventListeners = events.map((event) => {
      return {
        event,
        handler: resetTimer
      };
    });

    eventListeners.forEach(({ event, handler }) => {
      window.addEventListener(event, handler);
    });

    // Limpar os event listeners e temporizadores
    return () => {
      eventListeners.forEach(({ event, handler }) => {
        window.removeEventListener(event, handler);
      });

      if (timer) clearTimeout(timer);
      if (warningTimer) clearTimeout(warningTimer);
    };
  }, [resetTimer, timeout, warningTime, onIdle]);

  return { 
    isIdle, 
    resetTimer,
    IdleWarningDialog: () => (
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
    )
  };
};

export default useIdleTimer;
