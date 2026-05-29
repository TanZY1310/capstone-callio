import AudioPlaybackCard from "./speech-to-text-body-audioplaycard";

function CustomerInfoCard({ data }) {
  return (
    <div className="flex flex-col items-start gap-3 p-2 w-full h-fit">
      <div className="flex flex-col items-start  p-4 w-full h-fit bg-white mb-1">
        <span className="font-['Hanken_Grotesk'] font-bold text-[24px] leading-[16px] tracking-[0.6px] text-[#45464D] w-fit h-fit">
          {data.customerName}
        </span>
      </div>
      <div className="flex flex-col items-start p-4 w-full h-fit bg-whiite">
        <span className="font-['Hanken_Grotesk'] font-regular text-[12px] leading-[16px] tracking-[0.6px] text-[#45464D] w-fit h-fit">
          {data.customerCoversationDateTime}
        </span>
      </div>
      <div className="flex flex-row items-start justify-start gap-2 w-fit h-fit bg-[#000000] text-[#FFFFFF] rounded-lg">
        <button className="flex flex-col items-center justify-center pl-4 pr-[11.5px] pt-4 pb-[12.5px] w-fit h-fit rounded-lg bg-[#000000] font-['Hanken_Grotesk'] text-[13px] font-bold leading-[18px] text-[#FFFFFF] rounded-lg">
          Add to Lead Pipeline
        </button>
      </div>
    </div>
  );
}

export default CustomerInfoCard;
