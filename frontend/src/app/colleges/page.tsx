import { Suspense } from "react";
import { CollegesListingPage } from "@/features/colleges/CollegesListingPage";
import { CollegesTableSkeleton } from "@/components/ui/college-skeletons";

export default function Page() {
  return (
    <Suspense fallback={<CollegesTableSkeleton count={10} />}>
      <CollegesListingPage />
    </Suspense>
  );
}
