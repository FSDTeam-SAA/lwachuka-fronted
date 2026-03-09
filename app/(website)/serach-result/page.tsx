import { Suspense } from "react";
import ResultsClient from "./ResultsClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="w-full bg-white">
          <div className="mx-auto container px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-600">
              Loading search results...
            </div>
          </div>
        </div>
      }
    >
      <ResultsClient />
    </Suspense>
  );
}
