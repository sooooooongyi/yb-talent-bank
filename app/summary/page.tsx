import { getTransactions } from "@/lib/google-sheets";
import { formatAmount, summarizeByCell } from "@/lib/cell-summary";
import { CellStackList } from "@/views/summary/CellStackList";
import Link from "next/link";

const SummaryPage = async () => {
  const transactions = await getTransactions();
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
      <div className="mt-6">
        <CellStackList cells={cellSummaries} />
      </div>
    </main>
  );
};

export default SummaryPage;
