import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/utils/storage";

const ProtectRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const accesssToken = getAccessToken(); // 로그인 유무 결정
  const router = useRouter();

  useEffect(() => {
    if (!accesssToken) {
      router.push("/"); // "/"으로 리다이렉트
    }
  }, [accesssToken, router]);

  return <>{children}</>;
};

export default ProtectRoute;
