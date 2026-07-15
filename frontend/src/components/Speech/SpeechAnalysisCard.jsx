import { useState } from 'react';
import AnalysisTab from './AnalysisTab';
import AudioPlaybackCard from './AudioPlayCard';
import CustomerInfoCard from './CustomerInfoCard';
import TranscriptionTab from './TranscriptionTab';
import SentimentTab from './SentimentTab';
import NextAction from './NextActionTab';
import ProgressBar from './ProgressBar';
import { useLocation } from 'react-router-dom';

function SpeechAnalysisCard({
  data,
  transcription,
  audioUrl,
  sentiment,
  nextActions,
  propertySuggestions,
  progressStep,
  progressMessage,
  onAddToPipeline,
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
    <div className="card bg-base-100 border border-base-200 shadow-sm rounded-2xl">
      <div className="card-body p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT PANEL */}
          <div className="flex flex-col gap-4 w-full md:w-100">
            <div className="flex items-start gap-4">
              <button className="w-14 h-14 shrink-0 flex items-center justify-center rounded-full bg-primary text-primary-content font-bold text-lg shadow-sm hover:bg-primary-focus transition-colors">
                {(customer?.cust_name ?? data?.customerName)?.[0]?.toUpperCase()}
              </button>
              <CustomerInfoCard
                data={data}
                customer={customer}
                onAddToPipeline={onAddToPipeline}
              />
            </div>
            <AudioPlaybackCard audioUrl={audioUrl} audioFile={audioFile} />
            <ProgressBar step={progressStep} awaitingApproval={awaitingApproval} />
            {awaitingApproval && (
              <div className="flex gap-2 w-full">
                <button className="btn btn-primary flex-1" onClick={onApprove}>
                  Approve & Continue
                </button>
                <button className="btn btn-outline btn-error flex-1" onClick={onReject}>
                  Reject
                </button>
              </div>
            )}
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
                <TranscriptionTab
                  data={transcriptionData}
                  loading={progressStep === 0 || progressStep === 1}
                  progressMessage={progressMessage}
                />
              )}
              {activeTab === 'sentiment' && (
                <SentimentTab data={sentimentData} loading={isAnalyzing} />
              )}
              {activeTab === 'next_action' && (
                <NextAction data={nextActionData} loading={isAnalyzing} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpeechAnalysisCard;
