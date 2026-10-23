export default function ErrorBox({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="alert error" role="alert">
      <span>{error.message}</span>
      <button className="btn small" onClick={onRetry}>
        Tentar de novo
      </button>
    </div>
  );
}
