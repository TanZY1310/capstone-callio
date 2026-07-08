import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import BodyHeader from '../components/Speech/BodyHeader';
import Preferencecard from '../components/Speech/PreferenceCard';
import SpeechAnalysisCard from '../components/Speech/SpeechAnalysisCard';
import AudioPlaybackCard from '../components/Speech/AudioPlayCard';

const API_URL = 'http://localhost:8000';

function Speech() {
  const { state } = useLocation();
  const customer = state?.customer;

  const [transcription, setTranscription] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [nextActions, setNextActions] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [progressStep, setProgressStep] = useState(-1);
  const [taskId, setTaskId] = useState(null);
  const pollingRef = useRef(null);

  // Separate from audioUrl audioFile is for audio player
  const [audioFile, setAudioFile] = useState(null);

  const [awaitingApproval, setAwaitingApproval] = useState(false);
  const [rawAudioUrl, setRawAudioUrl] = useState(null);
  const [progressMessage, setProgressMessage] = useState('');

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const startPolling = useCallback(
    (id, audioUrl) => {
      stopPolling();
      setTaskId(id);
      setProgressStep(0);

      pollingRef.current = setInterval(async () => {
        try {
          const res = await axios.get(`${API_URL}/speech/status/${id}`);
          const task = res.data;

          setProgressStep(task.step);
          setProgressMessage(task.progress_message || '');

          if (task.status === 'awaiting_approval') {
            stopPolling();
            setTranscription(task.data.transcription);
            setProgressStep(task.step);
            setAwaitingApproval(true);
          } else if (task.status === 'complete') {
            stopPolling();
            setAudioUrl(`${API_URL}${audioUrl}`);
            setTranscription(task.data.transcription);
            setSentiment(task.data.sentiment);
            setNextActions(task.data.nextActions);
            setPreferences(task.data.preferences);
            toast.success('Analysis complete');
          } else if (task.status === 'error') {
            stopPolling();
            toast.error(task.error || 'Processing failed');
          }
        } catch {
          stopPolling();
          toast.error('Failed to check processing status');
        }
      }, 1500);
    },
    [stopPolling],
  );

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  const handleUpload = (data) => {
    setAwaitingApproval(false);
    setRawAudioUrl(data.audio_url);
    setTranscription(null);
    setSentiment(null);
    setNextActions(null);
    setPreferences(null);
    setAudioUrl(null);
    setProgressMessage('');
    startPolling(data.task_id, data.audio_url);
  };

  const handleApprove = async () => {
    try {
      await axios.post(`${API_URL}/speech/approve/${taskId}`);
      setAwaitingApproval(false);
      startPolling(taskId, rawAudioUrl);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Approval failed');
    }
  };

  const resetState = () => {
    stopPolling();
    setAwaitingApproval(false);
    setRawAudioUrl(null);
    setTranscription(null);
    setSentiment(null);
    setNextActions(null);
    setPreferences(null);
    setAudioUrl(null);
    setAudioFile(null);
    setProgressStep(-1);
    setTaskId(null);
  };

  const handleReject = async () => {
    try {
      await axios.post(`${API_URL}/speech/reject/${taskId}`);
      toast.info('Transcription rejected');
    } catch {
      // ignore backend error, reset locally anyway
    }
    resetState();
  };

  const handleAddToPipeline = async () => {
    if (!taskId) return;
    try {
      await axios.post(`${API_URL}/speech/pipeline/${taskId}`, {
        customer_id: customer?.cust_id || null,
      });
      toast.success('Added to lead pipeline');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add to pipeline');
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-base-200 p-6 gap-6">
      <BodyHeader
        onUpload={handleUpload}
        customerId={customer?.cust_id}
        onFileSelect={setAudioFile}
      />

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        <div className="flex-1">
          <SpeechAnalysisCard
            data={null}
            transcription={transcription}
            audioUrl={audioUrl}
            sentiment={sentiment}
            nextActions={nextActions}
            progressStep={progressStep}
            progressMessage={progressMessage}
            onAddToPipeline={handleAddToPipeline}
            audioFile={audioFile}
            awaitingApproval={awaitingApproval}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
        <div className="w-full lg:w-96 flex">
          <div className="card bg-base-100 border border-base-200 shadow-sm rounded-2xl w-full">
            <div className="card-body p-6">
              <Preferencecard data={preferences} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Speech;
