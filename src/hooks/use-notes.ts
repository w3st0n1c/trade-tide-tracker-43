import { useState, useEffect } from 'react';

export interface Note {
  id: number;
  name: string;
  content: string;
  lastModified: Date;
}

const NOTES_STORAGE_KEY = 'trade-tide-notes';
const MAX_NOTES = 10;

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          lastModified: new Date(note.lastModified)
        }));
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Failed to load notes:', error);
      }
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const saveNote = (id: number, name: string, content: string) => {
    setNotes(prev => {
      const existingIndex = prev.findIndex(note => note.id === id);
      const newNote: Note = {
        id,
        name,
        content,
        lastModified: new Date()
      };

      if (existingIndex >= 0) {
        // Update existing note
        const updated = [...prev];
        updated[existingIndex] = newNote;
        return updated;
      } else {
        // Add new note
        return [...prev, newNote];
      }
    });
  };

  const deleteNote = (id: number) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const getNote = (id: number): Note | undefined => {
    return notes.find(note => note.id === id);
  };

  const getAvailableSlots = (): number[] => {
    const usedSlots = notes.map(note => note.id);
    const allSlots = Array.from({ length: MAX_NOTES }, (_, i) => i + 1);
    return allSlots.filter(slot => !usedSlots.includes(slot));
  };

  return {
    notes,
    saveNote,
    deleteNote,
    getNote,
    getAvailableSlots,
    maxNotes: MAX_NOTES
  };
}