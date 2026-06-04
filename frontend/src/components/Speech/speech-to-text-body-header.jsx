import { AudioLines } from "lucide-react";
import Header from "../Layout/Header";
import { useRef } from "react";

function BodyHeader() {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.targer.file[0];
    console.log("Selected file:", file);
  };

  return (
    <div className="flex flex-row items-center justify-between w-full">
      <div className="flex flex-col gap-1">
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
