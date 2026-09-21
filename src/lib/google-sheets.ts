const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const SHEET_GID = process.env.GOOGLE_SHEET_GID;

export const getTransactions = async () => {
  const url =
    `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}` +
    `/gviz/tq?gid=${SHEET_GID}&tqx=out:json`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("구글 시트 데이터를 가져오지 못했습니다.");
  }

  const text = await response.text();

  // Google Visualization API 응답에서 JSON 부분만 추출
  const jsonText = text
    .replace(/^[\s\S]*?setResponse\(/, "")
    .replace(/\);\s*$/, "");

  const result = JSON.parse(jsonText);

  // 컬럼명과 데이터 행 추출
  const rows = result.table.rows;

  // JSON 객체 배열로 변환
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
};
