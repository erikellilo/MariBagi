interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorBanner = ({ message, onRetry }: ErrorBannerProps) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-danger/20 bg-danger/5 px-4 py-3">
      <p className="text-sm text-danger-dark">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-medium text-danger underline hover:text-danger-dark"
        >
          Retry
        </button>
      )}
    </div>
  );
};
