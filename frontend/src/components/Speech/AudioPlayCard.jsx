import { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { Volume2 } from 'lucide-react';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function AudioPlaybackCard({ audioUrl }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    const onLoaded = () => setDuration(audio.duration);
    const onTime = () => setCurrent(audio.currentTime);
    const onEnd = () => { setPlaying(false); setCurrent(0); };

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnd);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnd);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="flex justify-center p-4 w-full rounded-xl bg-base-200">
      <audio ref={audioRef} src={audioUrl || undefined} preload="metadata" />
      <div className="flex flex-row items-center gap-3 w-full">
        <button
          className="btn btn-circle btn-neutral btn-sm"
          onClick={togglePlay}
          disabled={!audioUrl}
        >
          {playing ? <FaPause /> : <FaPlay />}
        </button>
        <div className="flex flex-col justify-center gap-1 flex-1">
          <div className="w-full h-1.5 rounded-full bg-base-300 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-200"
              style={{ width: duration ? `${(current / duration) * 100}%` : 0 }}
            />
          </div>
          <div className="flex justify-between w-full">
            <span className="font-mono text-xs text-base-content/60">
              {formatTime(current)}
            </span>
            <span className="font-mono text-xs text-base-content/60">
              {duration ? formatTime(duration) : '--:--'}
            </span>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm btn-circle shrink-0">
          <Volume2 />
        </button>
      </div>
    </div>
  );
}
export default AudioPlaybackCard;
