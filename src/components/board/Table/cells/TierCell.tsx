import clsx from "clsx";

import { checkTierAbbr, toLowerCaseString } from "@/utils";

export const TierCell = ({
  tier,
  rank,
  className,
}: {
  tier: string;
  rank?: number;
  className?: string;
}) => (
  <div className="flex items-center justify-center gap-[3px] py-[14px] px-[21px] text-center table_width">
    <object
      data={
        !tier
          ? "/assets/images/tier/unranked.svg"
          : `/assets/images/tier/${toLowerCaseString(tier)}.svg`
      }
      width={28}
      height={26}
      className="pointer-events-none"
    />
    <p
      className={clsx(
        "text-base whitespace-nowrap", // 기본 스타일
        {
          "text-gray-800 font-bold": !className, // 기본값
          "text-violet-600 font-bold": className?.includes("emph"),
          "text-gray-500 font-medium": className?.includes("gray"),
        }
      )}
    >
      {checkTierAbbr(tier || "")}
      {tier !== "UNRANKED" && rank}
    </p>
  </div>
);
