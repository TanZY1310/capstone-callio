function Preferencecard() {
  return (
    <div className="grid grid-cols-2 gap-6 w-full h-auto p-0">
      {/*top left*/}
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
      {/*top right*/}
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
      {/*bottom*/}
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
    </div>
  );
}

export default Preferencecard;
