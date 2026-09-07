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
      className="relative flex h-12 w-12 items-center justify-center rounded-full bg-danger text-base font-bold text-white border border-gray-900"
      aria-label={ariaName}
    >
      {userInitial}
      <button
        type="button"
        aria-label={`Edit ${ariaName}`}
        onClick={onEdit}
        className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-accent bg-card text-[0.5rem] font-bold text-accent"
      >
        ✎
      </button>
      <button
        type="button"
        aria-label={`Hapus ${ariaName}`}
        onClick={onDelete}
        className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-accent bg-card text-[0.5rem] font-bold text-accent"
      >
        ×
      </button>
    </div>
  );
};

export default UserRound;
