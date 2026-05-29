function BodyHeader() {
  return (
    <div className="flex flex-row items-center justify-between w-full h-auto p-0 bg-transparent">
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
    </div>
  );
}

export default BodyHeader;
