import { useState } from 'react';

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
      setMessage('Đã cập nhật');
    } catch (err) {
      setMessage('Lỗi khi cập nhật bio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {editMode ? (
        <>
          <textarea value={value} onChange={(e) => setValue(e.target.value)} />
          <button onClick={handleSubmit} disabled={loading}>Lưu</button>
          <button onClick={() => setEditMode(false)}>Hủy</button>
          {message && <p>{message}</p>}
        </>
      ) : (
        <>
          <p>{bio || 'Chưa có giới thiệu'}</p>
          <button onClick={() => setEditMode(true)}>Sửa Bio</button>
        </>
      )}
    </div>
  );
}
