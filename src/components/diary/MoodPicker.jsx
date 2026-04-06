const MOODS = ['happy', 'sad', 'angry', 'anxious', 'confused', 'calm']

const MOOD_EMOJI = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  anxious: '😰',
  confused: '😕',
  calm: '😌',
}

export default function MoodPicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {MOODS.map((mood) => (
        <button
          key={mood}
          onClick={() => onChange(mood === value ? '' : mood)}
          style={{
            padding: '6px 12px',
            borderRadius: '20px',
            border: value === mood ? '2px solid #555' : '1px solid #ccc',
            background: value === mood ? '#f0f0f0' : 'white',
            cursor: 'pointer',
            fontWeight: value === mood ? '600' : '400',
          }}
        >
          {MOOD_EMOJI[mood]} {mood}
        </button>
      ))}
    </div>
  )
}