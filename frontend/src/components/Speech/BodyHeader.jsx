import { AudioLines, Target } from 'lucide-react';
import Header from '../Layout/Header';
import { useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL;

function BodyHeader({
  onUpload,
  customerId,
  onFileSelect,
  onAddToPipeline,
  taskId,
  isAnalysisComplete,
}) {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    onFileSelect?.(file);

    const formData = new FormData();
    formData.append('file', file);
    if (customerId) {
      formData.append('customer_id', customerId);
    }

    try {
      const res = await axios.post(`${API_URL}/speech/transcribe`, formData);
      onUpload?.(res.data);
      toast.success('Processing audio...');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Upload failed');
    }

    e.target.value = '';
  };

  return (
    <div className="flex flex-row items-center justify-between w-full">
      <div>
        <Header
          h1="Audio Intelligence"
          p="Analyze buyer conversation and extract automated insights"
        />
      </div>
      <div className="flex items-center gap-3">
        {taskId && (
          <button
            onClick={onAddToPipeline}
            disabled={!isAnalysisComplete}
            className={`btn gap-2 ${
              isAnalysisComplete
                ? 'btn-primary'
                : 'btn-outline border-base-content/20 text-base-content/40 cursor-not-allowed'
            }`}
          >
            <Target size={16} />
            Add to Lead Pipeline
          </button>
        )}
        <button onClick={handleUploadClick} className="btn btn-outline gap-2">
          <AudioLines />
          Upload New Audio
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="audio/*"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default BodyHeader;
