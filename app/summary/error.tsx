"use client";

type SummaryErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** summary 라우트 서버 렌더 오류 */
const SummaryErrorPage = ({ error, reset }: SummaryErrorPageProps) => {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-10 text-zinc-900">
      <h1 className="text-xl font-bold">현황을 불러오지 못했습니다</h1>
      <p className="mt-3 text-sm text-zinc-500">
        잠시 후 다시 시도해 주세요. Vercel에{" "}
        <code className="rounded bg-zinc-100 px-1">GOOGLE_SPREADSHEET_ID</code>,{" "}
        <code className="rounded bg-zinc-100 px-1">GOOGLE_SHEET_GID</code> 환경
        변수가 설정되어 있는지도 확인해 주세요.
      </p>
      {error.digest ? (
        <p className="mt-2 text-xs text-zinc-400">digest: {error.digest}</p>
      ) : null}
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex w-fit rounded-full bg-[#f88cae] px-5 py-2.5 text-sm font-semibold text-black"
      >
        다시 시도
      </button>
    </main>
  );
};

export default SummaryErrorPage;
