import { useFieldArray } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import type { BagiFormData } from "./bagiFormSchema";
import { Button } from "@/components/ui/Button";
import { ScanButton } from "./ScanButton";
import { formatRupiah } from "@/lib/format";

interface Step2ItemsProps {
  form: UseFormReturn<BagiFormData>;
}

export const Step2Items = ({ form }: Step2ItemsProps) => {
  const { register, control, watch } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const items = watch("items");

  const handleAddItem = () => {
    append({
      id: crypto.randomUUID(),
      name: "",
      amount: 0,
      quantity: 1,
      paidBy: "",
      allocation: [],
    });
  };

  const handleScanned = (data: { name: string; items: { name: string; amount: number; quantity: number }[] }) => {
    if (!form.getValues("name")) {
      form.setValue("name", data.name);
    }
    form.setValue(
      "items",
      data.items.map((item) => ({
        id: crypto.randomUUID(),
        name: item.name,
        amount: item.amount,
        quantity: item.quantity,
        paidBy: "",
        allocation: [],
      }))
    );
  };

  return (
    <div className="space-y-4">
      <ScanButton bagiId="draft" onScanned={handleScanned} />

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Items ({fields.length})
        </span>
      </div>

      {fields.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">
          No items yet. Add one manually or scan a receipt.
        </p>
      ) : (
        <ul className="space-y-2">
          {fields.map((field, index) => {
            const item = items?.[index];
            return (
              <li key={field.id} className="rounded-lg border border-gray-200 bg-white p-3">
                <div className="flex items-center gap-2">
                  <input
                    {...register(`items.${index}.name` as const)}
                    placeholder="Item name"
                    className="flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
                  />
                  <input
                    type="number"
                    {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
                    className="w-14 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
                    min={1}
                  />
                  <span className="text-xs text-gray-400">x</span>
                  <input
                    type="number"
                    {...register(`items.${index}.amount` as const, { valueAsNumber: true })}
                    className="w-24 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
                    placeholder="Amount"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-xs text-danger hover:text-danger-dark"
                  >
                    ✕
                  </button>
                </div>
                {item && item.name && item.amount > 0 && (
                  <p className="mt-1 text-xs text-gray-400">
                    {formatRupiah(item.amount)} total
                    {item.quantity > 1 ? ` · ${formatRupiah(item.amount / item.quantity)} each` : ""}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <Button variant="ghost" onClick={handleAddItem}>
        + Add item
      </Button>
    </div>
  );
};
