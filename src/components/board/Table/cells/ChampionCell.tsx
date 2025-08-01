import { Champion } from "@/components/common";

export const ChampionCell = ({ champions }: { champions: any[] }) => (
  <div className="table_width flex items-center justify-center gap-[5px]">
    {champions.length > 0 ? (
      <Champion font="semiBold14" list={champions} />
    ) : (
      <div className="text-gray-400 text-sm font-medium">
        챔피언 정보가 없습니다.
      </div>
    )}
  </div>
);
