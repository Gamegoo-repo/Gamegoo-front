import { useCallback, useRef, useState } from "react";

import type { AlertProps } from "@/types";

interface UseAlertReturn {
  showAlert: boolean;
  alertProps: AlertProps;
  setShowAlert: (show: boolean) => void;
  showAlertWithContent: (
    icon: string,
    content: string,
    handleAlertClose: () => void,
    btnText: string
  ) => void;
}

export const useAlert = () => {
  const _return = useRef<UseAlertReturn>();
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

  const showAlertWithContent = useCallback(
    (
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
    },
    []
  );

  if (!_return.current) {
    _return.current = {
      showAlert: false,
      alertProps: {
        icon: "",
        width: 0,
        height: 0,
        content: "",
        alt: "",
        onClose: () => {},
        buttonText: "",
      },
      setShowAlert,
      showAlertWithContent,
    };
  }

  _return.current.showAlert = showAlert;
  _return.current.alertProps = alertProps;
  _return.current.showAlertWithContent = showAlertWithContent;

  return _return.current;
};
