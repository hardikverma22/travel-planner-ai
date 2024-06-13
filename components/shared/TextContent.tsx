const TextContent = ({
  content,
  message = "Click + to add a new item.",
}: {
  content: string | undefined;
  message: string;
}) => {
  return <div className=" flex justify-center items-center">{content || message}</div>;
};

export default TextContent;
