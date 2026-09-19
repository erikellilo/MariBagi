type UserRoundProps = {
  userInitial: string;
  name?: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

const UserRound = ({ userInitial, name, onEdit, onDelete }: UserRoundProps) => {
  const ariaName = name ?? userInitial;

  return (
    <div
      className="relative flex h-12 w-12 items-center justify-center rounded-full bg-avatar-red text-base font-bold text-white border border-ink"
      role="img"
      aria-label={ariaName}
    >
      {userInitial}
      {onEdit && (
        <button
          type="button"
          aria-label={`Edit ${ariaName}`}
          onClick={onEdit}
          className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-accent bg-card text-[0.5rem] font-bold text-accent after:absolute after:-inset-3.5 after:content-[''] cursor-pointer"
        >
          ✎
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          aria-label={`Hapus ${ariaName}`}
          onClick={onDelete}
          className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-accent bg-card text-[0.5rem] font-bold text-accent after:absolute after:-inset-3.5 after:content-[''] cursor-pointer"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default UserRound;
