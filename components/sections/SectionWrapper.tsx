type SectionWrapperProps = {
  children: React.ReactNode;
  id: string;
};
export default function SectionWrapper({children, id}: SectionWrapperProps) {
  return (
    <div
      id={id}
      className="shadow-md ring-1 ring-gray-300 px-5 py-8 bg-white/50 rounded-sm"
    >
      {children}
    </div>
  );
}
