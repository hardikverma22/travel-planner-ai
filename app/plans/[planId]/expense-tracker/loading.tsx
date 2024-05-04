import {Loading} from "@/components/shared/Laoding";
export default function LoadingComponent() {
  return (
    <div className="justify-center items-center flex-1 w-full h-full lg:col-span-4 lg:border-l flex flex-col gap-5 px-4 py-6 lg:px-8">
      <Loading />
      <span>Loading Expenses...</span>
    </div>
  );
}
