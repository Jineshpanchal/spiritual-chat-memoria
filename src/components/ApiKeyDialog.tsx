
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { saveDifyApiKey } from "@/utils/storage";

interface ApiKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentApiKey: string | null;
}

const ApiKeyDialog = ({
  isOpen,
  onClose,
  currentApiKey,
}: ApiKeyDialogProps) => {
  const [apiKey, setApiKey] = useState(currentApiKey || "");

  const handleSave = () => {
    if (apiKey.trim()) {
      saveDifyApiKey(apiKey.trim());
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API Key Settings</DialogTitle>
          <DialogDescription>
            Enter your Dify API key to connect to your spiritual assistant.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Dify API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Dify API key"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Your API key is stored locally on your device and is never sent to our servers.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!apiKey.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyDialog;
