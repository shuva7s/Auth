export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex">
      <section className="w-0 md:w-1/3 transition-all bg-accent dark:bg-background"></section>
      <section className="min-h-screen bg-card flex-1 flex justify-center items-center">
        {children}
      </section>
    </main>
  );
}
