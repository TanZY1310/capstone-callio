function AnalysisTab({ setActiveTab, activeTab }) {
  const tabs = [
    { label: 'Transcription', value: 'transcription' },
    { label: 'Analysis', value: 'sentiment' },
    { label: 'Next Action', value: 'next_action' },
  ];

  return (
    <div role="tablist" className="tabs tabs-bordered">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          className={`tab font-semibold ${activeTab === tab.value ? 'tab-active' : 'text-base-content/80'}`}
          onClick={() => setActiveTab(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default AnalysisTab;
