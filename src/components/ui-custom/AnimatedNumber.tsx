
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  formatter?: (value: number) => string;
  duration?: number;
  className?: string;
  animate?: boolean;
}

const AnimatedNumber = ({ 
  value, 
  formatter = (v) => v.toString(), 
  duration = 1000,
  className,
  animate = true
}: AnimatedNumberProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!animate) {
      setDisplayValue(value);
      return;
    }
    
    startValueRef.current = displayValue;
    startTimeRef.current = null;
    
    const animateValue = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      const newValue = startValueRef.current + (value - startValueRef.current) * easeOutQuart(progress);
      setDisplayValue(newValue);
      
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animateValue);
      }
    };
    
    rafRef.current = requestAnimationFrame(animateValue);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [value, duration, animate]);
  
  // Easing function for smoother animation
  const easeOutQuart = (x: number): number => {
    return 1 - Math.pow(1 - x, 4);
  };
  
  return (
    <span className={cn("inline-block", className)}>
      {formatter(displayValue)}
    </span>
  );
};

export default AnimatedNumber;
