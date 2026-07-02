import { redirect } from "next/navigation";

interface CategoryRedirectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryRedirectPage({ params }: CategoryRedirectPageProps) {
  const { slug } = await params;
  redirect(`/productos?categoria=${slug}`);
}
