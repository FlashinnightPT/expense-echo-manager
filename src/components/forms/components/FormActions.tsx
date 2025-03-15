
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onReset: () => void;
  isEditing: boolean;
  isSubmitDisabled: boolean;
}

const FormActions = ({ onReset, isEditing, isSubmitDisabled }: FormActionsProps) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button 
        type="button" 
        variant="outline"
        onClick={onReset}
      >
        <X className="h-4 w-4 mr-2" />
        Limpar
      </Button>
      <Button type="submit" disabled={isSubmitDisabled}>
        <Save className="h-4 w-4 mr-2" />
        {isEditing ? "Atualizar" : "Adicionar"}
      </Button>
    </div>
  );
};

export default FormActions;
