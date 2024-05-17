type SectionWrapperProps = {
  children: React.ReactNode;
  id: string;
};
export default function SectionWrapper({children, id}: SectionWrapperProps) {
  return (
    <article
      id={id}
      className="text-foreground shadow-md ring-1 ring-ring/20 px-5 py-8 bg-background/50 rounded-sm"
    >
      {children}
    </article>
  );
}
