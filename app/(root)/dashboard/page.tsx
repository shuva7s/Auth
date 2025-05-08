import Profile from "@/components/auth-components/profile";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

const DashboardPage = () => {
  return (
    <Suspense
      fallback={<Skeleton className="w-full bg-card rounded-lg max-w-5xl min-h-120 border" />}
    >
      <Profile />
    </Suspense>
  );
};

export default DashboardPage;
