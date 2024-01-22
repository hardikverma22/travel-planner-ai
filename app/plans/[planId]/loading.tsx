import {Loading} from "@/components/Laoding";
export default function LoadingComponent() {
  return (
    <div className="flex justify-center items-center flex-1 w-full h-full gap-5">
      <Loading />
      <span>Loading Plan</span>
    </div>
  );
}
