import React, { useState } from "react"; // 1. Imported useState
import AnalysisTab from "./speech-to-text-body-analysistab";
import AudioPlaybackCard from "./speech-to-text-body-audioplaycard";
import CustomerInfoCard from "./speech-to-text-body-customerinfocard";
import TranscriptionTab from "./speech-to-text-body-transcriptiontab";
import SentimentTab from "./speech-to-text-body-sentiment";
import NextAction from "./speech-to-text-nextactiontab";
import transcriptionData from "./TrancriptionData";
import SentimentData from "./SentimentData";
import NextActionData from "./NextActionData";

function SpeechAnalysisCard({ data }) {
  // 3. Create state to track which tab content to display
  // Options: "none" (default), "transcription", "sentiment", "next_action"
  const [activeTab, setActiveTab] = useState("none");

  return (
    <div className="grid grid-cols-12 w-full h-[740px] p-0">
      {/*audio analysis*/}
      <div className="col-span-12 flex flex-col items-start gap-6 p-6 w-full h-fit bg-white border border-[#C6C6CD] rounded-[12px]">
        <div className="flex flex-col items-start gap-2 p-0 w-full h-fit">
          <div className="flex flex-row items-center gap-0 pt-0 pb-0 pl-2 pr-0 w-full h-fit">
            <button className="w-[100px] h-[100px] flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-sm shadow-sm hover:bg-blue-700 transition-colors">
              {data.customerFirstLetter}
            </button>
          </div>

          {/* Static components that always stay visible */}
          <CustomerInfoCard data={data} />
          <AudioPlaybackCard data={data} />

          {/* 4. Pass setActiveTab as a prop to your buttons */}
          <AnalysisTab setActiveTab={setActiveTab} />

          {/* 5. Conditionally render content directly underneath the tabs */}
          <div className="w-full mt-4">
            {activeTab === "transcription" && (
              <TranscriptionTab data={transcriptionData} />
            )}

            {activeTab === "sentiment" && <SentimentTab data={SentimentData} />}

            {activeTab === "next_action" && (
              <NextAction data={NextActionData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpeechAnalysisCard;
