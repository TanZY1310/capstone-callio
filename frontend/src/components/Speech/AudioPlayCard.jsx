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

function formatTime(seconds) {
  if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function VolumeIcon({ volume, isMuted }) {
  if (isMuted || volume === 0) return <VolumeX size={16} />;
  if (volume < 0.5) return <Volume1 size={16} />;
  return <Volume2 size={16} />;
}

/**
 * AudioPlaybackCard
 * @param {Object}    props
 * @param {File|null} props.audioFile – File object from BodyHeader upload
 */
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

  /* ── Seek: mouse ──────────────────────────────────────────────────── */
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

  /* ── Volume ───────────────────────────────────────────────────────── */
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

  /* ── Playback rate ────────────────────────────────────────────────── */
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
      className={`card bg-base-100 shadow-sm w-full transition-opacity duration-200 ${disabled ? 'opacity-60' : ''}`}
    >
      <div className="card-body p-4 gap-3">
        {/* ── Track info ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Waveform avatar placeholder */}
          <div className="avatar avatar-placeholder shrink-0">
            <div className="bg-neutral text-neutral-content rounded-lg w-10 h-10 flex items-center justify-center">
              <span
                className="loading loading-bars loading-xs"
                style={{ opacity: audioFile ? 1 : 0.3 }}
              />
            </div>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-semibold text-base-content truncate">
              {audioFile
                ? audioFile.name.replace(/\.[^/.]+$/, '')
                : 'No audio loaded'}
            </span>
            <span className="text-xs text-base-content/50 truncate">
              {audioFile
                ? `${(audioFile.size / 1024 / 1024).toFixed(1)} MB · ${audioFile.type || 'audio'}`
                : 'Upload an audio file to begin'}
            </span>
          </div>
        </div>

        {/* ── Scrubber ───────────────────────────────────────────────── */}
        <div className="flex flex-col gap-1 w-full select-none">
          {/* Track bar */}
          <div
            ref={seekRef}
            onMouseDown={disabled ? undefined : handleSeekDown}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`relative w-full rounded-full bg-base-300 transition-all duration-150
              ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
              ${isHovering || isSeeking ? 'h-3' : 'h-1.5'}`}
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
            {/* Filled portion */}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-neutral transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
            {/* Thumb — only visible on hover/seeking */}
            {(isHovering || isSeeking) && !disabled && (
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-base-content shadow"
                style={{ left: `${progress}%` }}
              />
            )}
          </div>

          {/* Timestamps */}
          <div className="flex justify-between w-full px-0.5">
            <span className="font-mono text-xs text-base-content/50">
              {formatTime(currentTime)}
            </span>
            <span className="font-mono text-xs text-base-content/50">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* ── Controls row ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between w-full">
          {/* Left: shuffle + skip back */}
          <div className="flex items-center gap-1">
            <div className="tooltip tooltip-top" data-tip="Shuffle">
              <button
                onClick={() => setIsShuffled((s) => !s)}
                disabled={disabled}
                className={`btn btn-ghost btn-xs btn-circle ${isShuffled ? 'text-primary' : 'text-base-content/50'}`}
              >
                <Shuffle size={14} />
              </button>
            </div>
            <div className="tooltip tooltip-top" data-tip="Skip back 10s">
              <button
                onClick={() => skip(-10)}
                disabled={disabled}
                className="btn btn-ghost btn-xs btn-circle text-base-content/70"
              >
                <SkipBack size={14} />
              </button>
            </div>
          </div>

          {/* Centre: Play / Pause */}
          <button
            onClick={togglePlay}
            disabled={disabled}
            className="btn btn-neutral btn-circle btn-md"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
          </button>

          {/* Right: skip forward + repeat */}
          <div className="flex items-center gap-1">
            <div className="tooltip tooltip-top" data-tip="Skip forward 10s">
              <button
                onClick={() => skip(10)}
                disabled={disabled}
                className="btn btn-ghost btn-xs btn-circle text-base-content/70"
              >
                <SkipForward size={14} />
              </button>
            </div>
            <div className="tooltip tooltip-top" data-tip="Repeat">
              <button
                onClick={() => setIsRepeating((r) => !r)}
                disabled={disabled}
                className={`btn btn-ghost btn-xs btn-circle ${isRepeating ? 'text-primary' : 'text-base-content/50'}`}
              >
                <Repeat size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Bottom row: speed + volume ──────────────────────────────── */}
        <div className="flex items-center justify-between w-full">
          {/* Playback speed badge */}
          <div className="tooltip tooltip-bottom" data-tip="Playback speed">
            <button
              onClick={disabled ? undefined : cycleRate}
              disabled={disabled}
              className="btn btn-ghost btn-xs rounded-full font-mono text-xs text-base-content/60 px-2"
            >
              {playbackRate === 1 ? '1×' : `${playbackRate}×`}
            </button>
          </div>

          {/* Volume section */}
          <div className="flex items-center gap-2">
            {/* Mute toggle */}
            <div
              className="tooltip tooltip-bottom"
              data-tip={isMuted ? 'Unmute' : 'Mute'}
            >
              <button
                onClick={() => {
                  toggleMute();
                  setShowVolume((v) => !v);
                }}
                disabled={disabled}
                className="btn btn-ghost btn-xs btn-circle text-base-content/60"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                <VolumeIcon volume={volume} isMuted={isMuted} />
              </button>
            </div>

            {/* Inline horizontal volume slider — YouTube Music style */}
            <div
              className={`flex items-center overflow-hidden transition-all duration-200 ${
                showVolume ? 'w-24 opacity-100' : 'w-0 opacity-0'
              }`}
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
          </div>
        </div>
      </div>
      <audio ref={audioRef} preload="metadata" />
    </div>
  );
}

export default AudioPlaybackCard;
