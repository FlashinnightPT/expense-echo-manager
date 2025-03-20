
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface NewCategoryInputProps {
  categoryName: string;
  onCategoryNameChange: (value: string) => void;
  levelName: string;
  parentName?: string;
  onSubmit: () => void;
  isLoading?: boolean;
}

const NewCategoryInput = ({
  categoryName,
  onCategoryNameChange,
  levelName,
  parentName,
  onSubmit,
  isLoading = false
}: NewCategoryInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="categoryName">
        Adicionar {levelName}
        {parentName && ` em ${parentName}`}
      </Label>
      <div className="flex space-x-2">
        <Input
          id="categoryName"
          value={categoryName}
          onChange={(e) => onCategoryNameChange(e.target.value)}
          placeholder={`Nome do ${levelName.toLowerCase()}`}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && categoryName.trim() && !isLoading) {
              e.preventDefault();
              onSubmit();
            }
          }}
          disabled={isLoading}
        />
        <Button 
          type="button"
          disabled={!categoryName.trim() || isLoading}
          className="whitespace-nowrap"
          onClick={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {isLoading ? (
            <LoadingSpinner className="mr-2" size="sm" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Adicionar
        </Button>
      </div>
    </div>
  );
};

export default NewCategoryInput;
