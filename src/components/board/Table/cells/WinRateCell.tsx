export const WinRateCell = ({ winRate }: { winRate: number | null }) => (
  <div className="table_width py-[14px] px-[21px] text-center">
    <p
      className={
        winRate && winRate >= 50
          ? "text-violet-600 font-bold text-base whitespace-nowrap"
          : "text-gray-800 font-bold text-base whitespace-nowrap"
      }
    >
      {winRate === null ? "0%" : `${winRate}%`}
    </p>
  </div>
);
