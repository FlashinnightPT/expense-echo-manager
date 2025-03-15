
interface CategoryBreadcrumbNavProps {
  categoryNames: string[];
  onNavigate: (index: number) => void;
}

const CategoryBreadcrumbNav = ({ categoryNames, onNavigate }: CategoryBreadcrumbNavProps) => {
  return (
    <div className="flex flex-wrap gap-1 mb-2">
      <button 
        type="button"
        className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded"
        onClick={() => onNavigate(0)}
      >
        Início
      </button>
      
      {categoryNames.map((name, index) => (
        <div key={index} className="flex items-center">
          <span className="text-xs text-muted-foreground mx-1">/</span>
          <button 
            type="button"
            className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded"
            onClick={() => onNavigate(index + 1)}
          >
            {name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default CategoryBreadcrumbNav;
