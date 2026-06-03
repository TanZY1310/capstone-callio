import { useState } from "react";
import AnalysisTab from "./speech-to-text-body-analysistab";
import AudioPlaybackCard from "./speech-to-text-body-audioplaycard";
import CustomerInfoCard from "./speech-to-text-body-customerinfocard";
import TranscriptionTab from "./speech-to-text-body-transcriptiontab";
import SentimentTab from "./speech-to-text-body-sentiment";
import NextAction from "./speech-to-text-nextactiontab";
import transcriptionData from "./TrancriptionData";
import SentimentData from "./SentimentData";
import NextActionData from "./NextActionData";
import ProgressBar from "./speech-to-text-body-progressbar";
import { useLocation } from "react-router-dom";

function SpeechAnalysisCard({ data }) {
  // Setting the default tab to "transcription" so it isn't empty on load
  const [activeTab, setActiveTab] = useState("transcription");
  const { state } = useLocation();
  const customer = state?.customer;

  return (
    <div className="w-full p-0">
      {/* Main Container Card */}
      <div className="flex flex-col md:flex-row items-start gap-8 p-6 w-full h-fit bg-base-100 border border-base-200 rounded-xl shadow-sm">
        {/* LEFT PANEL: Profile & Audio Controls (Fixed Width Column) */}
        <div className="flex flex-col items-start gap-4 w-full md:w-[340px] shrink-0">
          <div className="flex flex-row items-center pt-0 pb-0 pl-2 pr-0 w-full h-fit">
            <button className="w-16 h-16 flex items-center justify-center rounded-full bg-primary text-primary-content font-semibold text-lg shadow-sm hover:bg-primary-focus transition-colors">
              {data.customerFirstLetter}
            </button>
          </div>

          <CustomerInfoCard data={data} customer={customer}/>

          {/* Note: Ensure AudioPlaybackCard width inside its component is either w-full or matches this container's narrow width */}
          <AudioPlaybackCard data={data} />

          <ProgressBar />
        </div>

        {/* RIGHT PANEL: Tabs & Transcripts (Dynamically scales to fill remaining space) */}
        <div className="flex flex-col flex-1 w-full  pt-2">
          {/* Tabs header wrapper */}
          <div className="w-full border-b border-base-200  flex justify-end">
            <AnalysisTab setActiveTab={setActiveTab} />
          </div>

          {/* Dynamic Tab Panel Content */}
          <div className="w-full mt-4 ">
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
