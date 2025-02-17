import { Skeleton } from "../ui/skeleton";

export const Pending = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section className="w-4/5 max-w-5xl">
        <Skeleton className="h-8 w-1/2 mb-4" /> {/* Skeleton for username */}
        <Skeleton className="h-6 w-1/4" /> {/* Skeleton for logout button */}
      </section>
    </main>
  );
};
