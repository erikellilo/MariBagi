interface EmptyStateProps {
  title: string;
  description?: string | undefined;
  action?: React.ReactNode | undefined;
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {description && <p className="max-w-xs text-xs text-gray-400">{description}</p>}
      {action}
    </div>
  );
};
