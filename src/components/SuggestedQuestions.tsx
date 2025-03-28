
import { Button } from "@/components/ui/button";

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

const SUGGESTED_QUESTIONS = [
  "What is Raja Yoga meditation?",
  "How can I find inner peace?",
  "Tell me about spiritual wisdom",
  "What are the benefits of meditation?",
  "How to practice mindfulness daily?",
];

const SuggestedQuestions = ({ onSelect }: SuggestedQuestionsProps) => {
  return (
    <div className="w-full mt-4 mb-2">
      <h3 className="text-sm text-muted-foreground mb-2">Suggested questions:</h3>
      <div className="flex flex-wrap gap-2">
        {SUGGESTED_QUESTIONS.map((question) => (
          <Button 
            key={question} 
            variant="outline" 
            size="sm" 
            className="text-xs bg-white/50 hover:bg-white/80 transition-colors"
            onClick={() => onSelect(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
