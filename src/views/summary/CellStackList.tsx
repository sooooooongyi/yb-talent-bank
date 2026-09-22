"use client";

import {
  CELL_CARD_COLORS,
  CellSummaryType,
  encodeCellNmForPath,
  formatAmount,
} from "@/lib/cell-summary";
import { getCellLeaderImagePath } from "@/lib/cell-leader-img";
import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

type CellLeaderAvatarProps = {
  cellNm: string;
  fallbackClassName: string;
};

/** 셀 리더 프로필 (없으면 이니셜) */
const CellLeaderAvatar = ({
  cellNm,
  fallbackClassName,
}: CellLeaderAvatarProps) => {
  const [hasError, setHasError] = useState(false);
  const src = getCellLeaderImagePath(cellNm);

  if (hasError) {
    return (
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${fallbackClassName}`}
      >
        {cellNm.slice(0, 1)}
      </span>
    );
  }

  return (
    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-white/80 ring-2 ring-white/50">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${cellNm}셀 리더`}
        className="h-full w-full object-cover"
        onError={() => setHasError(true)}
      />
    </span>
  );
};

type CellStackListProps = {
  cells: CellSummaryType[];
};

const PEEK_RATIO = 0.75;
const CARD_GAP_PX = 12;

/** 스크롤 구간에 따라 0~1 펼침 진행도 계산 */
const clampProgress = (value: number): number =>
  Math.min(1, Math.max(0, value));

/** 스크롤 시 카드 겹침(75% 노출) → 전체 노출로 전환 */
export const CellStackList = ({ cells }: CellStackListProps) => {
  const displayCells = cells.slice(0, 8);
  const stackRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [cardHeight, setCardHeight] = useState(152);
  const [progress, setProgress] = useState(0);

  const overlapHiddenPx = cardHeight * (1 - PEEK_RATIO);

  const updateProgress = useCallback(() => {
    const stackEl = stackRef.current;
    if (!stackEl || displayCells.length <= 1) {
      setProgress(1);
      return;
    }

    const stackTop = stackEl.getBoundingClientRect().top + window.scrollY;
    const unfoldDistance =
      overlapHiddenPx * (displayCells.length - 1) + window.innerHeight * 0.35;
    const scrollStart = stackTop - 96;
    const next = clampProgress((window.scrollY - scrollStart) / unfoldDistance);

    setProgress((prev) => (Math.abs(prev - next) < 0.001 ? prev : next));
  }, [displayCells.length, overlapHiddenPx]);

  useLayoutEffect(() => {
    const measure = () => {
      if (cardRef.current) {
        setCardHeight(cardRef.current.offsetHeight);
      }
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [displayCells]);

  useLayoutEffect(() => {
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, [updateProgress]);

  if (displayCells.length === 0) {
    return (
      <p className="rounded-3xl border border-dashed border-zinc-200 px-4 py-16 text-center text-sm text-zinc-400">
        표시할 셀 내역이 없습니다.
      </p>
    );
  }

  const collapsedMargin = -overlapHiddenPx;
  const expandedMargin = CARD_GAP_PX;

  return (
    <div ref={stackRef} className="relative">
      <ul className="relative flex flex-col">
        {displayCells.map((cell, index) => {
          const palette = CELL_CARD_COLORS[index % CELL_CARD_COLORS.length];
          const textMain = palette.dark ? "text-white" : "text-zinc-900";
          const textMuted = palette.dark ? "text-white/65" : "text-zinc-500";
          const iconBg = palette.dark ? "bg-white/20" : "bg-white/70";

          const marginTop =
            index === 0
              ? 0
              : collapsedMargin * (1 - progress) + expandedMargin * progress;

          return (
            <li
              key={cell.cellNm}
              className="relative"
              style={{
                zIndex: index + 1,
                marginTop,
                willChange: "margin-top",
              }}
            >
              <Link
                href={`/summary/cell/${encodeCellNmForPath(cell.cellNm)}`}
                ref={index === 0 ? cardRef : undefined}
                className={`mx-auto block h-32 rounded-[1.75rem] px-5 py-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-transform hover:scale-[1.01] active:scale-[0.99] ${textMain}`}
                style={{ backgroundColor: palette.bg }}
              >
                <div className="flex h-full items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <CellLeaderAvatar
                      cellNm={cell.cellNm}
                      fallbackClassName={`${iconBg} ${textMain}`}
                    />
                    <h3 className="truncate text-xl font-semibold leading-tight">
                      {cell.cellNm}셀
                    </h3>
                  </div>
                  <div className={`shrink-0 text-right ${textMuted}`}>
                    <p className="text-xs">{cell.transactionCount}건</p>
                    <p
                      className={`mt-6 text-4xl font-semibold tabular-nums ${textMain}`}
                    >
                      {formatAmount(cell.totalAmount)}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
