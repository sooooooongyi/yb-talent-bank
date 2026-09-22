import { getTransactions } from "@/lib/google-sheets";
import {
  buildCellLedger,
  getCellPalette,
  summarizeByCell,
} from "@/lib/cell-summary";
import { CellDetailView } from "@/views/summary/CellDetailView";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type CellDetailPageProps = {
  params: Promise<{ cellNm: string }>;
};

const CellDetailPage = async ({ params }: CellDetailPageProps) => {
  const { cellNm: encodedCellNm } = await params;
  const cellNm = decodeURIComponent(encodedCellNm);

  const transactions = await getTransactions();
  const summaries = summarizeByCell(transactions);
  const summary = summaries.find((row) => row.cellNm === cellNm);

  if (!summary) {
    notFound();
  }

  const palette = getCellPalette(cellNm, summaries);
  const ledger = buildCellLedger(transactions, cellNm);

  return (
    <CellDetailView
      cellNm={cellNm}
      palette={palette}
      totalAmount={summary.totalAmount}
      transactionCount={summary.transactionCount}
      ledger={ledger}
    />
  );
};

export default CellDetailPage;
