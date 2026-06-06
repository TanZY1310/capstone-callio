import BodyHeader from '../components/Speech/BodyHeader';
import Preferencecard from '../components/Speech/PreferenceCard';
import SpeechAnalysisCard from '../components/Speech/SpeechAnalysisCard';
import { preferenceData } from '../components/Speech/SampleData';

function Speech() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-base-200 p-6 gap-6">
      <BodyHeader />
      <div className="grid grid-cols-2 gap-4">
        <Preferencecard data={preferenceData} />
      </div>
      <SpeechAnalysisCard data={preferenceData} />
    </div>
  );
}

export default Speech;
