"use client";

import Link from "next/link";
import { PublicShell } from "@/components/layout/PublicShell";
import { EXAMS } from "@/lib/data/exams";
import { Badge } from "@/components/ui/badge";

export function ExamsListingPage() {
  return (
    <PublicShell>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-1">Entrance Exams</h1>
        <p className="text-sm text-muted-foreground mb-6">JEE, NEET, CAT, GATE and more — no login needed</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXAMS.map((exam) => (
            <Link key={exam.slug} href={`/exams/${exam.slug}`}>
              <article className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-soft h-full">
                <Badge variant="outline" className="mb-2 text-[10px] border-primary/30 text-primary">
                  {exam.category}
                </Badge>
                <h2 className="text-sm font-semibold text-foreground mb-1">{exam.name}</h2>
                <p className="text-xs text-muted-foreground mb-3">{exam.conductingBody} · {exam.frequency}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{exam.description}</p>
                <p className="text-[10px] text-primary mt-3">Exam: {exam.examMonth}</p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}
