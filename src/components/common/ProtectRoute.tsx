import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { getAccessToken } from "@/utils/storage";

const ProtectRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isLoggedIn = useSelector((state: RootState) => !!state.user.id); // id가 있을 때 로그인으로 간주
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();

    // 로그인 상태가 아니거나 토큰이 없으면 리다이렉트
    if (!isLoggedIn || !token) {
      router.push("/"); // "/"으로 리다이렉트
    }
  }, [isLoggedIn, router]);

  return <>{children}</>;
};

export default ProtectRoute;
