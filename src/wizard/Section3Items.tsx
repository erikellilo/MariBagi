import { useFieldArray } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";
import type { BagiFormData } from "./bagiFormSchema";
import { ItemCard } from "./ItemCard";
import { Button } from "@/components/ui/Button";

interface Section3ItemsProps {
  form: UseFormReturn<BagiFormData>;
  onSave: () => void;
  isSubmitting: boolean;
}

export const Section3Items = ({ form, onSave, isSubmitting }: Section3ItemsProps) => {
  const { control, setValue } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const showTaxService = useWatch({ control, name: "showTaxService" });

  const handleAddItem = () => {
    append({
      id: crypto.randomUUID(),
      name: "",
      amount: 0,
      quantity: 1,
      paidBy: "",
      includeService: false,
      includeTax: false,
      allocation: [],
    });
  };

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={showTaxService ?? false}
          onChange={(e) => setValue("showTaxService", e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
        />
        <span className="text-sm text-gray-600">Sertakan Pajak & Service</span>
      </label>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <ItemCard
            key={field.id}
            form={form}
            index={index}
            onRemove={() => remove(index)}
            showTaxService={showTaxService ?? false}
          />
        ))}
      </div>

      {fields.length === 0 && (
        <p className="py-6 text-center text-sm text-gray-400">
          Belum ada item. Tambah manual atau scan receipt.
        </p>
      )}

      <Button variant="ghost" fullWidth onClick={handleAddItem}>
        + Tambah Item
      </Button>

      <Button fullWidth onClick={onSave} disabled={isSubmitting}>
        {isSubmitting ? "Menyimpan..." : "Simpan Bagi"}
      </Button>
    </div>
  );
};
