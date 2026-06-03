function AnalysisTab({ setActiveTab }) {
  const tabs = [
    { label: "Transcription", value: "transcription" },
    { label: "Sentiment",     value: "sentiment" },
    { label: "Next Action",   value: "next_action" },
  ];

  return (
    <div role="tablist" className="tabs tabs-bordered mt-6">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          className="tab font-semibold"
          onClick={() => setActiveTab(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
export default AnalysisTab;