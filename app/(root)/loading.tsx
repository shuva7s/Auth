import { Loader2 } from "lucide-react";

const PageLoader = () => {
  return (
    <section className="min-h-[50vh] flex wrapper justify-center items-center">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
    </section>
  );
};

export default PageLoader;
