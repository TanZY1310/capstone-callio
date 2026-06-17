import { AudioLines } from 'lucide-react';
import Header from '../Layout/Header';
import { useRef } from 'react';

/**
 * BodyHeader
 * @param {Object}   props
 * @param {Function} props.onFileSelect  – called with the selected File object
 */
function BodyHeader({ onFileSelect }) {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onFileSelect?.(file);
    // Reset the input so the same file can be re-selected if needed
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
      <button onClick={handleUploadClick} className="btn btn-neutral gap-2">
        <AudioLines />
        Upload New Audio
      </button>

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