import {Loading} from "@/components/shared/Loading";

export default function LoadingComponent() {
  return (
    <div className="min-h-[calc(100svh-6.5rem)] flex justify-center items-center flex-1 w-full h-full gap-5 lg:col-span-4 flex-col px-4 py-6 lg:px-8">
      <Loading />
      <span>Loading Expenses...</span>
    </div>
  );
}
