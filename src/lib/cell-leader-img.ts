/** public/leader-img/{cellNm}.png 경로 */
export const getCellLeaderImagePath = (cellNm: string): string =>
  `/leader-img/${encodeURIComponent(cellNm.trim())}.png`;
