import { useState } from "react";

import { reportMember } from "@/api";

export const useReport = (memberId: number, myId: number) => {
  const [isReportBoxOpen, setIsReportBoxOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [reportDetail, setReportDetail] = useState<string>("");

  // 신고하기 체크
  const handleCheckboxChange = (id: number) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleRunReport = async () => {
    if (myId === memberId) return;
    const params = {
      memberId,
      reportCodeList: checkedItems,
      contents: reportDetail,
      pathCode: 3,
    };

    try {
      await reportMember(params);
      setIsReportBoxOpen(false);
    } catch (error) {
      console.error("Report failed", error);
    }
  };

  return {
    isReportBoxOpen,
    setIsReportBoxOpen,
    handleCheckboxChange,
    checkedItems,
    setCheckedItems,
    reportDetail,
    setReportDetail,
    handleRunReport,
  };
};
