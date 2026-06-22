import { redirect } from "next/navigation";

export default function DashboardServicesRedirectPage() {
  redirect("/admin/servicios");
}
