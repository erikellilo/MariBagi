import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import type { BagiFormData } from "./bagiFormSchema";
import { Button } from "@/components/ui/Button";

interface Section2MembersProps {
  form: UseFormReturn<BagiFormData>;
}

export const Section2Members = ({ form }: Section2MembersProps) => {
  const { register, control } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "members" });
  const errors = form.formState.errors;

  useEffect(() => {
    if (fields.length === 0) {
      append({ id: crypto.randomUUID(), name: "" });
      append({ id: crypto.randomUUID(), name: "" });
    }
  }, [fields.length, append]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Anggota
        </span>
        <Button variant="ghost" size="sm" onClick={() => append({ id: crypto.randomUUID(), name: "" })}>
          + Tambah
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {fields.map((field, index) => (
          <div key={field.id} className="relative">
            <input
              {...register(`members.${index}.name` as const)}
              placeholder={`Anggota ${index + 1}`}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 pr-7 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            {fields.length > 2 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-danger"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {errors.members && (
        <p className="mt-1 text-xs text-danger">
          {errors.members.message ?? errors.members.root?.message ?? "Minimal 2 anggota"}
        </p>
      )}
    </div>
  );
};
