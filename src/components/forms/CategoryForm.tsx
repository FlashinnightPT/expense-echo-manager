
import { useState } from "react";
import { PlusCircle, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { TransactionCategory, flattenedCategories } from "@/utils/mockData";
import { toast } from "sonner";

interface CategoryFormProps {
  onSave?: (category: Partial<TransactionCategory>) => void;
  category?: TransactionCategory;
  className?: string;
}

const CategoryForm = ({ onSave, category, className }: CategoryFormProps) => {
  const [formData, setFormData] = useState<Partial<TransactionCategory>>({
    name: category?.name || "",
    type: category?.type || "expense",
    parentId: category?.parentId || undefined,
    level: category?.parentId ? 
      (flattenedCategories.find(c => c.id === category.parentId)?.level || 0) + 1 : 
      1
  });

  const handleChange = (field: string, value: string) => {
    if (field === "parentId") {
      const parentCategory = flattenedCategories.find(c => c.id === value);
      setFormData({
        ...formData,
        [field]: value === "none" ? undefined : value,
        level: value === "none" ? 1 : (parentCategory?.level || 0) + 1
      });
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error("Please enter a category name");
      return;
    }
    
    if (onSave) {
      onSave(formData);
      
      // Reset form after save
      setFormData({
        name: "",
        type: "expense",
        parentId: undefined,
        level: 1
      });
      
      toast.success("Category saved successfully");
    }
  };

  // Filter potential parent categories
  // Cannot be a child of itself, and cannot be a child of a category that would create too deep nesting
  const potentialParents = flattenedCategories.filter(c => {
    // Different category
    if (category && c.id === category.id) return false;
    
    // Same type (income, expense, etc.)
    if (c.type !== formData.type) return false;
    
    // Not too deep (max 3 levels for parents)
    return c.level < 4;
  });

  return (
    <Card className={cn("animate-fade-in-up", className)}>
      <CardHeader>
        <CardTitle className="text-lg">
          {category ? "Edit Category" : "Add New Category"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                placeholder="Enter category name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Category Type</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={(value) => handleChange("type", value)}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="income" id="income" />
                  <Label htmlFor="income" className="cursor-pointer">Income</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="expense" />
                  <Label htmlFor="expense" className="cursor-pointer">Expense</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="savings" id="savings" />
                  <Label htmlFor="savings" className="cursor-pointer">Savings</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="investment" id="investment" />
                  <Label htmlFor="investment" className="cursor-pointer">Investment</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="parent">Parent Category</Label>
              <Select
                value={formData.parentId || "none"}
                onValueChange={(value) => handleChange("parentId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="None (Top Level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Top Level)</SelectItem>
                  <Separator className="my-2" />
                  {potentialParents.map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.name} {parent.level > 1 ? `(Level ${parent.level})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Current level: {formData.level} (Max: 4)
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                setFormData({
                  name: "",
                  type: "expense",
                  parentId: undefined,
                  level: 1
                });
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button type="submit">
              <PlusCircle className="h-4 w-4 mr-2" />
              {category ? "Update" : "Add"} Category
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CategoryForm;
