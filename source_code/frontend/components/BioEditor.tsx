import { useState } from 'react';
import { Edit3, X, Save } from 'lucide-react';

export function BioEditor({ bio, onSave }: {
  bio: string;
  onSave: (newBio: string) => Promise<void>;
}) {
  const [editMode, setEditMode] = useState(false);
  const [value, setValue] = useState(bio);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');
    try {
      await onSave(value);
      setEditMode(false);
      setMessage('Bio updated successfully');
    } catch (err) {
      setMessage('Failed to update bio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {editMode ? (
        <>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full min-h-[80px] rounded-md border border-border bg-card text-card-foreground p-2"
            placeholder="Write your bio here..."
          />
          <div className="flex items-center gap-2">
            <button onClick={handleSubmit} disabled={loading} className="btn-primary inline-flex items-center gap-2 px-3 py-1.5 rounded-md disabled:opacity-50">
              <Save className="w-4 h-4" /> Save
            </button>
            <button onClick={() => setEditMode(false)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border hover:bg-accent">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
          {message && <p className="text-sm text-muted-foreground">{message}</p>}
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{bio || 'No bio'}</p>
          <button onClick={() => setEditMode(true)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border hover:bg-accent">
            <Edit3 className="w-4 h-4" /> Change Bio
          </button>
        </>
      )}
    </div>
  );
}
