
import { Button } from "@/components/ui/button";
import { ChevronRight, Home } from "lucide-react";

interface CategoryBreadcrumbNavProps {
  categoryNames: string[];
  onNavigate: (index: number) => void;
  className?: string;
}

const CategoryBreadcrumbNav = ({
  categoryNames,
  onNavigate,
  className,
}: CategoryBreadcrumbNavProps) => {
  return (
    <div className={className}>
      <nav className="flex items-center flex-wrap gap-1 text-sm">
        <Button
          type="button"
          variant="link"
          size="sm"
          className="p-0 h-auto flex items-center"
          onClick={() => onNavigate(-1)} // Pass -1 to indicate we want to go to the root level
        >
          <Home className="h-4 w-4 mr-1" />
          <span>Início</span>
        </Button>

        {categoryNames.map((name, index) => (
          <span key={index} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
            <Button
              type="button"
              variant="link"
              size="sm"
              className={`p-0 h-auto ${
                index === categoryNames.length - 1 ? "font-medium" : ""
              }`}
              onClick={() => onNavigate(index)}
            >
              {name}
            </Button>
          </span>
        ))}
      </nav>
    </div>
  );
};

export default CategoryBreadcrumbNav;
