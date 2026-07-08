import { cn } from "@/lib/cn";

interface ChipProps {
  label: string;
  selected?: boolean;
  count?: number;
  disabled?: boolean;
  onClick?: () => void;
}

export const Chip = ({ label, selected, count, disabled, onClick }: ChipProps) => {
  const hasCount = count !== undefined;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
        "border",
        selected
          ? "border-brand-500 bg-brand-50 text-brand-700"
          : "border-gray-300 bg-white text-gray-500 hover:border-gray-400",
        disabled && "cursor-not-allowed opacity-40"
      )}
    >
      <span>{label}</span>
      {hasCount && (
        <span
          className={cn(
            "min-w-[18px] rounded px-1 text-center text-[10px] font-bold",
            selected ? "bg-brand-500 text-gray-900" : "bg-gray-200 text-gray-500"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
};
