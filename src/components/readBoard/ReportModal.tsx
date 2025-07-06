import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import styled from "styled-components";

import { reportMember } from "@/api";
import { Button, Checkbox, FormModal, Input } from "@/components/common";
import { REPORT_REASON } from "@/constants/report";
import { setCloseModal } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import { theme } from "@/styles/theme";

import type { AlertProps, MemberPost } from "@/types";

const ReportModal = ({
  isPost,
  postId,
}: {
  isPost: MemberPost | undefined;
  postId: number;
}) => {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [reportDetail, setReportDetail] = useState<string>("");
  const dispatch = useDispatch();
  const isUser = useSelector((state: RootState) => state.user);
  const [showAlert, setShowAlert] = useState(false);
  const [alertProps, setAlertProps] = useState<AlertProps>({
    icon: "",
    width: 0,
    height: 0,
    content: "",
    alt: "",
    onClose: () => {},
    buttonText: "",
  });
  const router = useRouter();

  /* 로그아웃 시, 비회원 접근 시 알럿 props 설정 함수 */
  const logoutMessage = "로그아웃 되었습니다. 다시 로그인 해주세요.";
  const loginRequiredMessage = "로그인이 필요한 서비스입니다.";
  const deletedMessage = "해당 글은 삭제된 글입니다.";

  const showAlertWithContent = (
    icon: string,
    content: string,
    handleAlertClose: () => void,
    btnText: string
  ) => {
    setAlertProps({
      icon: icon,
      width: 68,
      height: 58,
      content: content,
      alt: "경고",
      onClose: handleAlertClose,
      buttonText: btnText,
    });
    setShowAlert(true);
  };

  /* 신고하기 사유 */
  const handleCheckboxChange = (checked: number) => {
    setCheckedItems((prev) =>
      prev.includes(checked)
        ? prev.filter((c) => c !== checked)
        : [...prev, checked]
    );
  };
  /* 신고하기 모달 닫기 */
  const handleModalClose = () => {
    setCheckedItems([]);
    setReportDetail("");
    dispatch(setCloseModal());
  };

  /* 신고하기 */
  const handleReport = async () => {
    if (!isUser.gameName) {
      return showAlertWithContent(
        "exclamation",
        logoutMessage,
        () => router.push("/riot"),
        "로그인하기"
      );
    }

    if (!isPost || isUser.id === isPost?.memberId) return;

    const params = {
      memberId: isPost.memberId,
      reportCodeList: checkedItems,
      contents: reportDetail,
      pathCode: 1, // BOARD
      boardId: postId,
    };

    try {
      await reportMember(params);
      await handleModalClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <FormModal
        type="checkbox"
        title="유저 신고하기"
        width="494px"
        height="721px"
        closeButtonWidth={17}
        closeButtonHeight={17}
        borderRadius="20px"
        onClose={handleModalClose}
      >
        <div>
          <ReportLabel>신고 사유</ReportLabel>
          <ReportReasonContent>
            {REPORT_REASON.map((data) => (
              <Checkbox
                key={data.id}
                value={data.id}
                label={data.text}
                fontSize="regular18"
                isChecked={checkedItems.includes(data.id)}
                onArrayChange={handleCheckboxChange}
                id={`report${data.id}`}
              />
            ))}
          </ReportReasonContent>
          <ReportLabel>상세 내용</ReportLabel>
          <ReportContent>
            <Input
              inputType="textarea"
              value={reportDetail}
              onChange={(value) => {
                setReportDetail(value);
              }}
              placeholder="내용을 입력하세요. (선택)"
              borderRadius="8px"
              fontSize="regular16"
              height="134px"
              id="report"
              maxLeng={500}
            />
          </ReportContent>
          <ReportButton>
            <Button
              type="submit"
              onClick={handleReport}
              buttonType="primary"
              text="신고하기"
              disabled={checkedItems.length === 0}
            />
          </ReportButton>
        </div>
      </FormModal>
    </>
  );
};

export default ReportModal;

const ReportLabel = styled.p`
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.semiBold18};
  margin-bottom: 12px;
`;

const ReportContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const ReportReasonContent = styled(ReportContent)`
  margin-bottom: 38px;
`;

const ReportButton = styled.div`
  margin-top: 21px;
`;
