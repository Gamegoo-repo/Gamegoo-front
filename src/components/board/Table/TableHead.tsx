import type { TableTitleProps } from "@/types/board/table";

interface TableHeadProps {
  title: TableTitleProps[];
}

const TableHead = ({ title }: TableHeadProps) => {
  return (
    <div className="flex items-center justify-between py-[13px] px-[20px] text-sm font-bold rounded-lg bg-gray-800 text-white">
      {title.map((data, index) => (
        <p
          key={data.id}
          className={`table_width ${index === 0 ? "text-left" : ""}`}
        >
          {data.name}
        </p>
      ))}
    </div>
  );
};

export default TableHead;
