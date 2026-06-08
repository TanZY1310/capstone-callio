// TranscriptionTab.jsx
function TranscriptionTab({ data }) {
  return (
    <div className="tab-panel">
      <div className="card-body gap-8">
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-1">
            <h2 className="text-section-heading">Call Transcription</h2>
            <p className="text-helper">
              AI-processed conversation between agent and buyer
            </p>
          </div>
          <div className="flex flex-col gap-4 w-full">
            {data?.transcription?.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col gap-1 max-w-[70%] ${
                  item.speaker === 'agent'
                    ? 'items-start self-start'
                    : 'items-end self-end'
                }`}
              >
                <span className="text-xs font-bold text-base-content/50 capitalize">
                  {item.speaker}
                </span>
                <div
                  className={`px-4 py-3 rounded-xl text-sm leading-relaxed ${
                    item.speaker === 'agent'
                      ? 'bg-base-200 text-base-content'
                      : 'bg-neutral text-neutral-content'
                  }`}
                >
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default TranscriptionTab;
