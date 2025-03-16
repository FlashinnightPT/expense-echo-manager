
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
  text?: string;
}

export const LoadingSpinner = ({
  className,
  size = 24,
  text = "Estou a tratar das suas contas, p.f. aguarde!",
}: LoadingSpinnerProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" size={size} />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
};

export const LoadingPage = ({ text = "Estou a tratar das suas contas, p.f. aguarde!" }: { text?: string }) => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg font-medium text-muted-foreground">{text}</p>
    </div>
  );
};

export const LoadingCards = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-40 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
    </div>
  );
};
