import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { createLetter } from '../api/letters';
import Layout from '../components/Layout';
import './LetterNew.css';

export default function LetterNew() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [unlocksAt, setUnlocksAt] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const editor = useEditor({ extensions: [StarterKit], content: '' });

  const handleSubmit = async () => {
    if (!subject.trim() || !unlocksAt) {
      setError('Subject and unlock date are required.');
      return;
    }
    setSaving(true);
    try {
      await createLetter({
        subject,
        body: editor.getHTML(),
        unlocks_at: new Date(unlocksAt).toISOString(),
      });
      navigate('/letters');
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to save letter.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="letter-new-page">
        <div className="letter-new-nav">
          <button className="letter-new-back" onClick={() => navigate('/letters')}>
            ← Letters
          </button>
        </div>

        <header className="letter-new-header">
          <p className="letter-new-eyebrow">compose</p>
          <h1 className="letter-new-title">Write a letter</h1>
          <p className="letter-new-subtitle">
            Sealed until the moment you choose. No peeking.
          </p>
        </header>

        {error && <p className="letter-new-error">{error}</p>}

        <div className="letter-new-form">
          <div className="letter-new-field">
            <label className="letter-new-label">Subject</label>
            <input
              className="letter-new-input"
              placeholder="What's this letter about?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="letter-new-field">
            <label className="letter-new-label">Unlock on</label>
            <input
              type="datetime-local"
              className="letter-new-input letter-new-input--date"
              value={unlocksAt}
              onChange={(e) => setUnlocksAt(e.target.value)}
            />
          </div>

          <div className="letter-new-field">
            <label className="letter-new-label">Body</label>
            <div className="letter-new-editor">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        <div className="letter-new-actions">
          <button
            className="letter-new-submit"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Sealing…' : 'Send to the future'}
          </button>
          <button
            className="letter-new-cancel"
            onClick={() => navigate('/letters')}
          >
            Cancel
          </button>
        </div>
      </div>
    </Layout>
  );
}
