import { CareerDetailPage } from "@/features/careers/CareerDetailPage";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CareerDetailPage slug={slug} />;
}
