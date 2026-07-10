import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { BagiFormData } from "./bagiFormSchema";
import { useWatch } from "react-hook-form";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";
import { formatRupiah } from "@/lib/format";

interface ItemCardProps {
  form: UseFormReturn<BagiFormData>;
  index: number;
  onRemove: () => void;
}

type AllocMode = "shared" | "perUser";

export const ItemCard = ({ form, index, onRemove }: ItemCardProps) => {
  const { register, setValue, getValues } = form;
  const members = useWatch({ control: form.control, name: "members" });
  const item = useWatch({ control: form.control, name: `items.${index}` });

  const [mode, setMode] = useState<AllocMode>("shared");

  const updateItem = (updater: (item: BagiFormData["items"][number]) => BagiFormData["items"][number]) => {
    const current = getValues("items");
    setValue("items", current.map((it, i) => (i === index ? updater(it) : it)));
  };

  const toggleMemberShared = (memberId: string) => {
    updateItem((it) => {
      const existing = it.allocation.find((a) => a.memberId === memberId);
      const allocation = existing
        ? it.allocation.filter((a) => a.memberId !== memberId)
        : [...it.allocation, { memberId, quantity: 1 }];
      return { ...it, allocation };
    });
  };

  const incrementMemberQty = (memberId: string) => {
    updateItem((it) => {
      const allocated = it.allocation.reduce((sum, a) => sum + a.quantity, 0);
      if (allocated >= it.quantity) return it;
      const existing = it.allocation.find((a) => a.memberId === memberId);
      const allocation = existing
        ? it.allocation.map((a) => (a.memberId === memberId ? { ...a, quantity: a.quantity + 1 } : a))
        : [...it.allocation, { memberId, quantity: 1 }];
      return { ...it, allocation };
    });
  };

  const switchMode = (newMode: AllocMode) => {
    setMode(newMode);
    updateItem((it) => ({ ...it, allocation: [] }));
  };

  const getAllocated = (): number => {
    if (!item) return 0;
    return item.allocation.reduce((sum, a) => sum + a.quantity, 0);
  };

  const getRemaining = (): number => {
    if (!item) return 0;
    return item.quantity - getAllocated();
  };

  const allocated = item ? getAllocated() : 0;
  const remaining = getRemaining();
  const isFullyAllocated = allocated > 0 && (mode === "shared" ? true : remaining === 0);

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
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-gray-400 hover:text-danger"
        >
          ✕
        </button>
      </div>

      <div className="mb-2">
        <select
          value={item?.paidBy ?? ""}
          onChange={(e) => updateItem((it) => ({ ...it, paidBy: e.target.value }))}
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
          onClick={() => switchMode("shared")}
          className={cn(
            "flex-1 rounded px-2 py-1 text-xs font-medium",
            mode === "shared" ? "bg-white text-brand-600 shadow-sm" : "text-gray-500"
          )}
        >
          Shared All
        </button>
        <button
          type="button"
          onClick={() => switchMode("perUser")}
          className={cn(
            "flex-1 rounded px-2 py-1 text-xs font-medium",
            mode === "perUser" ? "bg-white text-brand-600 shadow-sm" : "text-gray-500"
          )}
        >
          Per User
        </button>
      </div>

      {mode === "perUser" && (
        <p className={cn("mb-2 text-xs", remaining === 0 ? "text-green-600" : "text-gray-500")}>
          {remaining === 0 ? "Fully allocated" : `${remaining} remaining of ${item?.quantity ?? 0}`}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5">
        {members?.map((m) => {
          const allocEntry = item?.allocation.find((a) => a.memberId === m.id);
          const isSelected = !!allocEntry;
          const isDisabled = mode === "perUser" && !isSelected && remaining === 0;

          return (
            <Chip
              key={m.id}
              label={m.name.charAt(0).toUpperCase()}
              selected={isSelected}
              {...(mode === "perUser" && allocEntry ? { count: allocEntry.quantity } : {})}
              disabled={isDisabled}
              onClick={() => {
                if (mode === "shared") {
                  toggleMemberShared(m.id);
                } else {
                  incrementMemberQty(m.id);
                }
              }}
            />
          );
        })}
      </div>

      {isFullyAllocated && (
        <p className="mt-1 text-[10px] text-gray-400">
          {mode === "shared"
            ? `${allocated} × ${formatRupiah(perPersonAmount)} each`
            : item?.allocation
                .map((a) => `${members?.find((m) => m.id === a.memberId)?.name ?? "?"}: ${formatRupiah(perPersonAmount * a.quantity)}`)
                .join(" · ")}
        </p>
      )}
    </div>
  );
};
