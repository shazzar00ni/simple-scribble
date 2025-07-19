import { useState, useEffect } from "react";
import { getNoteShares, removeShare } from "@/lib/note-service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash, Users, Eye, Edit } from "lucide-react";
import { toast } from "sonner";
import { ShareNoteDialog } from "./ShareNoteDialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth/AuthProvider";

interface Share {
  id: string;
  shared_with: {
    id: string;
    email: string;
    display_name: string | null;
  };
  can_edit: boolean;
}

interface ShareManagementProps {
  noteId: string;
  noteTitle: string;
  isPublic: boolean;
  onTogglePublic: () => void;
}

export function ShareManagement({ noteId, noteTitle, isPublic, onTogglePublic }: ShareManagementProps) {
  const { user } = useAuth();
  const [shares, setShares] = useState<Share[]>([]);
  const [loading, setLoading] = useState(true);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  
  const loadShares = async () => {
    try {
      setLoading(true);
      const sharesData = await getNoteShares(noteId);
      setShares(sharesData as any[]);
    } catch (error) {
      toast.error("Failed to load shares");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (noteId) {
      loadShares();
    }
  }, [noteId]);
  
  const handleRemoveShare = async (shareId: string, email: string) => {
    try {
      await removeShare(shareId);
      toast.success(`Share with ${email} removed`);
      loadShares();
    } catch (error) {
      toast.error("Failed to remove share");
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Share Settings</CardTitle>
              <CardDescription>Manage who can view or edit this note</CardDescription>
            </div>
            <Button onClick={() => setIsShareDialogOpen(true)}>
              <Users className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Public Access</h3>
                <p className="text-sm text-muted-foreground">
                  {isPublic 
                    ? "Anyone with the link can view this note" 
                    : "Only you and people you share with can access this note"}
                </p>
              </div>
              <Button 
                variant={isPublic ? "default" : "outline"} 
                onClick={onTogglePublic}
                size="sm"
              >
                {isPublic ? "Make Private" : "Make Public"}
              </Button>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Shared With</h3>
              
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : shares.length > 0 ? (
                <ul className="space-y-2">
                  {shares.map((share) => (
                    <li key={share.id} className="flex justify-between items-center p-2 bg-muted/40 rounded-md">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {(share.shared_with.display_name || share.shared_with.email).substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {share.shared_with.display_name || share.shared_with.email}
                          </p>
                          <p className="text-xs text-muted-foreground">{share.shared_with.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {share.can_edit ? (
                            <><Edit className="mr-1 h-3 w-3" /> Can edit</>
                          ) : (
                            <><Eye className="mr-1 h-3 w-3" /> Can view</>
                          )}
                        </Badge>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveShare(share.id, share.shared_with.email)}
                        >
                          <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground py-2">
                  This note hasn't been shared with anyone yet
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ShareNoteDialog
        isOpen={isShareDialogOpen}
        onClose={() => {
          setIsShareDialogOpen(false);
          loadShares();
        }}
        noteId={noteId}
        noteTitle={noteTitle}
      />
    </>
  );
}