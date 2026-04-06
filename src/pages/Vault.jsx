import { useEffect, useState, useRef } from 'react';
import { getVaultItems, uploadVaultItem, deleteVaultItem } from '../api/vault';
import Layout from '../components/Layout';
// import './vault.css';
import './vault.css' ;

function VaultItem({ item, onDelete }) {
  const isLocked = item.is_locked;

  return (
    <div className={`vault-item ${isLocked ? 'vault-item--locked' : ''}`}>
      {isLocked ? (
        <div className="vault-item-locked-body">
          <span className="vault-lock-icon">🔒</span>
          <span className="vault-lock-remaining">
            {item.seconds_remaining > 0
              ? `${Math.ceil(item.seconds_remaining / 3600)}h remaining`
              : 'Locked'}
          </span>
        </div>
      ) : item.media_type === 'image' ? (
        <img
          src={item.file_url}
          alt={item.caption || ''}
          className="vault-item-image"
        />
      ) : (
        <div className="vault-item-audio">
          <audio controls src={item.file_url} className="vault-audio-player" />
        </div>
      )}

      {item.caption && (
        <div className="vault-item-caption">{item.caption}</div>
      )}

      <button
        onClick={() => onDelete(item.id)}
        className="vault-item-delete"
        aria-label="Delete"
      >
        ✕
      </button>
    </div>
  );
}

function VoiceRecorder({ onRecorded }) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    mediaRecorderRef.current = mr;
    chunksRef.current = [];
    mr.ondataavailable = (e) => chunksRef.current.push(e.data);
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      onRecorded(blob);
      stream.getTracks().forEach((t) => t.stop());
    };
    mr.start();
    setRecording(true);
  };

  const stop = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <button
      onClick={recording ? stop : start}
      className={`vault-recorder-btn ${recording ? 'recording' : ''}`}
    >
      {recording ? '⏹ Stop' : '🎙 Record'}
    </button>
  );
}

export default function Vault() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [unlocksAt, setUnlocksAt] = useState('');
  const fileInputRef = useRef(null);

  const load = () => {
    const params = filter ? { media_type: filter } : {};
    getVaultItems(params).then((res) => setItems(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const upload = async (file, mediaType) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('media_type', mediaType);
    if (caption) fd.append('caption', caption);
    if (unlocksAt) fd.append('unlocks_at', new Date(unlocksAt).toISOString());
    setUploading(true);
    try {
      await uploadVaultItem(fd);
      setCaption('');
      setUnlocksAt('');
      load();
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const mediaType = file.type.startsWith('image/') ? 'image' : 'audio';
    upload(file, mediaType);
  };

  const handleVoiceRecorded = (blob) => {
    const file = new File([blob], `voice-${Date.now()}.webm`, { type: 'audio/webm' });
    upload(file, 'audio');
  };

  const handleDelete = async (id) => {
    await deleteVaultItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <Layout>
      <div className="vault-root">
        <header className="vault-header">
          <div className="vault-header-left">
            <h1 className="vault-title">Vault</h1>
            <p className="vault-sub">Photos, voice notes, and memories</p>
          </div>
          <div className="vault-filter-group">
            {['', 'image', 'audio'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`vault-filter-btn ${filter === f ? 'active' : ''}`}
              >
                {f === '' ? 'All' : f === 'image' ? 'Images' : 'Audio'}
              </button>
            ))}
          </div>
        </header>

        {/* Upload zone */}
        <div className="vault-upload-card">
          <div className="vault-upload-fields">
            <input
              placeholder="Caption (optional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="vault-upload-input vault-upload-input--caption"
            />
            <input
              type="datetime-local"
              value={unlocksAt}
              onChange={(e) => setUnlocksAt(e.target.value)}
              title="Timed unlock (optional)"
              className="vault-upload-input vault-upload-input--unlock"
            />
          </div>
          <div className="vault-upload-actions">
            <button
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
              className="vault-upload-btn"
            >
              {uploading ? 'Uploading…' : '+ Add file'}
            </button>
            <VoiceRecorder onRecorded={handleVoiceRecorded} />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,audio/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <p className="vault-loading">Loading…</p>
        ) : (
          <div className="vault-grid">
            {items.length === 0 && (
              <p className="vault-empty">Nothing here yet. Add your first memory above.</p>
            )}
            {items.map((item) => (
              <VaultItem key={item.id} item={item} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
