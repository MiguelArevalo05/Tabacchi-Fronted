import { redirect } from "next/navigation";

export default function DashboardProfilesRedirectPage() {
  redirect("/admin/perfiles");
}
