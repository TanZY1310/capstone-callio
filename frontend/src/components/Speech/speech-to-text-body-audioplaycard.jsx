import AnalysisTab from "./speech-to-text-body-analysistab";

function AudioPlaybackCard() {
  return (
    <div className="flex flex-col items-start justify-center p-4 w-[926.33px] h-[72px] gap-0 rounded-lg bg-[#F2F4F6]">
      <div className="flex flex-row items-center justify-start gap-4 w-full max-w-[894.33px] h-10">
        <button className="flex flex-row items-center justify-center w-10 h-10 gap-0 rounded-full bg-[#000000] text-[#FFFFFF]">
          ▶️
        </button>
        <div className="flex flex-col items-start justify-center gap-1 w-full max-w-[796.33px] h-[26px]">
          <div className="w-full h-[6px] rounded-full bg-[#E0E3E5] opacity-100 overflow-hidden"></div>
          <div className="flex flex-row justify-between items-start w-full h-fit p-0 bg-transparent">
            <div className="flex flex-col justify-start items-start w-fit h-full gap-0 p-0 bg-transparent">
              <span className="font-mono font-medium text-[12px] leading-[16px] tracking-normal text-left text-[#45464D] w-fit h-fit">
                {/*  current time */}12:00
              </span>
            </div>
            <div className="flex flex-col justify-start items-start w-fit h-full gap-0 p-0 bg-transparent">
              <span className="font-mono font-medium text-[12px] leading-[16px] tracking-normal text-left text-[#45464D] w-fit h-fit">
                {/*  current time */}24:00
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-1 w-[26px] h-[25.5px] gap-0">
          <button>🔊</button>
        </div>
      </div>
    </div>
  );
}

export default AudioPlaybackCard;
