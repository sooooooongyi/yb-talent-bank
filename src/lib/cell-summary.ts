import { CellDataType } from "@/types/cell";

export type CellSummaryType = {
  cellNm: string;
  totalAmount: number;
  transactionCount: number;
};

/** type에 따라 거래 금액 부호를 정한다 (수입 +, 지출 -) */
export const toSignedAmount = (type: string, amount: number): number => {
  const value = Math.abs(amount);
  if (type === "수입") return value;
  if (type === "지출") return -value;
  return amount;
};

/** 거래 목록을 셀명(cellNm) 기준으로 합산한다 */
export const summarizeByCell = (
  transactions: CellDataType[],
): CellSummaryType[] => {
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

export const formatAmount = (amount: number): string =>
  new Intl.NumberFormat("ko-KR").format(amount);

/** 셀 카드 배경색 (최대 8개) */
export const CELL_CARD_COLORS = [
  { bg: "#ddd4f0", dark: false },
  { bg: "#f3ecc0", dark: false },
  { bg: "#8f84c9", dark: true },
  { bg: "#c8d4e4", dark: false },
  { bg: "#f8d4e8", dark: false },
  { bg: "#d4ecd4", dark: false },
  { bg: "#ffe4c4", dark: false },
  { bg: "#e0e0ff", dark: false },
] as const;

export type CellLedgerEntryType = {
  date: string;
  type: string;
  description: string;
  issuer: string;
  signedAmount: number;
  balanceAfter: number;
};

/** 시트 date 문자열을 정렬용 타임스탬프로 변환 */
export const parseTransactionDate = (date: string): number => {
  const trimmed = date.trim();
  if (!trimmed) return 0;

  const direct = Date.parse(trimmed);
  if (!Number.isNaN(direct)) return direct;

  const normalized = trimmed
    .replace(/년|월/g, "-")
    .replace(/일/g, "")
    .replace(/\./g, "-")
    .replace(/\s+/g, "");

  const retry = Date.parse(normalized);
  return Number.isNaN(retry) ? 0 : retry;
};

/** 셀별 거래를 날짜 오름차순으로 잔액을 계산한 뒤, 최신순으로 반환 */
export const buildCellLedger = (
  transactions: CellDataType[],
  cellNm: string,
): CellLedgerEntryType[] => {
  const targetNm = cellNm.trim();
  const filtered = transactions.filter(
    (tx) => (tx.cellNm.trim() || "미지정") === targetNm,
  );

  const sortedAsc = [...filtered].sort(
    (a, b) => parseTransactionDate(a.date) - parseTransactionDate(b.date),
  );

  let balance = 0;
  const chronological = sortedAsc.map((tx) => {
    const signedAmount = toSignedAmount(tx.type, tx.amount);
    balance += signedAmount;
    return {
      date: tx.date,
      type: tx.type,
      description: tx.description,
      issuer: tx.issuer,
      signedAmount,
      balanceAfter: balance,
    };
  });

  return chronological.reverse();
};

/** summary 목록 순서 기준 셀 카드 색상 */
export const getCellPalette = (
  cellNm: string,
  summaries: CellSummaryType[],
) => {
  const index = summaries.findIndex((row) => row.cellNm === cellNm);
  const colorIndex = index >= 0 ? index : 0;
  return CELL_CARD_COLORS[colorIndex % CELL_CARD_COLORS.length];
};

export const encodeCellNmForPath = (cellNm: string): string =>
  encodeURIComponent(cellNm);
