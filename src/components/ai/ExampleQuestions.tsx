
import React from 'react';
import { Button } from "@/components/ui/button";

interface ExampleQuestionsProps {
  questions: string[];
  onSelectQuestion: (question: string) => void;
}

const ExampleQuestions: React.FC<ExampleQuestionsProps> = ({ questions, onSelectQuestion }) => {
  return (
    <div className="mt-2">
      <p className="text-sm font-medium text-muted-foreground mb-2">Exemplos de perguntas:</p>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, idx) => (
          <Button
            key={idx}
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => onSelectQuestion(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ExampleQuestions;
