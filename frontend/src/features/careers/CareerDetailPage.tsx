"use client";

import Link from "next/link";
import { PublicShell } from "@/components/layout/PublicShell";
import { getCareerBySlug } from "@/lib/data/careers";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export function CareerDetailPage({ slug }: { slug: string }) {
  const career = getCareerBySlug(slug);
  if (!career) notFound();

  return (
    <PublicShell>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-xs text-muted-foreground mb-1">{career.category}</p>
        <h1 className="text-2xl font-semibold mb-2">{career.title}</h1>
        <p className="text-sm text-primary mb-4">{career.avgSalary} · {career.growth} growth</p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">{career.description}</p>

        <h2 className="text-sm font-semibold mb-3">Career Roadmap</h2>
        <div className="space-y-0 mb-8 border-l-2 border-primary/30 ml-3 pl-6">
          {career.roadmap.map((step) => (
            <div key={step.step} className="relative pb-6 last:pb-0">
              <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-primary border-2 border-background" />
              <p className="text-xs font-semibold text-primary">Step {step.step}</p>
              <p className="text-sm font-medium text-foreground">{step.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
            </div>
          ))}
        </div>

        <h2 className="text-sm font-semibold mb-2">Key Skills</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {career.skills.map((s) => (
            <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
          ))}
        </div>

        <Link href="/courses" className="text-xs text-primary hover:underline">
          Explore related courses →
        </Link>
      </div>
    </PublicShell>
  );
}
