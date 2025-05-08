import Footer from "@/components/app-components/footer";
import Navbar from "@/components/app-components/navbar";
import { Plus } from "lucide-react";

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[92vh] justify-center items-center flex-col gap-3 border-x relative wrapper w-full">
        {children}
        <Plus className="hidden lg:block absolute top-0 left-0 text-border -translate-x-1/2 -translate-y-1/2" />
        <Plus className="hidden lg:block absolute top-0 right-0 text-border translate-x-1/2 -translate-y-1/2" />
        <Plus className="hidden lg:block absolute bottom-0 left-0 text-border -translate-x-1/2 translate-y-1/2" />
        <Plus className="hidden lg:block absolute bottom-0 right-0 text-border translate-x-1/2 translate-y-1/2" />
      </main>
      <Footer />
    </>
  );
}
