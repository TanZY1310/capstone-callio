import { AudioLines } from "lucide-react";
import Header from "../Layout/Header";
function BodyHeader() {
  return (
    <div className="flex flex-row items-center justify-between w-full">
      <div className="flex flex-col gap-1">
        <Header h1="Audio Intelligence" p="Analyze buyer conversation and extract automated insights"/>
      </div>
      <button className="btn btn-neutral gap-2">
        <AudioLines />
        Upload New Audio
      </button>
    </div>
  );
}

export default BodyHeader;
