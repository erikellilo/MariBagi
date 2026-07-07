import { useBagiList } from "@/hooks/useBagiList";
import { bagiFormSchema } from "@/wizard/bagiFormSchema";

const App = () => {
  const { data, isLoading, isError } = useBagiList();
  console.log("schema:", bagiFormSchema);

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (isError) return <div className="p-8">Error loading bagi</div>;

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Bagi List (temp verification)</h1>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default App;
