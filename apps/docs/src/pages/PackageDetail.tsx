import { useParams, Navigate } from "react-router-dom";
import { PackageShowcase } from "@/components/PackageShowcase";
import { packagesMeta } from "@/data/packages";

export default function PackageDetail() {
  const { packageId } = useParams<{ packageId: string }>();

  if (!packageId || !(packageId in packagesMeta)) {
    return <Navigate to="/api" replace />;
  }

  const pkg = packagesMeta[packageId];

  return (
    <div className="container py-6 max-w-5xl">
      <PackageShowcase pkg={pkg} />
    </div>
  );
}
