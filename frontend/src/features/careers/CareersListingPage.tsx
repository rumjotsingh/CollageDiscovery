"use client";

import Link from "next/link";
import { PublicShell } from "@/components/layout/PublicShell";
import { CAREERS } from "@/lib/data/careers";

export function CareersListingPage() {
  return (
    <PublicShell>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-1">Career Paths</h1>
        <p className="text-sm text-muted-foreground mb-6">Explore salaries, growth, and roadmaps</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {CAREERS.map((career) => (
            <Link key={career.slug} href={`/careers/${career.slug}`}>
              <article className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-soft">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-sm font-semibold">{career.title}</h2>
                  <span className="text-xs text-primary">{career.avgSalary}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{career.category} · Growth: {career.growth}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{career.description}</p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}
