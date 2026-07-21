import { useState } from 'react';
import AnalysisTab from './AnalysisTab';
import AudioPlaybackCard from './AudioPlayCard';
import CustomerInfoCard from './CustomerInfoCard';
import TranscriptionTab from './TranscriptionTab';
import SentimentTab from './SentimentTab';
import NextAction from './NextActionTab';
import { useLocation } from 'react-router-dom';

function SpeechAnalysisCard({
  data,
  transcription,
  audioUrl,
  sentiment,
  nextActions,
  preferences,
  transcriptSummary,
  propertySuggestions,
  progressStep,
  progressMessage,
  audioFile,
  awaitingApproval,
  onApprove,
  onReject,
}) {
  // Setting the default tab to "transcription" so it isn't empty on load
  const [activeTab, setActiveTab] = useState('transcription');
  const { state } = useLocation();
  const customer = state?.customer;

  const isAnalyzing = progressStep >= 1 && progressStep < 4;

  const transcriptionData = transcription
    ? { conversationId: 'live', transcription }
    : null;

  const sentimentData = sentiment || null;
  const nextActionData = nextActions ? { nextActions, propertySuggestions } : null;

  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm rounded-2xl h-full min-h-0">
      <div className="card-body p-6 h-full min-h-0">
        <div className="flex flex-col md:flex-row gap-8 h-full min-h-0">
          {/* LEFT PANEL */}
          <div className="flex flex-col gap-5 w-full md:w-100">
            <div className="flex items-start gap-4">
              <button className="w-14 h-14 shrink-0 flex items-center justify-center rounded-full bg-primary text-primary-content font-bold text-lg shadow-sm hover:bg-primary-focus transition-colors">
                {(customer?.cust_name ?? data?.customerName)?.[0]?.toUpperCase()}
              </button>
              <CustomerInfoCard
                data={data}
                customer={customer}
              />
            </div>
            <AudioPlaybackCard audioUrl={audioUrl} audioFile={audioFile} />
          </div>

          {/* RIGHT PANEL */}
          <div className="flex flex-col flex-1 min-h-0">
            {/* Tab bar */}
            <div className="border-b border-base-200 mb-4 shrink-0">
              <AnalysisTab setActiveTab={setActiveTab} activeTab={activeTab} />
            </div>

            {/* Tab content */}
            <div className="w-full min-h-0 flex-1 overflow-y-auto p-2 pb-8">
              {activeTab === 'transcription' && (
                <TranscriptionTab
                  data={transcriptionData}
                  loading={progressStep === 0 || progressStep === 1}
                  progressMessage={progressMessage}
                />
              )}
              {activeTab === 'sentiment' && (
                <SentimentTab data={sentimentData} preferences={preferences} transcriptSummary={transcriptSummary} loading={isAnalyzing} />
              )}
              {activeTab === 'next_action' && (
                <NextAction data={nextActionData} loading={isAnalyzing} />
              )}
            </div>

            {/* Approve/Reject action bar */}
            {awaitingApproval && (
              <div className="border-t border-base-200 pt-4 mt-4 shrink-0">
                <div className="flex gap-3">
                  <button className="btn btn-primary flex-1" onClick={onApprove}>
                    Approve & Continue
                  </button>
                  <button className="btn btn-outline btn-error flex-1" onClick={onReject}>
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpeechAnalysisCard;
