import { redirect, usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";

const DASHBOARD_URL = "/dashboard";

const useAuth = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const clerk = useClerk();

  const pathname = usePathname();

  const isCurrentPathDashboard = pathname === DASHBOARD_URL;
  const isCurrentPathHome = pathname === "/";

  const router = useRouter()

  const openSignInPopupOrDirect = () => {
    if (isLoading)
      return;
    if (!isAuthenticated) {
      clerk.openSignIn({ afterSignInUrl: DASHBOARD_URL });
      return;
    }
    router.push("/dashboard")
  };
  return { isCurrentPathDashboard, isCurrentPathHome, openSignInPopupOrDirect, isAuthenticated };
};

export default useAuth;
