export default function FeedCard({ item }) {
  return (
    <div className="feed-card">
      <span className="feed-card-type">{item.type}</span>
      <p className="feed-card-text">"{item.text}"</p>
      <span className="feed-card-author">
        {item.type === 'quote' ? `— ${item.author}` : `# ${item.author}`}
      </span>
    </div>
  )
}