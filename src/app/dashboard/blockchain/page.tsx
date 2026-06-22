import { redirect } from "next/navigation";

export default function DashboardBlockchainRedirectPage() {
  redirect("/admin/blockchain");
}
