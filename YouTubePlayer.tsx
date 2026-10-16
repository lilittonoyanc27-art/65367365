import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ExternalLink,
  FastForward,
  Rewind,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface YouTubePlayerProps {
  videoId: string;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  seekRequestedTime: number | null;
  onSeekHandled: () => void;
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  onTimeUpdate,
  onPlayStateChange,
  seekRequestedTime,
  onSeekHandled,
  playbackRate,
  onPlaybackRateChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const timerRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(230);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playerError, setPlayerError] = useState<string | null>(null);

  // Initialize YouTube IFrame API
  useEffect(() => {
    let isMounted = true;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      try {
        playerRef.current = new window.YT.Player('yt-player-iframe', {
          videoId: videoId,
          playerVars: {
            playsinline: 1,
            modestbranding: 1,
            rel: 0,
            origin: window.location.origin,
            fs: 1,
            enablejsapi: 1,
          },
          events: {
            onReady: (event: any) => {
              if (!isMounted) return;
              setIsReady(true);
              const dur = event.target.getDuration();
              if (dur && dur > 0) setDuration(dur);
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;
              // YT.PlayerState: PLAYING = 1, PAUSED = 2, ENDED = 0, BUFFERING = 3
              const playing = event.data === 1;
              setIsPlaying(playing);
              if (onPlayStateChange) onPlayStateChange(playing);
            },
            onError: (event: any) => {
              if (!isMounted) return;
              console.warn('YouTube Player Error:', event.data);
              // Error 101 or 150 means embedding is restricted by owner
              if (event.data === 150 || event.data === 101) {
                setPlayerError(
                  'Владелец видео ограничил прямое встраивание на сторонних сайтах. Вы можете открыть клип в соседней вкладке YouTube, а синхронизация и учебные задания продолжат работать здесь.'
                );
              } else {
                setPlayerError('Не удалось загрузить видеоплеер YouTube. Проверьте интернет-соединение.');
              }
            },
          },
        });
      } catch (err) {
        console.error('Error creating YouTube Player:', err);
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      window.onYouTubeIframeAPIReady = initPlayer;
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    } else if (window.YT && window.YT.Player) {
      initPlayer();
    }

    return () => {
      isMounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [videoId]);

  // Polling loop for playback time
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const time = playerRef.current.getCurrentTime();
          const dur = playerRef.current.getDuration();
          if (typeof time === 'number' && !isNaN(time)) {
            setCurrentTime(time);
            if (dur && dur > 0) setDuration(dur);
            onTimeUpdate(time, dur || 230);
          }
        } catch (err) {
          // player might be initializing
        }
      }
    }, 250);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [onTimeUpdate]);

  // Handle external seek request (e.g. from clicking a lyric line)
  useEffect(() => {
    if (seekRequestedTime !== null && playerRef.current && typeof playerRef.current.seekTo === 'function') {
      try {
        playerRef.current.seekTo(seekRequestedTime, true);
        if (typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
        }
      } catch (e) {
        console.warn('Seek error:', e);
      }
      onSeekHandled();
    }
  }, [seekRequestedTime, onSeekHandled]);

  // Handle playback rate change
  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.setPlaybackRate === 'function') {
      try {
        playerRef.current.setPlaybackRate(playbackRate);
      } catch (e) {
        // ignore
      }
    }
  }, [playbackRate]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const jumpSeconds = (delta: number) => {
    if (!playerRef.current || typeof playerRef.current.getCurrentTime !== 'function') return;
    try {
      const target = Math.max(0, Math.min(duration, playerRef.current.getCurrentTime() + delta));
      playerRef.current.seekTo(target, true);
    } catch (e) {
      console.warn(e);
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleSliderSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(newTime, true);
    }
  };

  const formatSecs = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-[#25050f]/90 border border-rose-900/50 rounded-2xl shadow-2xl overflow-hidden backdrop-blur">
      {/* Video IFrame container with 16:9 aspect ratio */}
      <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
        <div id="yt-player-iframe" className="w-full h-full" ref={containerRef}></div>

        {/* Fallback Error Overlay if embedding is restricted */}
        {playerError && (
          <div className="absolute inset-0 bg-[#1e030a]/95 backdrop-blur-sm p-6 flex flex-col items-center justify-center text-center z-20">
            <AlertCircle className="w-12 h-12 text-orange-500 mb-3" />
            <h4 className="text-lg font-bold text-stone-100 mb-2">Оригинальный видеоклип Наталии Орейро</h4>
            <p className="text-sm text-rose-200/90 max-w-md mb-4">{playerError}</p>
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/30"
            >
              <ExternalLink className="w-4 h-4" />
              Смотреть клип на YouTube
            </a>
            <p className="text-xs text-rose-300/70 mt-3">
              Интерактивные субтитры, перевод строк и обучающие игры работают в полном объёме ниже!
            </p>
          </div>
        )}
      </div>

      {/* Modern Player Control Bar */}
      <div className="p-4 bg-[#1b0309]/95 border-t border-rose-900/40">
        {/* Progress scrub bar */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-mono font-medium text-orange-400 min-w-10">
            {formatSecs(currentTime)}
          </span>
          <div className="relative flex-1 group">
            <input
              type="range"
              min="0"
              max={duration || 230}
              step="0.5"
              value={currentTime}
              onChange={handleSliderSeek}
              aria-label="Перемотка видеоклипа"
              className="w-full h-2 bg-[#360917] rounded-lg appearance-none cursor-pointer accent-orange-500 hover:h-2.5 transition-all"
            />
          </div>
          <span className="text-xs font-mono text-rose-300/70 min-w-10 text-right">
            {formatSecs(duration)}
          </span>
        </div>

        {/* Action controls row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Main Playback Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => jumpSeconds(-5)}
              className="p-2 text-rose-200/80 hover:text-orange-400 hover:bg-rose-950/60 rounded-lg transition-colors"
              title="Перемотать на 5 секунд назад"
              aria-label="5 секунд назад"
            >
              <Rewind className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlay}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 via-rose-600 to-amber-500 hover:from-orange-400 hover:to-rose-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-orange-500/30 transition-all hover:scale-102 active:scale-98"
              aria-label={isPlaying ? 'Пауза' : 'Воспроизведение'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-white" />
                  <span>Пауза</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-white" />
                  <span>Слушать</span>
                </>
              )}
            </button>

            <button
              onClick={() => jumpSeconds(5)}
              className="p-2 text-rose-200/80 hover:text-orange-400 hover:bg-rose-950/60 rounded-lg transition-colors"
              title="Перемотать на 5 секунд вперёд"
              aria-label="5 секунд вперёд"
            >
              <FastForward className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
                  playerRef.current.seekTo(0, true);
                  playerRef.current.playVideo();
                }
              }}
              className="p-2 text-rose-200/80 hover:text-orange-400 hover:bg-rose-950/60 rounded-lg transition-colors"
              title="Начать с начала"
              aria-label="С начала песни"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Speed & Volume Tools */}
          <div className="flex items-center gap-3">
            {/* Playback speed selector for language learners */}
            <div className="flex items-center gap-1 bg-[#2c0713] p-1 rounded-xl border border-rose-900/50">
              <span className="text-xs text-rose-300/80 pl-2 hidden sm:inline">Скорость:</span>
              {[0.75, 1.0, 1.25].map((rate) => (
                <button
                  key={rate}
                  onClick={() => onPlaybackRateChange(rate)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    playbackRate === rate
                      ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-sm'
                      : 'text-rose-200/70 hover:text-white hover:bg-rose-900/40'
                  }`}
                  aria-label={`Скорость ${rate}x`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            <button
              onClick={toggleMute}
              className="p-2 text-rose-200/80 hover:text-orange-400 hover:bg-rose-950/60 rounded-lg transition-colors"
              title={isMuted ? 'Включить звук' : 'Выключить звук'}
              aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 text-xs text-rose-300/70 hover:text-orange-400 px-3 py-1.5 rounded-lg hover:bg-rose-950/60 transition-colors"
              title="Открыть на YouTube"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>YouTube</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
