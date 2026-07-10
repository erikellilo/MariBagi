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
  const { fields, append, remove, update } = useFieldArray({ control: form.control, name: "items" });
  const items = useWatch({ control: form.control, name: "items" });

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

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {fields.map((field, index) => (
          <ItemCard
            key={field.id}
            form={form}
            index={index}
            item={items?.[index]}
            onRemove={() => remove(index)}
            onUpdate={(item) => update(index, item)}
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
