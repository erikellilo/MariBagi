import { useParams } from "react-router-dom";

const BagiDetailPage = () => {
  const { bagiId } = useParams();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Bagi Detail: {bagiId}</h1>
      <p className="text-sm text-gray-500">(Read-only view — full implementation in a later task)</p>
    </div>
  );
};

export default BagiDetailPage;
