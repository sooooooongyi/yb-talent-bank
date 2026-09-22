import { CellDataType } from "@/types/cell";

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const SHEET_GID = process.env.GOOGLE_SHEET_GID;

/** 구글 시트 Visualization API에서 거래 목록 조회 (실패 시 빈 배열) */
export const getTransactions = async (): Promise<CellDataType[]> => {
  if (!SPREADSHEET_ID || !SHEET_GID) {
    console.error(
      "[getTransactions] GOOGLE_SPREADSHEET_ID 또는 GOOGLE_SHEET_GID가 설정되지 않았습니다.",
    );
    return [];
  }

  const url =
    `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}` +
    `/gviz/tq?gid=${SHEET_GID}&tqx=out:json`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `[getTransactions] HTTP ${response.status}: 구글 시트 응답 실패`,
      );
      return [];
    }

    const text = await response.text();

    const jsonText = text
      .replace(/^[\s\S]*?setResponse\(/, "")
      .replace(/\);\s*$/, "");

    const result = JSON.parse(jsonText) as {
      table?: { rows?: unknown[] };
    };

    const rows = result.table?.rows;
    if (!Array.isArray(rows)) {
      console.error("[getTransactions] 시트 rows 형식이 올바르지 않습니다.");
      return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rows.map((row: any) => {
      const cells = row.c ?? [];

      return {
        cellNm: cells[0]?.v ?? "",
        type: cells[1]?.v ?? "",
        date: cells[2]?.f ?? cells[2]?.v ?? "",
        amount: Number(cells[3]?.v ?? 0),
        description: cells[4]?.v ?? "",
        issuer: cells[5]?.v ?? "",
      };
    });
  } catch (error) {
    const digest =
      error instanceof Error
        ? (error as Error & { digest?: string }).digest
        : undefined;

    if (digest === "DYNAMIC_SERVER_USAGE") {
      throw error;
    }

    console.error("[getTransactions] 데이터 파싱 또는 fetch 실패:", error);
    return [];
  }
};
