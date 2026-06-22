"use client";

import { motion } from "framer-motion";
import { MapPin, Star, Bookmark, BookmarkCheck, MessageSquare, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PublicShell } from "@/components/layout/PublicShell";
import { StatBadge } from "@/components/ui/StatBadge";
import { Tabs } from "@/components/ui/Tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useCollege } from "@/hooks/useColleges";
import { useSaveCollege, useUnsaveCollege, useSavedColleges } from "@/hooks/useSaved";
import { useCreateReview } from "@/hooks/useReviews";
import { useDiscussions, useAskQuestion, usePostAnswer } from "@/hooks/useDiscussions";
import { useRequireAuth } from "@/components/auth/LoginModal";
import { useAuthModal } from "@/providers/AuthModalProvider";
import { cn, formatCurrency, formatRating } from "@/lib/utils";

interface CollegeDetailPageProps {
  slug: string;
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "courses", label: "Courses" },
  { id: "placements", label: "Placements" },
  { id: "reviews", label: "Reviews" },
  { id: "qa", label: "Q&A" },
];

export function CollegeDetailPage({ slug }: CollegeDetailPageProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { data: college, isLoading, isError, refetch } = useCollege(slug);
  const { requireAuth, isAuthenticated } = useRequireAuth();
  const { openLogin } = useAuthModal();
  const { data: saved = [] } = useSavedColleges();
  const saveMutation = useSaveCollege();
  const unsaveMutation = useUnsaveCollege();
  const createReview = useCreateReview(college?.id ?? "");
  const { data: discussions = [], isLoading: loadingQA } = useDiscussions(college?.id);
  const askQuestion = useAskQuestion();

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionContent, setQuestionContent] = useState("");
  const [answerTexts, setAnswerTexts] = useState<Record<string, string>>({});
  const [qaError, setQaError] = useState<string | null>(null);

  const postAnswer = usePostAnswer(college?.id ?? "");
  const isSaved = saved.some((c) => c.id === college?.id);

  const handleSave = () => {
    if (!college) return;
    requireAuth(() => {
      if (isSaved) unsaveMutation.mutate(college.id);
      else saveMutation.mutate(college);
    });
  };

  const saving = saveMutation.isPending || unsaveMutation.isPending;

  const handleSubmitReview = () => {
    if (!reviewComment.trim()) return;
    createReview.mutate(
      { rating: reviewRating, comment: reviewComment },
      { onSuccess: () => setReviewComment("") },
    );
  };

  const handleAskQuestion = () => {
    const title = questionTitle.trim();
    const content = questionContent.trim();

    if (title.length < 5) {
      setQaError("Question title must be at least 5 characters.");
      return;
    }
    if (content.length < 10) {
      setQaError("Question details must be at least 10 characters.");
      return;
    }

    setQaError(null);
    requireAuth(() => {
      askQuestion.mutate(
        { collegeId: college!.id, title, content },
        {
          onSuccess: () => {
            setQuestionTitle("");
            setQuestionContent("");
            setQaError(null);
          },
          onError: (error) => {
            setQaError(error instanceof Error ? error.message : "Failed to post question.");
          },
        },
      );
    });
  };

  const handlePostAnswer = (questionId: string) => {
    const content = answerTexts[questionId]?.trim();
    if (!content) return;

    if (content.length < 10) {
      setQaError("Answers must be at least 10 characters.");
      return;
    }

    setQaError(null);
    requireAuth(() => {
      postAnswer.mutate(
        { questionId, content },
        {
          onSuccess: () => {
            setAnswerTexts((p) => ({ ...p, [questionId]: "" }));
            setQaError(null);
          },
          onError: (error) => {
            setQaError(error instanceof Error ? error.message : "Failed to post answer.");
          },
        },
      );
    });
  };

  if (isLoading) {
    return (
      <PublicShell>
        <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-2/3 bg-muted" />
          <Skeleton className="h-4 w-1/3 bg-muted" />
          <Skeleton className="h-64 w-full rounded-xl bg-muted" />
        </div>
      </PublicShell>
    );
  }

  if (isError || !college) {
    return (
      <PublicShell>
        <ErrorState message="College not found." onRetry={() => refetch()} />
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 lg:p-8 max-w-4xl mx-auto"
      >
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h1 className="text-2xl font-semibold text-foreground tracking-tight leading-tight">
                {college.name}
              </h1>
              <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-sm">
                  {college.location}, {college.state}
                </span>
                {college.establishedYear != null && (
                  <>
                    <span>·</span>
                    <span className="text-sm">Est. {college.establishedYear}</span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className={cn(
                "shrink-0 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors disabled:opacity-60",
                isSaved
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {isSaved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
              {saving ? "Saving…" : isSaved ? "Saved" : "Save"}
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <StatBadge label="Annual Fees" value={formatCurrency(college.fees)} variant="accent" />
            <StatBadge
              label="Avg. Placement"
              value={college.placement ? `₹${college.placement.averagePackage} LPA` : "—"}
            />
            <StatBadge
              label="Rating"
              value={
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 text-primary fill-primary" />
                  {formatRating(college.rating)}
                </span>
              }
              variant="success"
            />
          </div>
        </div>

        <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

        <div className="min-h-[200px]">
          {activeTab === "overview" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{college.overview}</p>
              {(college.academicScore != null || college.placementScore != null) && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {college.academicScore != null && (
                    <StatBadge label="Academic" value={`${college.academicScore}/10`} />
                  )}
                  {college.facultyScore != null && (
                    <StatBadge label="Faculty" value={`${college.facultyScore}/10`} />
                  )}
                  {college.infrastructureScore != null && (
                    <StatBadge label="Infrastructure" value={`${college.infrastructureScore}/10`} />
                  )}
                  {college.placementScore != null && (
                    <StatBadge label="Placement" value={`${college.placementScore}/10`} variant="accent" />
                  )}
                  {college.accommodationScore != null && (
                    <StatBadge label="Accommodation" value={`${college.accommodationScore}/10`} />
                  )}
                  {college.socialLifeScore != null && (
                    <StatBadge label="Social Life" value={`${college.socialLifeScore}/10`} />
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "courses" && (
            <div className="space-y-2">
              {college.courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{course.name}</p>
                    <p className="text-xs text-muted-foreground">{course.duration}</p>
                  </div>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {formatCurrency(course.fees)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "placements" && college.placement && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <StatBadge label="Average Package" value={`₹${college.placement.averagePackage} LPA`} variant="accent" />
              <StatBadge label="Highest Package" value={`₹${college.placement.highestPackage} LPA`} />
              <StatBadge label="Placement Rate" value={`${college.placement.placementPercentage}%`} variant="success" />
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                <p className="text-sm font-medium text-foreground">Write a Review</p>
                {isAuthenticated ? (
                  <>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((r) => (
                        <button
                          key={r}
                          onClick={() => setReviewRating(r)}
                          className={cn(
                            "h-8 w-8 rounded-lg text-sm font-medium border transition-soft",
                            reviewRating >= r
                              ? "border-primary/30 bg-primary/10 text-primary"
                              : "border-border text-muted-foreground",
                          )}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                    <Textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience…"
                      className="bg-background border-border min-h-[80px]"
                    />
                    <Button
                      onClick={handleSubmitReview}
                      disabled={!reviewComment.trim() || createReview.isPending}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {createReview.isPending ? "Submitting…" : "Submit Review"}
                    </Button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Sign in to share your experience with other students.
                    </p>
                    <Button
                      onClick={() => openLogin()}
                      variant="outline"
                      className="border-primary/30 text-primary hover:bg-primary/10"
                    >
                      Sign in to post a review
                    </Button>
                  </div>
                )}
              </div>

              {college.reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">No reviews yet. Be the first!</p>
              ) : (
                college.reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{review.user.name}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-primary fill-primary" />
                        <span className="text-xs text-primary">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "qa" && (
            <div className="space-y-4">
              {qaError && (
                <p className="text-xs text-red-400 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2">
                  {qaError}
                </p>
              )}
              <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">Ask a Question</p>
                </div>
                {isAuthenticated ? (
                  <>
                    <Input
                      value={questionTitle}
                      onChange={(e) => setQuestionTitle(e.target.value)}
                      placeholder="Question title"
                      className="bg-background border-border"
                    />
                    <Textarea
                      value={questionContent}
                      onChange={(e) => setQuestionContent(e.target.value)}
                      placeholder="Describe your question…"
                      className="bg-background border-border min-h-[80px]"
                    />
                    <Button
                      onClick={handleAskQuestion}
                      disabled={
                        questionTitle.trim().length < 5 ||
                        questionContent.trim().length < 10 ||
                        askQuestion.isPending
                      }
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {askQuestion.isPending ? "Posting…" : "Post Question"}
                    </Button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Sign in to ask the community about this college.
                    </p>
                    <Button
                      onClick={() => openLogin()}
                      variant="outline"
                      className="border-primary/30 text-primary hover:bg-primary/10"
                    >
                      Sign in to ask a question
                    </Button>
                  </div>
                )}
              </div>

              {loadingQA ? (
                <Skeleton className="h-24 w-full bg-muted" />
              ) : discussions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No questions yet. Ask the community!</p>
              ) : (
                discussions.map((q) => (
                  <div key={q.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{q.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {q.user.name} · {q._count?.answers ?? q.answers?.length ?? 0} answers
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">{q.content}</p>
                    </div>

                    {(q.answers?.length ?? 0) > 0 && (
                      <div className="space-y-2 border-t border-border pt-3">
                        {q.answers!.map((answer) => (
                          <div
                            key={answer.id}
                            className="rounded-lg bg-muted/30 px-3 py-2"
                          >
                            <p className="text-xs text-muted-foreground mb-1">
                              {answer.user.name}
                            </p>
                            <p className="text-sm text-foreground">{answer.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Input
                        value={answerTexts[q.id] ?? ""}
                        onChange={(e) =>
                          setAnswerTexts((p) => ({ ...p, [q.id]: e.target.value }))
                        }
                        placeholder="Write an answer (min 10 characters)…"
                        className="bg-background border-border text-sm"
                      />
                      <Button
                        size="icon"
                        onClick={() => handlePostAnswer(q.id)}
                        disabled={
                          (answerTexts[q.id]?.trim().length ?? 0) < 10 ||
                          postAnswer.isPending
                        }
                        className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <Link href="/compare" className="text-xs text-muted-foreground hover:text-primary transition-soft">
            Compare with other colleges →
          </Link>
        </div>
      </motion.div>
    </PublicShell>
  );
}
