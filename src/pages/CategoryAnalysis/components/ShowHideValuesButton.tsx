
import React from "react";

interface ShowHideValuesButtonProps {
  showValues: boolean;
  toggleShowValues: () => void;
}

const ShowHideValuesButton = ({ showValues, toggleShowValues }: ShowHideValuesButtonProps) => {
  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={toggleShowValues}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
      >
        {showValues ? "Ocultar Valores" : "Mostrar Valores"}
      </button>
    </div>
  );
};

export default ShowHideValuesButton;
