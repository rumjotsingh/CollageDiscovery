import { CollegeDetailPage } from "@/features/college-detail/CollegeDetailPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <CollegeDetailPage slug={slug} />;
}
