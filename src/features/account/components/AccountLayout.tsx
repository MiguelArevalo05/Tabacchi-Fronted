"use client";

import { usePathname } from "next/navigation";

import AccountContentSkeleton from "@/features/account/components/AccountContentSkeleton";
import UserAccountShell from "@/features/account/components/UserAccountShell";
import { useRequireAuth } from "@/features/account/hooks/useRequireAuth";
import { getAccountPageMeta } from "@/features/account/utils/accountPageMeta";

interface AccountLayoutProps {
  children: React.ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const pathname = usePathname();
  const { user, loading } = useRequireAuth(pathname);
  const meta = getAccountPageMeta(pathname, user);

  return (
    <UserAccountShell title={meta.title} description={meta.description}>
      {loading || !user ? <AccountContentSkeleton /> : children}
    </UserAccountShell>
  );
}
