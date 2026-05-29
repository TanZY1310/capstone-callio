function SentimentTab({ data }) {
  return (
    <div className="flex flex-col w-full h-auto gap-8 p-8 bg-white border border-[#C6C6CD] rounded-[12px]">
      {/* Header */}
      <div className="flex flex-col items-start gap-1">
        <span className="font-['Hanken_Grotesk'] font-bold text-[24px] leading-[32px] text-[#191C1E]">
          Sentiment Analysis
        </span>

        <span className="font-['Hanken_Grotesk'] text-[14px] text-[#6B7280]">
          AI-generated emotional and intent insights from the conversation
        </span>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-3 gap-4 w-full">
        <div className="flex flex-col gap-2 p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl">
          <span className="text-[12px] font-bold text-[#6B7280]">
            😊 Overall Sentiment
          </span>
          <span className="text-[20px] font-bold text-[#191C1E]">
            {data.overallSentiment}
          </span>
        </div>

        <div className="flex flex-col gap-2 p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl">
          <span className="text-[12px] font-bold text-[#6B7280]">
            🎯 Intent Score
          </span>
          <span className="text-[20px] font-bold text-[#191C1E]">
            {data.intentScore}%
          </span>
        </div>

        <div className="flex flex-col gap-2 p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl">
          <span className="text-[12px] font-bold text-[#6B7280]">
            ⚡ Urgency Level
          </span>
          <span className="text-[20px] font-bold text-[#191C1E]">
            {data.urgency}
          </span>
        </div>
      </div>

      {/* Emotional Signals */}
      <div className="flex flex-col gap-4">
        <span className="font-bold text-[14px] text-[#191C1E]">
          Emotional Signals
        </span>

        <div className="flex flex-wrap gap-3">
          {data?.emotions?.map((emotion, index) => (
            <div key={index} className="px-4 py-2 bg-[#D5E3FD] rounded-full">
              <span className="text-[12px] font-bold text-[#45464D]">
                {emotion}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Objections */}
      <div className="flex flex-col gap-4">
        <span className="font-bold text-[14px] text-[#191C1E]">
          Buyer Concerns / Objections
        </span>

        <div className="flex flex-col gap-3">
          {data?.objections?.map((objection, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-[#FFF7ED] border border-[#FED7AA] rounded-xl"
            >
              <span>⚠️</span>
              <span className="text-[14px] text-[#7C2D12]">{objection}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interest Tags */}
      <div className="flex flex-col gap-4">
        <span className="font-bold text-[14px] text-[#191C1E]">
          Interest Tags
        </span>

        <div className="flex flex-wrap gap-3">
          {data?.interestTags?.map((tag, index) => (
            <div key={index} className="px-4 py-2 bg-[#ECFCCB] rounded-full">
              <span className="text-[12px] font-bold text-[#365314]">
                {tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Action */}
      {/* <div className="flex flex-col gap-3 p-5 bg-[#191C1E] rounded-xl">
        <span className="font-bold text-[14px] text-white">
          🤖 AI Recommended Action
        </span>

        <span className="text-[14px] text-[#E5E7EB] leading-[24px]">
          {data?.recommendedAction}
        </span>
      </div> */}
    </div>
  );
}

export default SentimentTab;
