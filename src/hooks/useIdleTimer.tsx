
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

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

  const resetTimer = useCallback(() => {
    if (timer) clearTimeout(timer);
    if (warningTimer) clearTimeout(warningTimer);

    // Definir o temporizador de aviso
    const newWarningTimer = setTimeout(() => {
      toast.warning("A sua sessão irá expirar em 30 segundos devido a inatividade", {
        duration: 30000, // Mantém o toast visível até o logout
        description: "Mova o rato ou clique para continuar"
      });
    }, timeout - warningTime);

    // Definir o temporizador de logout
    const newTimer = setTimeout(() => {
      setIsIdle(true);
      onIdle();
    }, timeout);

    setWarningTimer(newWarningTimer);
    setTimer(newTimer);
  }, [timeout, warningTime, onIdle, timer, warningTimer]);

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

  return { isIdle, resetTimer };
};

export default useIdleTimer;
