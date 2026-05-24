import AnalysisTab from "./speech-to-text-body-analysistab";
import BodyHeader from "./speech-to-text-body-header";
import Preferencecard from "./speech-to-text-body-preferencecard";
import SpeechAnalysisCard from "./speech-to-text-body-speechanalysiscard";

function Body() {
  return (
    <div className="flex flex-col w-full h-auto p-6 gap-10 items-start justify-start bg-transparent">
      <BodyHeader />
      <Preferencecard />
      <SpeechAnalysisCard />
      {/* <div className="flex flex-row items-center justify-between w-full h-auto p-0 bg-transparent">
        <div className="flex flex-col items-start justify-start w-auto h-auto p-0 gap-0 bg-transparent">
          <div className="flex flex-col items-start justify-start w-full h-auto p-0 gap-0 bg-transparent">
            <span className="font-['Hanken_Grotesk'] font-bold text-[36px] leading-[44px] tracking-[-0.72px] text-[#191C1E] inline-block h-auto w-auto">
              Audio Intelligence
            </span>
          </div>
          <div className="flex flex-col items-start justify-start w-full h-auto p-0 gap-0 bg-transparent">
            <span className="font-['Hanken_Grotesk'] font-normal text-[16px] leading-[24px] tracking-normal text-[#45464D] inline-block w-auto h-auto">
              Analyze buyer conversation and extract automated insights
            </span>
          </div>
        </div>
        <div className="flex flex-row items-center justify-start w-auto h-[56px] px-6 py-4 gap-[8px] bg-black rounded-lg shadow-md">
          <button className="font-['Hanken_Grotesk'] font-normal text-[16px] leading-[24px] tracking-normal text-white text-center w-fit h-fit">
            ၊၊||၊ Upload New Audio
          </button>
        </div>
      </div> */}
      {/*second row*/}
      {/* <div className="grid grid-cols-2 gap-6 w-full h-auto p-0">
        //topleft
        <div className="flex flex-col items-start gap-1 p-4 w-full h-fit bg-white border border-[#C6C6CD] rounded-[12px]">
          <div className="flex flex-row items-center gap-2 w-full h-fit p-0">
            <span className="font-['Hanken_Grotesk'] font-bold text-[12px] leading-[16px] tracking-[0.6px] text-[#45464D] w-fit h-fit">
              💵 Extracted Budget
            </span>
          </div>
          <div className="flex flex-col items-start gap-0 pt-0 pb-3 px-0 w-full h-fit">
            <span className="font-['Hanken_Grotesk'] font-bold text-[20px] leading-[16px] tracking-[0.6px] text-[#191C1E]">
              Return Budget Value
            </span>
          </div>
          <div className="flex flex-col items-start gap-0 p-0 w-full h-fit">
            <span className="font-['Hanken_Grotesk'] font-italic text-[12px] leading-[16px] tracking-[0.6px] text-[#191C1E]">
              Flexible limit mentioned
            </span>
          </div>
        </div>
        //top right
        <div className="flex flex-col items-end gap-1 p-4 w-full h-fit bg-white border border-[#C6C6CD] rounded-[12px]">
          <div className="flex flex-row items-center gap-2 w-full h-fit p-0">
            <span className="font-['Hanken_Grotesk'] font-bold text-[12px] leading-[16px] tracking-[0.6px] text-[#45464D] w-fit h-fit">
              🏠Preferences
            </span>
          </div>
          <div className="flex flex-col items-start gap-0 pt-0 pb-3 px-0 w-full h-fit">
            <span className="font-['Hanken_Grotesk'] font-bold text-[20px] leading-[16px] tracking-[0.6px] text-[#191C1E]">
              Return property rooms desired
            </span>
          </div>
          <div className="flex flex-col items-start gap-0 p-0 w-full h-fit">
            <span className="font-['Hanken_Grotesk'] font-italic text-[12px] leading-[16px] tracking-[0.6px] text-[#191C1E]">
              Return specific Requirement
            </span>
          </div>
        </div>
        //bottom
        <div className="col-span-2 flex flex-col items-start gap-4 p-4 w-full h-fit bg-white border border-[#C6C6CD] rounded-[12px]">
          <div className="flex flex-row items-center gap-2 w-full h-fit p-0">
            <span className="font-['Hanken_Grotesk'] font-bold text-[12px] leading-[16px] tracking-[0.6px] text-[#45464D] w-fit h-fit">
              ❗ High Urgency Signal
            </span>
          </div>
          <div className="flex flex-row items-center gap-2 w-full h-fit p-0">
            <div className="flex flex-col items-start gap-0 py-1 px-4 w-fit h-[26px] bg-[#D5E3FD] rounded-full">
              <span className="font-['Hanken_Grotesk'] font-bold text-[12px] leading-[16px] tracking-[0.6px] text-[#45464D] w-fit h-fit">
                Return Signal 1
              </span>
            </div>
            <div className="flex flex-col items-start gap-0 py-1 px-4 w-fit h-[26px] bg-[#D5E3FD] rounded-full">
              <span className="font-['Hanken_Grotesk'] font-bold text-[12px] leading-[16px] tracking-[0.6px] text-[#45464D] w-fit h-fit">
                Return Signal 2
              </span>
            </div>
            <div className="flex flex-col items-start gap-0 py-1 px-4 w-fit h-[26px] bg-[#D5E3FD] rounded-full">
              <span className="font-['Hanken_Grotesk'] font-bold text-[12px] leading-[16px] tracking-[0.6px] text-[#45464D] w-fit h-fit">
                Return Signal 3
              </span>
            </div>
          </div>
        </div>
      </div> */}
      {/*third row*/}
      {/* <div className="grid grid-cols-12 gap-6 w-full h-[740px] p-0">
        {// customer info
        <div className="col-span-12 flex flex-col items-start gap-6 p-6 w-full h-fit bg-white border border-[#C6C6CD] rounded-[12px]">
          <div className="flex flex-col items-start gap-2 p-0 w-full h-fit">
            <div className="flex flex-row items-center gap-0 pt-0 pb-0 pl-2 pr-0 w-full h-fit">
              <button className="w-[100px] h-[100px] flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-sm shadow-sm hover:bg-blue-700 transition-colors">
                D
              </button>
              <div className="flex flex-col items-start gap-3 p-2 w-full h-fit">
                <div className="flex flex-col items-start  p-4 w-full h-fit bg-white mb-1">
                  <span className="font-['Hanken_Grotesk'] font-bold text-[24px] leading-[16px] tracking-[0.6px] text-[#45464D] w-fit h-fit">
                    Return Customer name{" "}
                  </span>
                </div>
                <div className="flex flex-col items-start p-4 w-full h-fit bg-whiite">
                  <span className="font-['Hanken_Grotesk'] font-regular text-[12px] leading-[16px] tracking-[0.6px] text-[#45464D] w-fit h-fit">
                    12/05/19997 4.03AM Return conversation date
                  </span>
                </div>
                <div className="flex flex-row items-start justify-start gap-2 w-fit h-fit bg-[#000000] text-[#FFFFFF] rounded-lg">
                  <button className="flex flex-col items-center justify-center pl-4 pr-[11.5px] pt-4 pb-[12.5px] w-fit h-fit rounded-lg bg-[#000000] font-['Hanken_Grotesk'] text-[13px] font-bold leading-[18px] text-[#FFFFFF] rounded-lg">
                    Add to Pipeline
                  </button>
                </div>
              </div>
              //audioplaybackcard
              <div className="flex flex-col items-start justify-center p-4 w-[926.33px] h-[72px] gap-0 rounded-lg bg-[#F2F4F6]">
                <div className="flex flex-row items-center justify-start gap-4 w-full max-w-[894.33px] h-10">
                  <button className="flex flex-row items-center justify-center w-10 h-10 gap-0 rounded-full bg-[#000000] text-[#FFFFFF]">
                    ▶️
                  </button>
                  <div className="flex flex-col items-start justify-center gap-1 w-full max-w-[796.33px] h-[26px]">
                    <div className="w-full h-[6px] rounded-full bg-[#E0E3E5] opacity-100 overflow-hidden"></div>
                    <div className="flex flex-row justify-between items-start w-full h-fit p-0 bg-transparent">
                      <div className="flex flex-col justify-start items-start w-fit h-full gap-0 p-0 bg-transparent">
                        <span class="font-mono font-medium text-[12px] leading-[16px] tracking-normal text-left text-[#45464D] w-fit h-fit">
                          12:00
                        </span>
                      </div>
                      <div className="flex flex-col justify-start items-start w-fit h-full gap-0 p-0 bg-transparent">
                        <span class="font-mono font-medium text-[12px] leading-[16px] tracking-normal text-left text-[#45464D] w-fit h-fit">
                          24:00
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-1 w-[26px] h-[25.5px] gap-0">
                    <button>🔊</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default Body;
