import { redirect } from "next/navigation";

export default function DashboardPrivilegesRedirectPage() {
  redirect("/admin/privilegios");
}
