import { useState } from 'react';
import { StickyNote, Save, Trash2, Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useNotes } from '@/hooks/use-notes';
import { toast } from '@/hooks/use-toast';

export const Notes = () => {
  const { notes, saveNote, deleteNote, getNote, getAvailableSlots } = useNotes();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [noteName, setNoteName] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const handleOpenNote = (slotId: number) => {
    const note = getNote(slotId);
    if (note) {
      setSelectedSlot(slotId);
      setNoteName(note.name);
      setNoteContent(note.content);
      setIsCreatingNew(false);
    }
  };

  const handleCreateNew = () => {
    const availableSlots = getAvailableSlots();
    if (availableSlots.length === 0) {
      toast({
        title: "No available slots",
        description: "All 10 note slots are full. Delete a note to create a new one.",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedSlot(availableSlots[0]);
    setNoteName('');
    setNoteContent('');
    setIsCreatingNew(true);
  };

  const handleSave = () => {
    if (!selectedSlot || !noteName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a name for your note.",
        variant: "destructive"
      });
      return;
    }

    saveNote(selectedSlot, noteName.trim(), noteContent);
    toast({
      title: "Note saved",
      description: `Note "${noteName}" has been saved to slot ${selectedSlot}.`
    });
    setIsCreatingNew(false);
  };

  const handleDelete = () => {
    if (!selectedSlot) return;
    
    deleteNote(selectedSlot);
    toast({
      title: "Note deleted",
      description: `Note has been deleted from slot ${selectedSlot}.`
    });
    
    // Reset form
    setSelectedSlot(null);
    setNoteName('');
    setNoteContent('');
    setIsCreatingNew(false);
  };

  const handleSlotSelect = (slotId: string) => {
    const id = parseInt(slotId);
    const note = getNote(id);
    
    if (note) {
      handleOpenNote(id);
    } else {
      setSelectedSlot(id);
      setNoteName('');
      setNoteContent('');
      setIsCreatingNew(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed top-4 right-4 z-50 rounded-full shadow-lg"
          title="Notes"
        >
          <StickyNote className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Notes Manager
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Slot Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Note Slot:</label>
            <div className="flex gap-2">
              <Select value={selectedSlot?.toString() || ''} onValueChange={handleSlotSelect}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Choose a slot (1-10)" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(slot => {
                    const note = getNote(slot);
                    return (
                      <SelectItem key={slot} value={slot.toString()}>
                        <div className="flex items-center justify-between w-full">
                          <span>Slot {slot}</span>
                          {note && (
                            <Badge variant="secondary" className="ml-2">
                              {note.name}
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <Button onClick={handleCreateNew} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Existing Notes List */}
          {notes.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Saved Notes:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {notes.map(note => (
                  <Button
                    key={note.id}
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => handleOpenNote(note.id)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{note.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Slot {note.id} • {note.lastModified.toLocaleDateString()}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Note Editor */}
          {selectedSlot && (
            <div className="space-y-4 border-t pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Note Name:</label>
                <Input
                  value={noteName}
                  onChange={(e) => setNoteName(e.target.value)}
                  placeholder="Enter note name..."
                  maxLength={50}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content:</label>
                <Textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Write your note here..."
                  rows={8}
                  className="resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end">
                {!isCreatingNew && (
                  <Button onClick={handleDelete} variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
                <Button onClick={handleSave} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};