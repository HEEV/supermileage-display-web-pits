'use client'

import { useSearchParams } from "next/navigation";
import Dashboard from "@/components/ui/dashboard";
import { Suspense } from "react";

function PitCrewDashboardContent() {
  const params = useSearchParams();
  const car = (params.get("car") || "karch") as "karch" | "sting";

  return <Dashboard mode="single" carId={car} />;
}
export default function ConfigPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading dashboard...</div>}>
      <PitCrewDashboardContent />
    </Suspense>
  );
}