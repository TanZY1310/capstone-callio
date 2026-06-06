import { CircleCheck } from 'lucide-react';
function ProgressBar() {
  return (
    <ul className="timeline mt-10 w-full">
      <li>
        <div className="timeline-start timeline-box">Uploading</div>
        <div className="timeline-middle">
          <CircleCheck className="text-primary" />
        </div>
        <hr className="bg-primary" />
      </li>
      <li>
        <hr className="bg-primary" />
        <div className="timeline-middle">
          <CircleCheck className="text-primary" />
        </div>
        <div className="timeline-end timeline-box">AI extraction</div>
        <hr className="bg-primary" />
      </li>
      <li>
        <hr className="bg-primary" />
        <div className="timeline-start timeline-box">Transcription</div>
        <div className="timeline-middle">
          <CircleCheck className="text-primary" />
        </div>
        <hr />
      </li>
      <li>
        <hr />
        <div className="timeline-middle">
          <CircleCheck />
        </div>
        <div className="timeline-end timeline-box">Analysis</div>
        <hr />
      </li>
      <li>
        <hr />
        <div className="timeline-start timeline-box">Complete</div>
        <div className="timeline-middle">
          <CircleCheck />
        </div>
      </li>
    </ul>
  );
}

export default ProgressBar;
