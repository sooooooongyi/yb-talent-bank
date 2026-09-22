import { CellLedgerEntryType, formatAmount } from "@/lib/cell-summary";
import Link from "next/link";

type CellPaletteType = {
  bg: string;
  dark: boolean;
};

type CellDetailViewProps = {
  cellNm: string;
  palette: CellPaletteType;
  totalAmount: number;
  transactionCount: number;
  ledger: CellLedgerEntryType[];
};

const formatSignedAmount = (amount: number): string => {
  const formatted = formatAmount(Math.abs(amount));
  if (amount > 0) return `+${formatted}`;
  if (amount < 0) return `-${formatted}`;
  return formatted;
};

/** 셀 상세: 카드 색 배경 + 최신순 통장 내역 */
export const CellDetailView = ({
  cellNm,
  palette,
  totalAmount,
  transactionCount,
  ledger,
}: CellDetailViewProps) => {
  const textMain = palette.dark ? "text-white" : "text-zinc-900";
  const textMuted = palette.dark ? "text-white/70" : "text-zinc-600";
  const cardBg = palette.dark ? "bg-white/15" : "bg-white/75";

  return (
    <main
      className={`mx-auto min-h-dvh w-full max-w-md px-6 pb-6 pt-8 ${textMain}`}
      style={{ backgroundColor: palette.bg }}
    >
      <Link
        href="/summary"
        aria-label="셀 목록으로 돌아가기"
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
            stroke={palette.dark ? "#ffffff" : "#000000"}
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      <header className="mt-6">
        <h1 className="mt-1 text-[1.5rem] leading-tight">{cellNm}셀</h1>
        <p className="mt-1 text-[3rem] font-bold tabular-nums leading-none">
          {formatAmount(totalAmount)}
          <span className={`ml-1 text-lg ${textMuted}`}>달란트</span>
        </p>
        <p className={`mt-2 text-sm ${textMuted}`}>{transactionCount}건 거래</p>
      </header>

      <hr
        className={`mt-4 border-0 border-t ${
          palette.dark ? "border-white/25" : "border-zinc-900/10"
        }`}
      />

      <section aria-label="거래 내역" className="mt-4">
        <h2 className={`text-sm font-semibold ${textMuted}`}>달란트 내역</h2>
        <p className={`mt-1 text-xs ${textMuted}`}>최신순 · 거래 후 잔액</p>

        {ledger.length === 0 ? (
          <p
            className={`mt-4 rounded-2xl px-4 py-10 text-center text-sm ${cardBg} ${textMuted}`}
          >
            거래 내역이 없습니다.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {ledger.map((entry, index) => (
              <li
                key={`${entry.date}-${entry.description}-${index}`}
                className={`rounded-2xl px-4 py-5 backdrop-blur-sm ${cardBg}`}
              >
                <div className="flex min-h-18 items-center justify-between gap-4">
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <p className={`text-xs tabular-nums ${textMuted}`}>
                      {entry.date || "날짜 없음"}
                    </p>
                    <p className="mt-1 font-semibold leading-snug">
                      {entry.description || entry.type || "내역"}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1">
                      {entry.type ? (
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold ${
                            entry.type === "수입"
                              ? palette.dark
                                ? "bg-emerald-400/30 text-emerald-50"
                                : "bg-emerald-100 text-emerald-800"
                              : entry.type === "지출"
                                ? palette.dark
                                  ? "bg-rose-400/30 text-rose-50"
                                  : "bg-rose-100 text-rose-800"
                                : palette.dark
                                  ? "bg-white/20 text-white/90"
                                  : "bg-zinc-200/90 text-zinc-700"
                          }`}
                        >
                          {entry.type}
                        </span>
                      ) : null}
                      {entry.issuer ? (
                        <span className={`text-xs ${textMuted}`}>
                          {entry.issuer}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end justify-center text-right">
                    <p className="text-[2.125rem] font-bold leading-none tabular-nums tracking-tight text-[#f88cae]">
                      {formatSignedAmount(entry.signedAmount)}
                    </p>
                    <p
                      className={`mt-2 text-xs leading-none tabular-nums ${textMuted}`}
                    >
                      잔액 {formatAmount(entry.balanceAfter)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};
