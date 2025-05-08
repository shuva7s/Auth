import Reset from "@/components/auth-components/reset";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

const RsetPassPage = () => {
  return (
    <Suspense
      fallback={
        <Loader2 className="animate-spin size-8 text-muted-foreground" />
      }
    >
      <Reset />
    </Suspense>
  );
};

export default RsetPassPage;
