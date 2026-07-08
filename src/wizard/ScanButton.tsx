import { useRef } from "react";
import type { ChangeEvent } from "react";
import { useScanReceipt } from "@/hooks/useScanReceipt";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

interface ScanButtonProps {
  bagiId: string;
  onScanned: (data: { name: string; items: { name: string; amount: number; quantity: number }[] }) => void;
}

export const ScanButton = ({ bagiId, onScanned }: ScanButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scanMutation = useScanReceipt(bagiId);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    scanMutation.mutate(undefined, {
      onSuccess: (data) => {
        onScanned({ name: data.bagi.name, items: data.items });
      },
    });

    e.target.value = "";
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        variant="ghost"
        fullWidth
        onClick={handleClick}
        disabled={scanMutation.isPending}
      >
        {scanMutation.isPending ? (
          <span className="flex items-center gap-2">
            <Spinner className="h-4 w-4" /> Scanning...
          </span>
        ) : (
          "📷 Scan receipt"
        )}
      </Button>
      {scanMutation.isError && (
        <p className="mt-1 text-xs text-danger">Scan failed — try again</p>
      )}
    </>
  );
};
