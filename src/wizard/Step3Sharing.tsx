import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";
import type { BagiFormData } from "./bagiFormSchema";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";
import { formatRupiah } from "@/lib/format";

interface Step3SharingProps {
  form: UseFormReturn<BagiFormData>;
}

type AllocMode = "equal" | "quantity";

export const Step3Sharing = ({ form }: Step3SharingProps) => {
  const items = useWatch({ control: form.control, name: "items" });
  const members = useWatch({ control: form.control, name: "members" });

  const [modes, setModes] = useState<Record<number, AllocMode>>({});

  const getMode = (index: number, quantity: number): AllocMode => {
    if (modes[index]) return modes[index];
    return quantity > 1 ? "quantity" : "equal";
  };

  const setMode = (index: number, mode: AllocMode) => {
    setModes((prev) => ({ ...prev, [index]: mode }));
    const currentItems = form.getValues("items");
    currentItems[index].allocation = [];
    form.setValue("items", currentItems);
  };

  const toggleMemberEqual = (itemIndex: number, memberId: string) => {
    const currentItems = form.getValues("items");
    const current = currentItems[itemIndex].allocation;
    const existing = current.find((a) => a.memberId === memberId);
    if (existing) {
      currentItems[itemIndex].allocation = current.filter((a) => a.memberId !== memberId);
    } else {
      currentItems[itemIndex].allocation = [...current, { memberId, quantity: 1 }];
    }
    form.setValue("items", currentItems);
  };

  const incrementMemberQty = (itemIndex: number, memberId: string) => {
    const currentItems = form.getValues("items");
    const item = currentItems[itemIndex];
    const allocated = item.allocation.reduce((sum, a) => sum + a.quantity, 0);
    if (allocated >= item.quantity) return;

    const existing = item.allocation.find((a) => a.memberId === memberId);
    if (existing) {
      existing.quantity += 1;
    } else {
      item.allocation = [...item.allocation, { memberId, quantity: 1 }];
    }
    form.setValue("items", currentItems);
  };

  const getRemaining = (itemIndex: number): number => {
    const item = items?.[itemIndex];
    if (!item) return 0;
    const allocated = item.allocation.reduce((sum, a) => sum + a.quantity, 0);
    return item.quantity - allocated;
  };

  const getMemberName = (memberId: string): string => {
    return members?.find((m) => m.id === memberId)?.name ?? "?";
  };

  return (
    <div className="space-y-4">
      {items?.map((item, index) => {
        const mode = getMode(index, item.quantity);
        const remaining = getRemaining(index);
        const isFullyAllocated = mode === "equal" ? item.allocation.length > 0 : remaining === 0;
        const perPersonAmount =
          item.allocation.length > 0
            ? item.amount / item.allocation.reduce((s, a) => s + a.quantity, 0)
            : 0;

        return (
          <div key={item.id} className="rounded-lg border border-gray-200 bg-white p-3">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-400">
                  qty {item.quantity} · {formatRupiah(item.amount)}
                </p>
              </div>
              {isFullyAllocated && (
                <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                  ✓ allocated
                </span>
              )}
            </div>

            <div className="mb-2 flex rounded-md bg-gray-100 p-0.5">
              <button
                type="button"
                onClick={() => setMode(index, "equal")}
                className={cn(
                  "flex-1 rounded px-2 py-1 text-xs font-medium",
                  mode === "equal" ? "bg-white text-brand-600 shadow-sm" : "text-gray-500"
                )}
              >
                Equal share
              </button>
              <button
                type="button"
                onClick={() => setMode(index, "quantity")}
                className={cn(
                  "flex-1 rounded px-2 py-1 text-xs font-medium",
                  mode === "quantity" ? "bg-white text-brand-600 shadow-sm" : "text-gray-500"
                )}
              >
                By quantity
              </button>
            </div>

            <div className="mb-2">
              <select
                value={item.paidBy}
                onChange={(e) => {
                  const current = form.getValues("items");
                  current[index].paidBy = e.target.value;
                  form.setValue("items", current);
                }}
                className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs"
              >
                <option value="">Who paid? ▾</option>
                {members?.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {mode === "quantity" && (
              <p
                className={cn(
                  "mb-2 text-xs",
                  remaining === 0 ? "text-green-600" : "text-gray-500"
                )}
              >
                {remaining === 0 ? "Fully allocated" : `${remaining} remaining of ${item.quantity}`}
              </p>
            )}

            <div className="flex flex-wrap gap-1.5">
              {members?.map((m) => {
                const allocEntry = item.allocation.find((a) => a.memberId === m.id);
                const isSelected = !!allocEntry;
                const isDisabled =
                  mode === "quantity" && !isSelected && remaining === 0;

                return (
                  <Chip
                    key={m.id}
                    label={m.name}
                    selected={isSelected}
                    {...((mode === "quantity" && allocEntry) ? { count: allocEntry.quantity } : {})}
                    disabled={isDisabled}
                    onClick={() => {
                      if (mode === "equal") {
                        toggleMemberEqual(index, m.id);
                      } else {
                        incrementMemberQty(index, m.id);
                      }
                    }}
                  />
                );
              })}
            </div>

            {isFullyAllocated && (
              <p className="mt-1 text-[10px] text-gray-400">
                {mode === "equal"
                  ? `${formatRupiah(perPersonAmount)} each`
                  : item.allocation
                      .map((a) => `${getMemberName(a.memberId)}: ${formatRupiah(perPersonAmount * a.quantity)}`)
                      .join(" · ")}
              </p>
            )}
          </div>
        );
      })}

      {(!items || items.length === 0) && (
        <p className="py-8 text-center text-sm text-gray-400">No items to allocate.</p>
      )}
    </div>
  );
};
