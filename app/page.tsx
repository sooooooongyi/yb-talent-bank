import { getTransactions } from "@/lib/google-sheets";
import { CellDataType } from "@/types/cell";

type CellSummaryType = {
  cellNm: string;
  totalAmount: number;
  transactionCount: number;
};

/** type에 따라 거래 금액 부호를 정한다 (수입 +, 지출 -) */
const toSignedAmount = (type: string, amount: number): number => {
  const value = Math.abs(amount);
  if (type === "수입") return value;
  if (type === "지출") return -value;
  return amount;
};

/** 거래 목록을 셀명(cellNm) 기준으로 합산한다 */
const summarizeByCell = (transactions: CellDataType[]): CellSummaryType[] => {
  const map = new Map<
    string,
    { totalAmount: number; transactionCount: number }
  >();

  for (const tx of transactions) {
    const cellNm = tx.cellNm.trim() || "미지정";
    const current = map.get(cellNm) ?? { totalAmount: 0, transactionCount: 0 };
    map.set(cellNm, {
      totalAmount: current.totalAmount + toSignedAmount(tx.type, tx.amount),
      transactionCount: current.transactionCount + 1,
    });
  }

  return Array.from(map.entries())
    .map(([cellNm, { totalAmount, transactionCount }]) => ({
      cellNm,
      totalAmount,
      transactionCount,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);
};

const formatAmount = (amount: number): string =>
  new Intl.NumberFormat("ko-KR").format(amount);

const HomePage = async () => {
  const transactions = await getTransactions();
  const cellSummaries = summarizeByCell(transactions);
  const grandTotal = cellSummaries.reduce(
    (sum, row) => sum + row.totalAmount,
    0,
  );

  console.log(transactions);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
      <header className="space-y-2">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          YB Talent Bank
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          셀별 달란트 현황
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          셀 이름 기준으로 거래 금액을 합산했습니다.
        </p>
      </header>

      <section
        aria-label="전체 합계"
        className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/60"
      >
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          전체 합계
        </p>
        <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl">
          {formatAmount(grandTotal)}
          <span className="ml-2 text-lg font-normal text-zinc-500 dark:text-zinc-400">
            달란트
          </span>
        </p>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {cellSummaries.length}개 셀 · {transactions.length}건 거래
        </p>
      </section>

      {cellSummaries.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 px-4 py-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          표시할 거래 내역이 없습니다.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {cellSummaries.map((row) => {
            const share =
              grandTotal !== 0
                ? Math.round((row.totalAmount / grandTotal) * 100)
                : 0;

            return (
              <li
                key={row.cellNm}
                className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold leading-snug">
                    {row.cellNm}
                  </h2>
                  <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {row.transactionCount}건
                  </span>
                </div>
                <p className="mt-4 text-2xl font-semibold tabular-nums">
                  {formatAmount(row.totalAmount)}
                  <span className="ml-1 text-base font-normal text-zinc-500 dark:text-zinc-400">
                    달란트
                  </span>
                </p>
                <div className="mt-4">
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-zinc-900 dark:bg-zinc-100"
                      style={{ width: `${Math.min(100, Math.max(0, share))}%` }}
                      role="presentation"
                    />
                  </div>
                  <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    전체 대비 {share}%
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
};

export default HomePage;
