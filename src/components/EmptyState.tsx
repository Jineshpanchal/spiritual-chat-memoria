
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface EmptyStateProps {
  hasApiKey: boolean;
  onNewChat: () => void;
  onSetupApi: () => void;
}

const EmptyState = ({ hasApiKey, onNewChat, onSetupApi }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
      <div className="bg-spiritual-softBlue/30 p-6 rounded-full mb-6">
        <MessageCircle className="h-12 w-12 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Welcome to Your Spiritual Guide</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        A peaceful space for spiritual guidance, meditation advice, and mindful conversations.
      </p>
      
      {!hasApiKey ? (
        <div className="space-y-4">
          <p className="text-muted-foreground max-w-md">
            To begin your journey, please set up your Dify API key.
          </p>
          <Button onClick={onSetupApi}>
            Set Up API Key
          </Button>
        </div>
      ) : (
        <Button onClick={onNewChat}>
          Start a New Conversation
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
