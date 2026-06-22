import { ExamDetailPage } from "@/features/exams/ExamDetailPage";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ExamDetailPage slug={slug} />;
}
