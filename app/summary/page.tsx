import { getTransactions } from "@/lib/google-sheets";
import { formatAmount, summarizeByCell } from "@/lib/cell-summary";
import { CellStackList } from "@/views/summary/CellStackList";
import Link from "next/link";

export const dynamic = "force-dynamic";

const SummaryPage = async () => {
  const transactions = await getTransactions();
  const isSheetConfigured = Boolean(
    process.env.GOOGLE_SPREADSHEET_ID && process.env.GOOGLE_SHEET_GID,
  );
  const cellSummaries = summarizeByCell(transactions);
  const grandTotal = cellSummaries.reduce(
    (sum, row) => sum + row.totalAmount,
    0,
  );

  return (
    <main className="mx-auto w-full max-w-md flex-1 bg-white px-6 pb-6 pt-8 text-zinc-900">
      <Link
        href="/"
        aria-label="진입 화면으로 이동"
        className="inline-flex items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          className="h-8 w-8"
          aria-hidden
        >
          <path
            d="M19 12H7M11 7l-5 5 5 5"
            stroke="#000000"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
      <header>
        <section aria-label="전체 합계" className="mt-6">
          <p className="text-sm text-[#f88cae] font-semibold">전체달란트</p>
          <p className="mt-1 text-[2.35rem] font-bold leading-none tabular-nums tracking-tight">
            {formatAmount(grandTotal)}
            <span className="ml-2 text-lg font-semibold text-zinc-400">
              달란트
            </span>
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            {Math.min(cellSummaries.length, 8)}개 셀 · {transactions.length}건
            거래
          </p>
        </section>
      </header>
      {!isSheetConfigured ? (
        <p className="mt-6 rounded-2xl border border-dashed border-zinc-200 px-4 py-6 text-sm text-zinc-500">
          시트 연동 환경 변수가 없습니다. 배포 환경(Vercel) Settings →
          Environment Variables에{" "}
          <span className="font-medium">GOOGLE_SPREADSHEET_ID</span>,{" "}
          <span className="font-medium">GOOGLE_SHEET_GID</span>를 추가한 뒤
          재배포해 주세요.
        </p>
      ) : null}

      <div className="mt-6">
        <CellStackList cells={cellSummaries} />
      </div>
    </main>
  );
};

export default SummaryPage;
