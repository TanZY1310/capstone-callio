import { useState } from 'react';
import AnalysisTab from './AnalysisTab';
import AudioPlaybackCard from './AudioPlayCard';
import CustomerInfoCard from './CustomerInfoCard';
import TranscriptionTab from './TranscriptionTab';
import SentimentTab from './SentimentTab';
import NextAction from './NextActionTab';
import transcriptionData from './TrancriptionData';
import SentimentData from './SentimentData';
import NextActionData from './NextActionData';
import ProgressBar from './ProgressBar';
import { useLocation } from 'react-router-dom';

function SpeechAnalysisCard({ data, audioFile }) {
  // Setting the default tab to "transcription" so it isn't empty on load
  const [activeTab, setActiveTab] = useState('transcription');
  const { state } = useLocation();
  const customer = state?.customer;

  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm rounded-2xl">
      <div className="card-body p-6">
        <div className="flex flex-col md:flex-row gap-60">
          {/* LEFT PANEL */}
          <div className="flex flex-col gap-4 w-full md:w-130">
            <button className="w-14 h-14 flex items-center justify-center rounded-full bg-primary text-primary-content font-bold text-lg shadow-sm hover:bg-primary-focus transition-colors">
              {data.customerFirstLetter}
            </button>
            <CustomerInfoCard data={data} customer={customer} />
            <AudioPlaybackCard audioFile={audioFile} />
            <ProgressBar />
          </div>

          {/* RIGHT PANEL */}
          <div className="flex flex-col flex-1">
            {/* Tab bar */}
            <div className="border-b border-base-200 mb-4">
              <AnalysisTab setActiveTab={setActiveTab} activeTab={activeTab} />
            </div>

            {/* Tab content */}
            <div className="w-full">
              {activeTab === 'transcription' && (
                <TranscriptionTab data={transcriptionData} />
              )}
              {activeTab === 'sentiment' && (
                <SentimentTab data={SentimentData} />
              )}
              {activeTab === 'next_action' && (
                <NextAction data={NextActionData} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpeechAnalysisCard;
