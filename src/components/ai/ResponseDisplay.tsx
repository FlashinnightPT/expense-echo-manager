
import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface ResponseDisplayProps {
  response: string;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response }) => {
  if (!response) return null;
  
  return (
    <div className="overflow-y-auto flex-grow mt-4">
      <Textarea
        value={response}
        readOnly
        className="min-h-[200px] p-3 resize-none bg-muted/30"
      />
    </div>
  );
};

export default ResponseDisplay;
