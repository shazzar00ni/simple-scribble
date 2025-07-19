import { useState } from "react";
import { shareNoteWithUser } from "@/lib/note-service";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ShareNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  noteId: string;
  noteTitle: string;
}

export function ShareNoteDialog({ isOpen, onClose, noteId, noteTitle }: ShareNoteDialogProps) {
  const [email, setEmail] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    if (!email.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    try {
      setLoading(true);
      await shareNoteWithUser(noteId, email, canEdit);
      toast.success(`Note shared with ${email} successfully`);
      setEmail("");
      setCanEdit(false);
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to share note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Note</DialogTitle>
          <DialogDescription>
            Share "{noteTitle}" with another user
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              placeholder="Enter email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="can-edit"
              checked={canEdit}
              onCheckedChange={(checked) => setCanEdit(!!checked)}
              disabled={loading}
            />
            <Label htmlFor="can-edit">Allow editing</Label>
          </div>
        </div>
        
        <DialogFooter className="flex flex-row items-center">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleShare} disabled={loading || !email.trim()}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}