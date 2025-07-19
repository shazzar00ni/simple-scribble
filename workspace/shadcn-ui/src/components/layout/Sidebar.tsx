import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusCircle, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { createNote, getUserNotes, deleteNote, getSharedWithMeNotes } from "@/lib/note-service";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { Note } from "@/lib/supabase";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SidebarProps {
  className?: string;
  selectedNoteId: string | null;
  onNoteSelect: (note: Note) => void;
  onNotesChanged: () => void;
}

export function Sidebar({
  className,
  selectedNoteId,
  onNoteSelect,
  onNotesChanged,
}: SidebarProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [sharedNotes, setSharedNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"my" | "shared">("my");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      
      // Load both my notes and shared notes
      const [myNotesData, sharedNotesData] = await Promise.all([
        getUserNotes(),
        getSharedWithMeNotes()
      ]);
      
      setNotes(myNotesData);
      setSharedNotes(sharedNotesData);
    } catch (error) {
      toast.error("Failed to load notes");
      console.error("Error loading notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    try {
      setIsCreating(true);
      const newNote = await createNote("Untitled Note");
      toast.success("New note created");
      
      // Reload notes to include the new one
      await loadNotes();
      
      // Select the new note
      onNoteSelect(newNote);
      onNotesChanged();
    } catch (error) {
      toast.error("Failed to create note");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteNote = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await deleteNote(noteId);
      toast.success("Note deleted");
      
      // Reload notes
      await loadNotes();
      
      // If the deleted note was selected, deselect it
      if (selectedNoteId === noteId) {
        onNoteSelect(null as any);
      }
      
      onNotesChanged();
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  // Filter notes based on search query
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredSharedNotes = sharedNotes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get the active notes list based on the current tab
  const activeNotes = activeTab === "my" ? filteredNotes : filteredSharedNotes;

  return (
    <div className={cn("pb-12 flex flex-col h-full", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 flex justify-between items-center">
          <div className="text-lg font-semibold tracking-tight">Notes</div>
          <Button 
            onClick={handleCreateNote} 
            size="icon" 
            variant="ghost"
            disabled={isCreating}
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
        <div className="px-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs
          defaultValue="my"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "my" | "shared")}
          className="px-3"
        >
          <TabsList className="w-full">
            <TabsTrigger value="my" className="flex-1">My Notes</TabsTrigger>
            <TabsTrigger value="shared" className="flex-1">Shared With Me</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-3">
          {loading ? (
            <div className="flex justify-center p-4 text-sm text-muted-foreground">
              Loading notes...
            </div>
          ) : activeNotes.length > 0 ? (
            <div className="grid gap-1">
              {activeNotes.map((note) => (
                <div
                  key={note.id}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-md text-sm",
                    selectedNoteId === note.id
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted cursor-pointer"
                  )}
                  onClick={() => onNoteSelect(note)}
                >
                  <span className="truncate">{note.title || "Untitled Note"}</span>
                  {activeTab === "my" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100"
                      onClick={(e) => handleDeleteNote(note.id, e)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground p-4 text-center">
              {activeTab === "my" 
                ? "No notes found. Create your first note!" 
                : "No notes have been shared with you yet."}
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="mt-auto p-3">
        <div className="text-xs text-muted-foreground">
          {user?.email}
        </div>
      </div>
    </div>
  );
}