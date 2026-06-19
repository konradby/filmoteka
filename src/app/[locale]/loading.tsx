import { Spinner } from "@/components/ui/Spinner";

export default function HomeLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <Spinner />
    </div>
  );
}
