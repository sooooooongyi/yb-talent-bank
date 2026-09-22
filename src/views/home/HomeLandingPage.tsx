"use client";

import Link from "next/link";
import { HeroCharacter } from "@/views/shared/HeroCharacter";

/** 진입 화면: 레퍼런스와 동일한 풀스크린 구성 */
export const LandingPage = () => {
  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-x-hidden bg-[#ffffff] text-[#333333]">
      <div className="px-8 pt-[clamp(3.5rem,12vw,5.5rem)]">
        <h1 className="max-w-[16rem] text-[clamp(2.5rem,9.5vw,3.35rem)] font-bold leading-[1.02] tracking-[-0.03em]">
          2026
          <br />
          YB Youth
          <br />
          Talent
          <br />
          Bank
        </h1>
      </div>

      <div className="mt-10 px-8">
        <Link
          href="/summary"
          aria-label="셀별 달란트 현황으로 이동"
          className="inline-flex h-15 w-15 items-center justify-center rounded-full bg-[#f88cae] text-[1.35rem] leading-none text-black transition-transform hover:scale-105 active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className="h-12 w-12"
            aria-hidden
          >
            <path
              d="M5 12h12M13 7l5 5-5 5"
              stroke="#000000"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      <div className="relative mt-auto min-h-[min(52vh,28rem)] w-full shrink-0 overflow-visible pb-8">
        <div className="hero-head-bounce absolute -bottom-10 left-1/2 w-[155%] max-w-xl">
          <HeroCharacter />
        </div>
      </div>
    </div>
  );
};
