"use client";

import Link from "next/link";
import { PublicShell } from "@/components/layout/PublicShell";
import { getExamBySlug } from "@/lib/data/exams";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export function ExamDetailPage({ slug }: { slug: string }) {
  const exam = getExamBySlug(slug);
  if (!exam) notFound();

  return (
    <PublicShell>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Badge variant="outline" className="mb-3 border-primary/30 text-primary">{exam.category}</Badge>
        <h1 className="text-2xl font-semibold mb-2">{exam.name}</h1>
        <p className="text-sm text-muted-foreground mb-6">{exam.conductingBody} · {exam.mode} · {exam.frequency}</p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">{exam.description}</p>
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {[
            ["Eligibility", exam.eligibility],
            ["Application", exam.applicationMonth],
            ["Exam Month", exam.examMonth],
            ["Mode", exam.mode],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-border bg-card p-4">
              <p className="text-[10px] text-muted-foreground uppercase mb-1">{label}</p>
              <p className="text-sm font-medium">{value}</p>
            </div>
          ))}
        </div>
        <h2 className="text-sm font-semibold mb-2">Subjects</h2>
        <div className="flex flex-wrap gap-2 mb-8">
          {exam.subjects.map((s) => (
            <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
          ))}
        </div>
        <Link href="/colleges" className="text-xs text-primary hover:underline">
          Browse colleges accepting {exam.name} →
        </Link>
      </div>
    </PublicShell>
  );
}
