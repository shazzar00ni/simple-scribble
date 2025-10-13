import { useEffect, useRef, useState } from "react";
import { updateNote, toggleNotePublic } from "@/lib/note-service";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Share, Globe, Lock, Maximize, Minimize } from "lucide-react";
import { toast } from "sonner";
import { Note } from "@/lib/supabase";
import { ShareManagement } from "./sharing/ShareManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { debounce } from "lodash";

interface NoteEditorProps {
  note: Note | null;
  onNoteUpdated: () => void;
}

export function NoteEditor({ note, onNoteUpdated }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [saving, setSaving] = useState(false);
  const [isPublic, setIsPublic] = useState(note?.is_public || false);
  const [showShareSettings, setShowShareSettings] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const focusModeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setIsPublic(note.is_public);
    } else {
      setTitle("");
      setContent("");
      setIsPublic(false);
    }
  }, [note]);

  // Handle ESC key to exit focus mode
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && focusMode) {
        setFocusMode(false);
      }
    };

    if (focusMode) {
      document.addEventListener("keydown", handleEscKey);
      return () => document.removeEventListener("keydown", handleEscKey);
    }
  }, [focusMode]);

  // Handle click outside to exit focus mode
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (focusModeRef.current && !focusModeRef.current.contains(e.target as Node)) {
        setFocusMode(false);
      }
    };

    if (focusMode) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [focusMode]);

  // Save note changes with debounce
  const debouncedSaveNote = useRef(
    debounce(async (noteId: string, updates: { title?: string; content?: string }) => {
      try {
        setSaving(true);
        await updateNote(noteId, updates);
        onNoteUpdated();
      } catch (error) {
        toast.error("Failed to save note");
      } finally {
        setSaving(false);
      }
    }, 1000)
  ).current;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    if (note) {
      debouncedSaveNote(note.id, { title: newTitle });
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    if (note) {
      debouncedSaveNote(note.id, { content: newContent });
    }
  };
  
  const handleTogglePublic = async () => {
    if (!note) return;
    
    try {
      const newPublicState = !isPublic;
      await toggleNotePublic(note.id, newPublicState);
      setIsPublic(newPublicState);
      toast.success(newPublicState ? "Note is now public" : "Note is now private");
      onNoteUpdated();
    } catch (error) {
      toast.error("Failed to change sharing settings");
    }
  };

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground text-lg">
          Select a note or create a new one to start editing
        </p>
      </div>
    );
  }

  return (
    <>
      {focusMode && (
        <div className="fixed inset-0 z-50 bg-background">
          <div ref={focusModeRef} className="flex flex-col h-full max-w-4xl mx-auto">
            <div className="flex items-center justify-between p-4">
              <Input
                value={title}
                onChange={handleTitleChange}
                className="text-2xl font-bold border-none shadow-none focus-visible:ring-0"
                placeholder="Note title"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFocusMode(false)}
                title="Exit Focus Mode (ESC)"
              >
                <Minimize className="h-4 w-4 mr-2" />
                Exit Focus
              </Button>
            </div>
            <Textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Write your note here..."
              className="flex-1 resize-none p-4 text-lg rounded-none border-0 shadow-none focus-visible:ring-0"
            />
            <div className="p-2 text-xs text-muted-foreground flex justify-end">
              {saving ? "Saving..." : "All changes saved"}
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <Input
            ref={titleRef}
            value={title}
            onChange={handleTitleChange}
            className="text-lg font-medium border-none shadow-none focus-visible:ring-0"
            placeholder="Note title"
          />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFocusMode(true)}
              title="Focus Mode (fullscreen)"
            >
              <Maximize className="h-4 w-4 mr-2" />
              Focus
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShareSettings(!showShareSettings)}
            >
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleTogglePublic}
              className={isPublic ? "text-amber-500" : "text-muted-foreground"}
            >
              {isPublic ? (
                <>
                  <Globe className="h-4 w-4 mr-2" />
                  Public
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Private
                </>
              )}
            </Button>
          </div>
        </div>

      <Tabs defaultValue="editor" className="flex-1 flex flex-col">
        <div className="border-b px-4">
          <TabsList className="w-auto h-10">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="sharing" onClick={() => setShowShareSettings(true)}>Sharing</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="editor" className="flex-1 p-0 mt-0">
          <Textarea
            ref={contentRef}
            value={content}
            onChange={handleContentChange}
            placeholder="Write your note here..."
            className="flex-1 min-h-[calc(100vh-240px)] resize-none p-4 rounded-none border-0 shadow-none focus-visible:ring-0"
          />
        </TabsContent>
        
        <TabsContent value="sharing" className="p-4 mt-0 overflow-auto">
          <ShareManagement
            noteId={note.id}
            noteTitle={note.title}
            isPublic={isPublic}
            onTogglePublic={handleTogglePublic}
          />
        </TabsContent>
      </Tabs>

        <div className="p-2 text-xs text-muted-foreground flex justify-end">
          {saving ? "Saving..." : "All changes saved"}
        </div>
      </div>
    </>
  );
}