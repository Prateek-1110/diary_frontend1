import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import MoodPicker from './MoodPicker'
import { useState } from 'react'
export default function DiaryEditor({ initial = {}, onSave, onCancel, loading }) {
  const [title, setTitle] = useState(initial.title || '')
  const [mood, setMood] = useState(initial.mood || '')
  const [visibility, setVisibility] = useState(initial.visibility || 'private')
  const [themeOverride, setThemeOverride] = useState(initial.theme_override || '')
  const [fontOverride, setFontOverride] = useState(initial.font_override || '')
  const [writtenAt, setWrittenAt] = useState(
    initial.written_at ? initial.written_at.slice(0, 16) : new Date().toISOString().slice(0, 16)
  )

  const editor = useEditor({
    extensions: [StarterKit],
    content: initial.body || '',
  })

  function handleSave() {
    onSave({
      title,
      body: editor.getHTML(),
      mood,
      visibility,
      theme_override: themeOverride || null,
      font_override: fontOverride || null,
      written_at: new Date(writtenAt).toISOString(),
    })
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px' }}>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        style={{ width: '100%', fontSize: '22px', border: 'none', borderBottom: '1px solid #ddd', marginBottom: '16px', padding: '8px 0', outline: 'none' }}
      />

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '13px', color: '#888' }}>Written at</label>
        <input
          type="datetime-local"
          value={writtenAt}
          onChange={e => setWrittenAt(e.target.value)}
          style={{ display: 'block', marginTop: '4px', padding: '6px', border: '1px solid #ddd', borderRadius: '6px' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '8px' }}>Mood</label>
        <MoodPicker value={mood} onChange={setMood} />
      </div>

      <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '13px', color: '#888' }}>Visibility</label>
          <select
            value={visibility}
            onChange={e => setVisibility(e.target.value)}
            style={{ display: 'block', marginTop: '4px', padding: '6px', border: '1px solid #ddd', borderRadius: '6px' }}
          >
            <option value="private">Private</option>
            <option value="shared">Shared</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '13px', color: '#888' }}>Theme override</label>
          <input
            value={themeOverride}
            onChange={e => setThemeOverride(e.target.value)}
            placeholder="e.g. soft-blue"
            style={{ display: 'block', marginTop: '4px', padding: '6px', border: '1px solid #ddd', borderRadius: '6px' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '13px', color: '#888' }}>Font override</label>
          <input
            value={fontOverride}
            onChange={e => setFontOverride(e.target.value)}
            placeholder="e.g. serif"
            style={{ display: 'block', marginTop: '4px', padding: '6px', border: '1px solid #ddd', borderRadius: '6px' }}
          />
        </div>
      </div>

      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '12px', minHeight: '200px', marginBottom: '20px' }}>
        <EditorContent editor={editor} />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleSave}
          disabled={loading}
          style={{ padding: '10px 24px', background: '#333', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          {loading ? 'Saving…' : 'Save'}
        </button>
        {onCancel && (
          <button onClick={onCancel} style={{ padding: '10px 24px', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer', background: 'white' }}>
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}