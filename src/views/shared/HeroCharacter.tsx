type HeroCharacterProps = {
  /** 홈 하단처럼 색을 아래로 이어 붙일지 */
  withBottomFill?: boolean;
};

/** 핑크 반원 + 눈 히어로 캐릭터 */
export const HeroCharacter = ({
  withBottomFill = true,
}: HeroCharacterProps) => {
  return (
    <div className="relative w-full">
      <div className="relative aspect-2/1 w-full rounded-t-[999px] bg-[#f88cae]">
        <div className="absolute left-1/2 top-[14%] flex -translate-x-1/2 gap-[clamp(2.25rem,11vw,3.75rem)]">
          <span className="relative h-[clamp(4rem,14vw,5.5rem)] w-[clamp(3rem,10vw,4.25rem)] rounded-[999px] bg-white">
            <span className="absolute left-[52%] top-[36%] h-[clamp(2.1rem,8.5vw,3.1rem)] w-[clamp(2.1rem,8.5vw,3.1rem)] -translate-x-1/2 rounded-full bg-black" />
          </span>
          <span className="relative h-[clamp(4rem,14vw,5.5rem)] w-[clamp(3rem,10vw,4.25rem)] rounded-[999px] bg-white">
            <span className="absolute left-[48%] top-[36%] h-[clamp(2.1rem,8.5vw,3.1rem)] w-[clamp(2.1rem,8.5vw,3.1rem)] -translate-x-1/2 rounded-full bg-black" />
          </span>
        </div>
      </div>
      {withBottomFill ? (
        <div className="h-24 w-full bg-[#f88cae]" aria-hidden />
      ) : null}
    </div>
  );
};
