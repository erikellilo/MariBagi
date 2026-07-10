import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";
import type { BagiFormData } from "./bagiFormSchema";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";
import { formatRupiah } from "@/lib/format";

interface ItemCardProps {
  form: UseFormReturn<BagiFormData>;
  index: number;
  onRemove: () => void;
  onUpdate: (item: BagiFormData["items"][number]) => void;
}

type AllocMode = "shared" | "perUser";

export const ItemCard = ({ form, index, onRemove, onUpdate }: ItemCardProps) => {
  const members = useWatch({ control: form.control, name: "members" });
  const item = useWatch({ control: form.control, name: `items.${index}` });

  const [mode, setMode] = useState<AllocMode>("shared");
  const { register } = form;

  const handleSharedAll = () => {
    setMode("shared");
    if (!item) return;
    const allocation = (members ?? []).map((m) => ({ memberId: m.id, quantity: 1 }));
    onUpdate({ ...item, allocation });
  };

  const handlePerUser = () => {
    setMode("perUser");
    if (!item) return;
    onUpdate({ ...item, allocation: [] });
  };

  const handleAddMember = (memberId: string) => {
    if (!item) return;
    const allocated = item.allocation.reduce((sum: number, a: { quantity: number }) => sum + a.quantity, 0);
    if (allocated >= item.quantity) return;
    const existing = item.allocation.find((a: { memberId: string }) => a.memberId === memberId);
    const allocation = existing
      ? item.allocation.map((a) => (a.memberId === memberId ? { ...a, quantity: a.quantity + 1 } : a))
      : [...item.allocation, { memberId, quantity: 1 }];
    onUpdate({ ...item, allocation });
  };

  const handlePaidBy = (paidBy: string) => {
    if (!item) return;
    onUpdate({ ...item, paidBy });
  };

  const allocated = item ? item.allocation.reduce((sum: number, a: { quantity: number }) => sum + a.quantity, 0) : 0;
  const remaining = item ? item.quantity - allocated : 0;
  const memberCount = (members ?? []).length;
  const perPersonAmount = allocated > 0 ? Math.round((item?.amount ?? 0) / allocated) : 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="mb-2 flex items-center gap-2">
        <input
          {...register(`items.${index}.name` as const)}
          placeholder="Nama item"
          className="flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
        />
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span>Qty</span>
          <input
            type="number"
            {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
            className="w-12 rounded-md border border-gray-300 px-1.5 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
            min={1}
          />
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span>Rp</span>
          <input
            type="number"
            {...register(`items.${index}.amount` as const, { valueAsNumber: true })}
            className="w-24 rounded-md border border-gray-300 px-1.5 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
            placeholder="Harga"
          />
        </div>
        <button type="button" onClick={onRemove} className="text-xs text-gray-400 hover:text-danger">
          ✕
        </button>
      </div>

      <div className="mb-2">
        <select
          value={item?.paidBy ?? ""}
          onChange={(e) => handlePaidBy(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs"
        >
          <option value="">Dibayar oleh ▾</option>
          {members?.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2 flex rounded-md bg-gray-100 p-0.5">
        <button
          type="button"
          onClick={handleSharedAll}
          className={cn(
            "flex-1 rounded px-2 py-1 text-xs font-medium",
            mode === "shared" ? "bg-brand-500 text-white shadow-sm" : "text-gray-500"
          )}
        >
          Shared All
        </button>
        <button
          type="button"
          onClick={handlePerUser}
          className={cn(
            "flex-1 rounded px-2 py-1 text-xs font-medium",
            mode === "perUser" ? "bg-brand-500 text-white shadow-sm" : "text-gray-500"
          )}
        >
          Per User
        </button>
      </div>

      {mode === "shared" && allocated > 0 && (
        <p className="mb-2 text-xs text-gray-500">
          Shared equally · {memberCount} × {formatRupiah(perPersonAmount)} each
        </p>
      )}

      {mode === "perUser" && (
        <p className={cn("mb-2 text-xs", remaining === 0 ? "text-green-600" : "text-gray-500")}>
          {remaining === 0 ? "Fully allocated" : `${remaining} remaining of ${item?.quantity ?? 0}`}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5">
        {members?.map((m) => {
          const allocEntry = item?.allocation.find((a) => a.memberId === m.id);
          return (
            <Chip
              key={m.id}
              label={m.name.charAt(0).toUpperCase()}
              selected={!!allocEntry}
              {...(mode === "perUser" && allocEntry ? { count: allocEntry.quantity } : {})}
              disabled={mode === "shared"}
              onClick={() => {
                if (mode === "perUser") handleAddMember(m.id);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
