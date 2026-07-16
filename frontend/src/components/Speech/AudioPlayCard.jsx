import { useEffect, useRef, useState, useCallback } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import {
  Volume2,
  VolumeX,
  Volume1,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
} from 'lucide-react';

// Safe time formatting helper
function formatTime(seconds) {
  if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Dynamic volume icon helper
function VolumeIcon({ volume, isMuted }) {
  if (isMuted || volume === 0) return <VolumeX size={16} />;
  if (volume < 0.5) return <Volume1 size={16} />;
  return <Volume2 size={16} />;
}

function AudioPlaybackCard({ audioFile }) {
  const audioRef = useRef(null);
  const seekRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [objectUrl, setObjectUrl] = useState(null);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  /* ── Object URL lifecycle ─────────────────────────────────────────── */
  useEffect(() => {
    if (!audioFile) {
      setObjectUrl(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      return;
    }
    const url = URL.createObjectURL(audioFile);
    setObjectUrl(url);
    setIsPlaying(false);
    setCurrentTime(0);
    return () => URL.revokeObjectURL(url);
  }, [audioFile]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (objectUrl) {
      audio.src = objectUrl;
      audio.load();
    } else audio.src = '';
  }, [objectUrl]);

  /* ── Audio event listeners ────────────────────────────────────────── */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  /* ── Controls ─────────────────────────────────────────────────────── */
  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !objectUrl) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      await audio.play();
      setIsPlaying(true);
    }
  }, [isPlaying, objectUrl]);

  const skip = useCallback(
    (secs) => {
      const audio = audioRef.current;
      if (!audio || !duration) return;
      audio.currentTime = Math.min(
        Math.max(audio.currentTime + secs, 0),
        duration,
      );
    },
    [duration],
  );

  /* ── Custom Seek Logic ────────────────────────────────────────────── */
  const getRatio = (e) => {
    const rect = seekRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    return Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
  };

  const handleSeekDown = useCallback(
    (e) => {
      if (!duration) return;
      setIsSeeking(true);
      const ratio = getRatio(e);
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = ratio * duration;
        setCurrentTime(audio.currentTime);
      }
    },
    [duration],
  );

  useEffect(() => {
    if (!isSeeking) return;
    const onMove = (e) => {
      const ratio = getRatio(e);
      const audio = audioRef.current;
      if (audio && duration) {
        audio.currentTime = ratio * duration;
        setCurrentTime(audio.currentTime);
      }
    };
    const onUp = () => setIsSeeking(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isSeeking, duration]);

  /* ── Volume & Playback Rate ───────────────────────────────────────── */
  const handleVolumeChange = useCallback((e) => {
    const audio = audioRef.current;
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (audio) {
      audio.volume = val;
      audio.muted = val === 0;
    }
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    const next = !isMuted;
    setIsMuted(next);
    if (audio) audio.muted = next;
  }, [isMuted]);

  const cycleRate = useCallback(() => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const next = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  }, [playbackRate]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const disabled = !audioFile;

  return (
    <div
      className={`flex flex-col gap-2 p-5 w-full rounded-xl bg-base-200 transition-opacity duration-200 ${disabled ? 'opacity-60' : ''}`}
    >
      <audio ref={audioRef} preload="metadata" />

      {/* Main Player Row */}
      <div className="flex flex-row items-center gap-4 w-full">
        {/* Play/Pause Button */}
        <button
          className="btn btn-circle btn-neutral btn-sm shrink-0"
          onClick={togglePlay}
          disabled={disabled}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
        </button>

        {/* Playback Settings Group (Shuffle, Back, Speed, Forward, Repeat) */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIsShuffled((s) => !s)}
            disabled={disabled}
            className={`btn btn-ghost btn-xs btn-circle ${isShuffled ? 'text-primary' : 'text-base-content/40'}`}
          >
            <Shuffle size={12} />
          </button>
          <button
            onClick={() => skip(-10)}
            disabled={disabled}
            className="btn btn-ghost btn-xs btn-circle text-base-content/60"
          >
            <SkipBack size={12} />
          </button>
          <button
            onClick={disabled ? undefined : cycleRate}
            disabled={disabled}
            className="btn btn-ghost btn-xs rounded-md font-mono text-[10px] text-base-content/60 px-1 min-h-0 h-6"
          >
            {playbackRate}x
          </button>
          <button
            onClick={() => skip(10)}
            disabled={disabled}
            className="btn btn-ghost btn-xs btn-circle text-base-content/60"
          >
            <SkipForward size={12} />
          </button>
          <button
            onClick={() => setIsRepeating((r) => !r)}
            disabled={disabled}
            className={`btn btn-ghost btn-xs btn-circle ${isRepeating ? 'text-primary' : 'text-base-content/40'}`}
          >
            <Repeat size={12} />
          </button>
        </div>

        {/* Progress & Timeline Centerpiece */}
        <div className="flex flex-col justify-center gap-1 flex-1 min-w-0 select-none">
          <div
            ref={seekRef}
            onMouseDown={disabled ? undefined : handleSeekDown}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`relative w-full rounded-full bg-base-300 transition-all duration-150 dynamic-slider-bar
              ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
              ${isHovering || isSeeking ? 'h-2.5' : 'h-1.5'}`}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') skip(5);
              if (e.key === 'ArrowLeft') skip(-5);
            }}
          >
            {/* Smooth progress filling */}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-neutral pointer-events-none"
              style={{ width: `${progress}%` }}
            />
            {/* Thumb indicator */}
            {(isHovering || isSeeking) && !disabled && (
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-base-content shadow pointer-events-none"
                style={{ left: `${progress}%` }}
              />
            )}
          </div>

          {/* Time display layout */}
          <div className="flex justify-between w-full">
            <span className="font-mono text-[10px] text-base-content/60">
              {formatTime(currentTime)}
            </span>
            <span className="font-mono text-[10px] text-base-content/60">
              {duration ? formatTime(duration) : '--:--'}
            </span>
          </div>
        </div>

        {/* Volume System (Hover to expand style) */}
        <div
          className="flex items-center gap-1 shrink-0"
          onMouseEnter={() => setShowVolume(true)}
          onMouseLeave={() => setShowVolume(false)}
        >
          <div
            className={`flex items-center overflow-hidden transition-all duration-200 sequential-input ${showVolume ? 'w-20 opacity-100' : 'w-0 opacity-0'}`}
          >
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="range range-xs range-neutral w-full"
              aria-label="Volume"
            />
          </div>
          <button
            className="btn btn-ghost btn-sm btn-circle text-base-content/70"
            onClick={toggleMute}
            disabled={disabled}
          >
            <VolumeIcon volume={volume} isMuted={isMuted} />
          </button>
        </div>
      </div>

      {/* File Info Subtitle (Optional, hidden if no audioFile loaded) */}
      {audioFile && (
        <div className="text-center text-[11px] text-base-content/40 truncate w-full border-t border-base-300 pt-1 mt-0.5">
          {audioFile.name} • {(audioFile.size / 1024 / 1024).toFixed(1)} MB
        </div>
      )}
    </div>
  );
}

export default AudioPlaybackCard;
