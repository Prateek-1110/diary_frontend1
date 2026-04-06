import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLetter, deleteLetter } from '../api/letters';
import Layout from '../components/Layout';
import './LetterDetail.css';

export default function LetterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLetter(id)
      .then((res) => setLetter(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this letter?')) return;
    await deleteLetter(id);
    navigate('/letters');
  };

  if (loading) {
    return (
      <Layout>
        <div className="letter-detail-page">
          <p className="letter-detail-loading">Loading…</p>
        </div>
      </Layout>
    );
  }

  if (!letter) {
    return (
      <Layout>
        <div className="letter-detail-page">
          <p className="letter-detail-loading">Letter not found.</p>
        </div>
      </Layout>
    );
  }

  const isLocked = letter.is_locked;

  return (
    <Layout>
      <div className="letter-detail-page">
        <div className="letter-detail-nav">
          <button className="letter-detail-back" onClick={() => navigate('/letters')}>
            ← Letters
          </button>
        </div>

        <header className="letter-detail-header">
          <p className="letter-detail-eyebrow">
            {isLocked ? 'sealed' : 'opened'}
          </p>
          <h1 className="letter-detail-title">{letter.subject}</h1>
          <p className="letter-detail-meta">
            {isLocked ? 'Unlocks' : 'Unlocked'}{' '}
            {new Date(letter.unlocks_at).toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric'
            })}
          </p>
        </header>

        <div className="letter-detail-rule" />

        {isLocked ? (
          <div className="letter-detail-sealed">
            <div className="letter-detail-wax">✦</div>
            <p className="letter-detail-sealed-msg">This letter is still sealed.</p>
            <p className="letter-detail-sealed-sub">
              Opens in {Math.ceil(letter.seconds_remaining / 86400)} day{Math.ceil(letter.seconds_remaining / 86400) !== 1 ? 's' : ''}
            </p>
          </div>
        ) : (
          <div
            className="letter-detail-body"
            dangerouslySetInnerHTML={{ __html: letter.body }}
          />
        )}

        {!isLocked && (
          <div className="letter-detail-footer">
            <button className="letter-detail-delete" onClick={handleDelete}>
              Delete this letter
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
