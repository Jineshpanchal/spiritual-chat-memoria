
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
import { useState, useEffect } from "react";
import { saveDifyApiKey, saveDifyApiBaseUrl, getDifyApiKey, getDifyApiBaseUrl } from "@/utils/storage";
import { DIFY_CONFIG } from "@/utils/config";

interface ApiKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentApiKey: string | null;
}

const ApiKeyDialog = ({
  isOpen,
  onClose,
}: ApiKeyDialogProps) => {
  const [apiKey, setApiKey] = useState("");
  const [apiBaseUrl, setApiBaseUrl] = useState("");

  useEffect(() => {
    if (isOpen) {
      // Load current values when dialog opens
      setApiKey(getDifyApiKey() || "");
      setApiBaseUrl(getDifyApiBaseUrl() || DIFY_CONFIG.API_BASE_URL);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (apiKey.trim()) {
      saveDifyApiKey(apiKey.trim());
    }
    
    if (apiBaseUrl.trim()) {
      saveDifyApiBaseUrl(apiBaseUrl.trim());
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
          <DialogDescription>
            Enter your Dify API credentials to connect to your spiritual assistant.
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
          <div className="space-y-2">
            <Label htmlFor="apiBaseUrl">API Base URL</Label>
            <Input
              id="apiBaseUrl"
              type="text"
              value={apiBaseUrl}
              onChange={(e) => setApiBaseUrl(e.target.value)}
              placeholder="Enter your API base URL"
            />
            <p className="text-xs text-muted-foreground">
              Example: http://mc.brahmakumaris.com/v1
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Your API credentials are stored locally on your device and are never sent to our servers.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!apiKey.trim() || !apiBaseUrl.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyDialog;
