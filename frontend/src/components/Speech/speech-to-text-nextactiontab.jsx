function NextAction({ data }) {
  return (
    <div className="flex flex-col w-full h-auto gap-8 p-8 bg-white border border-[#C6C6CD] rounded-[12px]">
      {/* Header */}
      <div className="flex flex-col items-start gap-1">
        <span className="font-['Hanken_Grotesk'] font-bold text-[24px] leading-[32px] text-[#191C1E]">
          Next Actions
        </span>

        <span className="font-['Hanken_Grotesk'] text-[14px] text-[#6B7280]">
          AI-generated follow-up recommendations based on buyer conversation
        </span>
      </div>

      {/* Action Cards */}
      <div className="flex flex-col gap-4 w-full">
        {data?.nextActions?.map((action, index) => (
          <div
            key={index}
            className="flex flex-row items-start gap-4 p-5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl hover:shadow-sm transition-all duration-200"
          >
            {/* Number Indicator */}
            <div className="flex items-center justify-center min-w-[36px] h-[36px] rounded-full bg-[#191C1E] text-white font-bold text-[14px]">
              {index + 1}
            </div>

            {/* Action Content */}
            <div className="flex flex-col gap-1">
              <span className="font-['Hanken_Grotesk'] font-bold text-[15px] text-[#191C1E]">
                Recommended Action
              </span>

              <span className="font-['Hanken_Grotesk'] text-[14px] leading-[24px] text-[#4B5563]">
                {action}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Footer Recommendation */}
      <div className="flex flex-col gap-3 p-5 bg-[#191C1E] rounded-xl">
        <span className="font-bold text-[14px] text-white">
          🤖 AI Workflow Suggestion
        </span>

        <span className="text-[14px] text-[#E5E7EB] leading-[24px]">
          Complete all recommended follow-up actions within the next 24 hours to
          maximize conversion probability and maintain buyer engagement.
        </span>
      </div>
    </div>
  );
}

export default NextAction;
