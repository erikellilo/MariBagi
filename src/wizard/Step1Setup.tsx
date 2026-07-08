import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import type { BagiFormData } from "./bagiFormSchema";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface Step1SetupProps {
  form: UseFormReturn<BagiFormData>;
}

export const Step1Setup = ({ form }: Step1SetupProps) => {
  const { register, control, watch, setValue } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "members" });

  const includeService = watch("includeService");
  const includeTax = watch("includeTax");

  useEffect(() => {
    if (fields.length === 0) {
      append({ id: crypto.randomUUID(), name: "" });
      append({ id: crypto.randomUUID(), name: "" });
    }
  }, [fields.length, append]);

  const handleAddMember = () => {
    append({ id: crypto.randomUUID(), name: "" });
  };

  const handleRemoveMember = (index: number) => {
    if (fields.length > 2) {
      remove(index);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        label="Split group name"
        placeholder="Tiket Dufan, Makan Senop..."
        {...register("name")}
        error={form.formState.errors.name?.message}
      />

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={includeService ?? false}
            onChange={(e) => setValue("includeService", e.target.checked)}
          />
          Service charge
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={includeTax ?? false}
            onChange={(e) => setValue("includeTax", e.target.checked)}
          />
          Tax
        </label>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
          Members
        </label>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <input
                {...register(`members.${index}.name` as const)}
                placeholder={`Member ${index + 1} name`}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              {fields.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveMember(index)}
                  className="text-xs text-danger hover:text-danger-dark"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <Button variant="ghost" onClick={handleAddMember} className="mt-2">
          + Add member
        </Button>
        {form.formState.errors.members && (
          <p className="mt-1 text-xs text-danger">
            {form.formState.errors.members.message ?? "Member validation error"}
          </p>
        )}
      </div>
    </div>
  );
};
