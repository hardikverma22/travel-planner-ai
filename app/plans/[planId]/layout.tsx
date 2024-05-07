import TopMenuBar from "@/components/TopMenuBar";

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="mx-auto w-full ">
      <TopMenuBar />
      <div className="w-full lg:px-20 px-5 py-3 min-h-[calc(100svh-6.5rem)]">{children}</div>
    </div>
  );
}
