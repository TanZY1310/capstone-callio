function TranscriptionTab({ data }) {
  return (
    <div className="flex flex-col w-full h-auto gap-6 p-8 bg-white border border-[#C6C6CD] rounded-[12px]">
      {/* Header */}
      <div className="flex flex-col items-start gap-1">
        <span className="font-['Hanken_Grotesk'] font-bold text-[24px] leading-[32px] text-[#191C1E]">
          Call Transcription
        </span>

        <span className="font-['Hanken_Grotesk'] text-[14px] text-[#6B7280]">
          AI-processed conversation between agent and buyer
        </span>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-4 w-full">
        {data?.transcription?.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col gap-1 max-w-[70%] ${
              item.speaker === "agent"
                ? "items-start self-start"
                : "items-end self-end"
            }`}
          >
            {/* Speaker Label */}
            <span className="text-[12px] font-bold text-[#6B7280] capitalize">
              {item.speaker}
            </span>

            {/* Message Bubble */}
            <div
              className={`px-4 py-3 rounded-xl text-[14px] leading-[22px] ${
                item.speaker === "agent"
                  ? "bg-[#F1F5F9] text-[#191C1E]"
                  : "bg-[#191C1E] text-white"
              }`}
            >
              {item.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TranscriptionTab;
