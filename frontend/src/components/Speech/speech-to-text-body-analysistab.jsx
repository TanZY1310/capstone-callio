import React from "react";

// 1. Make sure you accept { setActiveTab } inside the function arguments here
function AnalysisTab({ setActiveTab }) {
  return (
    <div className="flex flex-row justify-start items-center w-[926.33px] h-fit gap-3 p-0 bg-transparent mt-6">
      <button
        // 2. Change 'navigate("/TranscriptionTab")' to 'setActiveTab("transcription")'
        onClick={() => setActiveTab("transcription")}
        className="flex items-center justify-center w-fit h-fit pt-0 pr-0 pb-0 pl-3 border-2 border-black bg-black shadow-md font-sans font-bold text-[14px] leading-[20px] text-white rounded-md transition-all hover:bg-neutral-800"
      >
        Transcription
      </button>

      <button
        onClick={() => setActiveTab("sentiment")}
        className="flex items-center justify-center w-fit h-fit pt-0 pr-0 pb-0 pl-3 border-2 border-black bg-black shadow-md font-sans font-bold text-[14px] leading-[20px] text-white rounded-md transition-all hover:bg-neutral-800"
      >
        Sentiment
      </button>

      <button
        onClick={() => setActiveTab("next_action")}
        className="flex flex-col justify-center items-center w-fit h-fit pt-0 pr-0 pb-0 pl-3 border-2 border-black bg-black shadow-md font-sans font-bold text-[14px] leading-[20px] text-white rounded-md transition-all hover:bg-neutral-800"
      >
        Next Action
      </button>
    </div>
  );
}

export default AnalysisTab;
