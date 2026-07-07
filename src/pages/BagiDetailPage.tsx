import { useParams, useNavigate } from "react-router-dom";
import { useBagiDetail } from "@/hooks/useBagiDetail";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { formatRupiah } from "@/lib/format";

const BagiDetailPage = () => {
  const { bagiId } = useParams();
  const navigate = useNavigate();
  const { data: bagi, isLoading, isError, refetch } = useBagiDetail(bagiId ?? "");

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <ErrorBanner message="Bagi not found or failed to load" onRetry={() => refetch()} />
        <Button variant="ghost" onClick={() => navigate("/bagi")} className="mt-4">
          ← Back to list
        </Button>
      </div>
    );
  }

  if (!bagi) return null;

  const memberName = (id: string): string =>
    bagi.members.find((m) => m.id === id)?.name ?? "?";

  const totalAmount = bagi.items.reduce((sum, item) => sum + item.amount, 0);

  const serviceTaxLabels = [bagi.includeService && "Service", bagi.includeTax && "Tax"]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/bagi")}
          className="text-sm text-blue-600"
        >
          ‹ Back
        </button>
      </div>

      <header className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">{bagi.name}</h1>
        <p className="text-xs text-gray-400">
          {new Date(bagi.date).toLocaleDateString("id-ID")}
          {serviceTaxLabels && <span> · {serviceTaxLabels}</span>}
        </p>
      </header>

      <section className="mb-6">
        <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
          Members ({bagi.members.length})
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {bagi.members.map((m) => (
            <span
              key={m.id}
              className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
            >
              {m.name}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Items ({bagi.items.length})
          </h2>
          <span className="text-xs font-semibold text-gray-700">
            Total: {formatRupiah(totalAmount)}
          </span>
        </div>

        {bagi.items.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-400">No items recorded.</p>
        ) : (
          <ul className="space-y-2">
            {bagi.items.map((item) => {
              const allocTotal = item.allocation.reduce((s, a) => s + a.quantity, 0);
              const perUnit = allocTotal > 0 ? item.amount / allocTotal : 0;
              return (
                <li key={item.id} className="rounded-lg border border-gray-200 bg-white p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-400">
                        qty {item.quantity} · paid by {memberName(item.paidBy)}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      {formatRupiah(item.amount)}
                    </p>
                  </div>
                  {item.allocation.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.allocation.map((a, i) => (
                        <span
                          key={i}
                          className="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600"
                        >
                          {memberName(a.memberId)}
                          {a.quantity > 1 ? ` ×${a.quantity}` : ""}: {formatRupiah(perUnit * a.quantity)}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Button variant="ghost" fullWidth onClick={() => navigate("/bagi")}>
        ← Back to list
      </Button>
    </div>
  );
};

export default BagiDetailPage;
