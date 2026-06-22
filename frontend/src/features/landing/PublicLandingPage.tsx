"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Compass,
  GitCompareArrows,
  Bookmark,
  BarChart3,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const FEATURES = [
  {
    icon: Compass,
    title: "Explore 100+ Colleges",
    description: "Search, filter, and discover institutions across India with real data.",
  },
  {
    icon: GitCompareArrows,
    title: "Side-by-Side Compare",
    description: "Compare fees, placements, and ratings in a clean data table.",
  },
  {
    icon: Bookmark,
    title: "Save & Shortlist",
    description: "Build your personal shortlist and revisit decisions anytime.",
  },
  {
    icon: BarChart3,
    title: "Data-Driven Insights",
    description: "Ratings, placement stats, and reviews — all in one dashboard.",
  },
];

export function PublicLandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/welcome");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent border border-primary/20">
              <GraduationCap className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-semibold">CollegeIQ</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/profile">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/profile">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.08),transparent_60%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Badge variant="outline" className="mb-6 border-primary/30 text-primary bg-accent">
              <Sparkles className="h-3 w-3 mr-1" />
              College Discovery Platform
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] mb-6">
              Find the right college
              <span className="block text-primary mt-1">with data, not guesswork.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Browse, compare, and save Indian colleges. Built for students who want
              clarity — fees, placements, ratings, and reviews in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/profile">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">
                  Start Exploring
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button size="lg" variant="outline" className="h-11 px-8 border-border">
                  Browse as Guest
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto"
          >
            {[
              { value: "100+", label: "Colleges" },
              { value: "15", label: "States" },
              { value: "4.2", label: "Avg Rating" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-semibold text-primary tabular-nums">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Everything you need to decide
            </h2>
            <p className="text-sm text-muted-foreground">
              A data product built for serious college research.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <Card className="glass-card border-border bg-card hover:border-border-hover transition-soft h-full">
                  <CardContent className="p-6">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent border border-primary/20 mb-4">
                      <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-1.5">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center glass-card rounded-2xl p-10 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Ready to find your college?
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Create a free account and start building your shortlist today.
          </p>
          <Link href="/profile">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Create Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
