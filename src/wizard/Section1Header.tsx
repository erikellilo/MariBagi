import type { UseFormReturn } from "react-hook-form";
import type { BagiFormData } from "./bagiFormSchema";
import { Input } from "@/components/ui/Input";
import { ScanButton } from "./ScanButton";
import { cn } from "@/lib/cn";

interface Section1HeaderProps {
  form: UseFormReturn<BagiFormData>;
}

export const Section1Header = ({ form }: Section1HeaderProps) => {
  const { register, watch, setValue } = form;
  const inputMode = watch("inputMode");
  const errors = form.formState.errors;

  const handleScanned = (data: {
    name: string;
    items: { name: string; amount: number; quantity: number; includeService: boolean; includeTax: boolean }[];
  }) => {
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
        includeService: item.includeService,
        includeTax: item.includeTax,
        allocation: [],
      }))
    );
  };

  return (
    <div className="space-y-4">
      <Input
        label="Nama Bagi"
        placeholder="Tiket Dufan, Makan Senop..."
        {...register("name")}
        error={errors.name?.message}
      />

      <div className="flex rounded-lg bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => setValue("inputMode", "form")}
          className={cn(
            "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            inputMode === "form" ? "bg-white text-brand-600 shadow-sm" : "text-gray-500"
          )}
        >
          Form
        </button>
        <button
          type="button"
          onClick={() => setValue("inputMode", "scan")}
          className={cn(
            "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            inputMode === "scan" ? "bg-white text-brand-600 shadow-sm" : "text-gray-500"
          )}
        >
          AI Scan
        </button>
      </div>

      {inputMode === "scan" && <ScanButton onScanned={handleScanned} />}
    </div>
  );
};
