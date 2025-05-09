import { Loader2 } from "lucide-react";

const PageLoader = () => {
  return (
    <section className="min-h-[50vh] flex justify-center items-center w-full">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
    </section>
  );
};

export default PageLoader;
