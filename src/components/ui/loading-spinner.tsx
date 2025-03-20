
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-8 w-8",
  xl: "h-12 w-12"
};

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <Loader2 
      className={cn(
        "animate-spin text-muted-foreground",
        sizeClasses[size],
        className
      )} 
    />
  );
}

interface LoadingPageProps {
  text?: string;
}

export function LoadingPage({ text }: LoadingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <LoadingSpinner size="xl" className="mb-4" />
      {text && <p className="text-muted-foreground">{text}</p>}
    </div>
  );
}
