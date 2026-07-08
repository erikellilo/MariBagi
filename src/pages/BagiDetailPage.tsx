import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBagiDetail } from "@/hooks/useBagiDetail";
import { computeSplit } from "@/lib/splitCalc";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { formatRupiah } from "@/lib/format";

const BagiDetailPage = () => {
  const { bagiId } = useParams();
  const navigate = useNavigate();
  const { data: bagi, isLoading, isError, refetch } = useBagiDetail(bagiId ?? "");

  const split = useMemo(() => (bagi ? computeSplit(bagi.members, bagi.items) : null), [bagi]);

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

  if (!bagi || !split) return null;

  const memberName = (id: string): string => bagi.members.find((m) => m.id === id)?.name ?? "?";

  const sortedMembers = [...split.members].sort((a, b) => b.share - a.share);

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <div className="mb-4">
        <button onClick={() => navigate("/bagi")} className="text-sm text-brand-600">
          ‹ Back
        </button>
      </div>

      <header className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">{bagi.name}</h1>
        <p className="text-xs text-gray-400">{new Date(bagi.date).toLocaleDateString("id-ID")}</p>
        <p className="mt-2 text-2xl font-bold text-gray-900">{formatRupiah(split.grandTotal)}</p>
        <p className="text-xs text-gray-400">total · split among {bagi.members.length}</p>
      </header>

      <section className="mb-6">
        <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Each member&apos;s share</h2>
        <ul className="space-y-2">
          {sortedMembers.map((m) => (
            <li key={m.memberId} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-card">
              <span className="font-medium text-gray-900">{memberName(m.memberId)}</span>
              <span className="font-semibold text-gray-900">{formatRupiah(m.share)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Item breakdown</h2>
        {bagi.items.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-400">No items recorded.</p>
        ) : (
          <ul className="space-y-2">
            {split.itemBreakdown.map((item) => {
              const original = bagi.items.find((i) => i.id === item.itemId);
              return (
                <li key={item.itemId} className="rounded-lg border border-gray-200 bg-white p-3 shadow-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{original?.name ?? "?"}</p>
                      <p className="text-xs text-gray-400">paid by {memberName(original?.paidBy ?? "")}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-700">{formatRupiah(item.amount)}</p>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.shares.map((s, i) => (
                      <span key={i} className="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">
                        {memberName(s.memberId)}: {formatRupiah(s.amount)}
                      </span>
                    ))}
                  </div>
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
