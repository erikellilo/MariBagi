import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <Link to="/bagi" className="text-brand-600 underline">
        Back to Bagi list
      </Link>
    </div>
  );
};

export default NotFoundPage;
