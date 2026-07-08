import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useBagiList } from "@/hooks/useBagiList";
import { useDeleteBagi } from "@/hooks/useDeleteBagi";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

const BagiListPage = () => {
  const navigate = useNavigate();
  const { data: bagiList, isLoading, isError, refetch } = useBagiList();
  const deleteBagi = useDeleteBagi();

  const handleDelete = (e: MouseEvent, bagiId: string) => {
    e.stopPropagation();
    if (confirm("Delete this bagi? All members and items will be removed.")) {
      deleteBagi.mutate(bagiId);
    }
  };

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
        <ErrorBanner message="Failed to load bagi list" onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">MariBagi</h1>
        <Button onClick={() => navigate("/bagi/new")}>+ New</Button>
      </header>

      {!bagiList || bagiList.length === 0 ? (
        <EmptyState
          title="No bagi sessions yet"
          description="Create your first expense split to get started."
          action={<Button onClick={() => navigate("/bagi/new")}>Create a bagi</Button>}
        />
      ) : (
        <ul className="space-y-2">
          {bagiList.map((bagi) => (
            <li
              key={bagi.id}
              onClick={() => navigate(`/bagi/${bagi.id}`)}
              className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-brand-300 shadow-card"
            >
              <div>
                <p className="font-medium text-gray-900">{bagi.name}</p>
                <p className="text-xs text-gray-500">
                  {bagi.memberCount} members · {bagi.itemCount} items
                </p>
              </div>
              <button
                onClick={(e) => handleDelete(e, bagi.id)}
                className="text-xs text-danger hover:text-danger-dark"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BagiListPage;
