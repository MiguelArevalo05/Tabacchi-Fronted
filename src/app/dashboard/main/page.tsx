import { redirect } from "next/navigation";

export default function DashboardMainRedirectPage() {
  redirect("/admin");
}
