'use client'

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Dashboard from "@/components/dashboard";
import { clearAuthToken, getAuthToken } from "@/lib/auth";

const LOGIN_EXPIRED_PATH = '/login?reason=session-expired'

function PitCrewDashboardContent({
  authToken,
  onAuthFailure,
}: {
  authToken: string;
  onAuthFailure: () => void;
}) {
  const params = useSearchParams();
  const car = (params.get("car") || "karch") as "karch" | "sting";

  return (
    <Dashboard
      mode="single"
      carId={car}
      authToken={authToken}
      onAuthFailure={onAuthFailure}
    />
  );
}

export default function ConfigPage() {
  const router = useRouter();
  const [authToken] = useState<string | null>(() => getAuthToken());

  const handleAuthFailure = useCallback(() => {
    clearAuthToken();
    router.replace(LOGIN_EXPIRED_PATH);
  }, [router]);

  useEffect(() => {
    if (!authToken) {
      router.replace("/login");
    }
  }, [authToken, router]);

  if (!authToken) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  return (
    <Suspense fallback={<div className="p-4">Loading dashboard...</div>}>
      <PitCrewDashboardContent
        authToken={authToken}
        onAuthFailure={handleAuthFailure}
      />
    </Suspense>
  );
}