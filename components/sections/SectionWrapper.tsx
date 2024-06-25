type SectionWrapperProps = {
  children: React.ReactNode;
  id: string;
};
export default function SectionWrapper({children, id}: SectionWrapperProps) {
  return (
    <article
      id={id}
      className="scroll-mt-20 text-foreground shadow-md ring-1 ring-ring/20 p-5 bg-background/50 rounded-sm"
    >
      {children}
    </article>
  );
}
