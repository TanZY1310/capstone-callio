function AnalysisTab({ setActiveTab }) {
  const tabs = [
    { label: "Transcription", value: "transcription" },
    { label: "Sentiment", value: "sentiment" },
    { label: "Next Action", value: "next_action" },
  ];

  return (
    <div
      role="tablist"
      className="tabs tabs-bordered w-full max-w-[436px] h-fit p-0 flex flex-row flex-wrap items-center justify-start gap-6 "
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          className="tab font-semibold pb-3"
          onClick={() => setActiveTab(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default AnalysisTab;
