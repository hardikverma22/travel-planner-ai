import Image from "next/image";

type PromptProps = {
  content: string | undefined;
  imageUrl: string | null | undefined;
  placeName: string | undefined;
};

const Prompt = ({content, imageUrl, placeName}: PromptProps) => {
  return (
    <div
      id="imagination"
      className="shadow-md ring-1 ring-gray-300 bg-white/50 rounded-sm 
                flex flex-col gap-5"
    >
      {imageUrl && (
        <div className="relative w-full overflow-hidden h-[200px] md:h-[400px] flex items-end">
          <Image
            src={imageUrl}
            alt="Image for the place"
            sizes="100vw"
            className="w-full rounded-t-md object-cover z-0"
            fill
          />
          <div className="px-5 py-2 z-10 relative flex justify-between w-full bg-black/40">
            <h2 className="text-2xl text-white font-bold tracking-wide">
              {placeName}
            </h2>
            <div className="rounded-md w-fit ml-8">
              <p className="text-white">"{content}"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prompt;
