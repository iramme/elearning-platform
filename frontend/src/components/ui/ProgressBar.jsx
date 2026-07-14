export default function ProgressBar({ percent }) {
  return (
    <div className="progress-bar">
      <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
    </div>
  );
}