export default function List({list}: {list: string[]}) {
  return list && list.length === 0 ? (
    <div className="p-4 flex justify-center items-center">Click + to add a new item.</div>
  ) : (
    <ol className="max-w-[90%] space-y-1 text-gray-500 list-decimal list-inside ">
      {list.map((item) => (
        <li key={item}>
          <span className="font-normal text-gray-900 dark:text-white">{item}</span>
        </li>
      ))}
    </ol>
  );
}
