
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface EmptyStateProps {
  onNewChat: () => void;
}

const EmptyState = ({ onNewChat }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
      <div className="bg-spiritual-softBlue/30 p-6 rounded-full mb-6">
        <MessageCircle className="h-12 w-12 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Welcome to Spiritual Helper</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        A peaceful space for spiritual guidance, meditation advice, and mindful conversations by Brahma Kumaris.
      </p>
      
      <Button onClick={onNewChat}>
        Start a New Conversation
      </Button>
    </div>
  );
};

export default EmptyState;
