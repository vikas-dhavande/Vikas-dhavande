"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Pause, Play, Volume2, VolumeX } from "lucide-react";

// Paste your YouTube PLAYLIST link here (must contain ?list=...)
const PLAYLIST_URL =
  "https://www.youtube.com/playlist?list=PLh5kUn092kvIFPWfcv1mo_DEwVHQ2DYvq";

const getPlaylistId = (url: string) =>
  url.match(/[?&]list=([\w-]+)/)?.[1] ?? "";

const playlistId = getPlaylistId(PLAYLIST_URL);

/* Minimal typings for the YouTube IFrame API */
interface YTPlayer {
  mute(): void;
  unMute(): void;
  setVolume(volume: number): void;
  playVideo(): void;
  pauseVideo(): void;
  nextVideo(): void;
  playVideoAt(index: number): void;
  setLoop(loop: boolean): void;
  setShuffle(shuffle: boolean): void;
  unloadModule(module: string): void;
  destroy(): void;
}

interface YTPlayerEvent {
  target: YTPlayer;
  data: number;
}

interface YTPlayerOptions {
  width?: string | number;
  height?: string | number;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: (e: YTPlayerEvent) => void;
    onStateChange?: (e: YTPlayerEvent) => void;
    onError?: (e: YTPlayerEvent) => void;
  };
}

interface YTNamespace {
  Player: new (element: HTMLElement, options: YTPlayerOptions) => YTPlayer;
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function HeroSection() {
  const playerRef = useRef<YTPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let destroyed = false;

    const hideCaptions = (player: YTPlayer) => {
      try {
        player.unloadModule("captions"); // desktop
        player.unloadModule("cc"); // some mobile players
      } catch { }
    };

    const createPlayer = () => {
      if (destroyed || !containerRef.current || !window.YT) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        width: "100%",
        height: "100%",
        playerVars: {
          listType: "playlist",
          list: playlistId,
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          cc_load_policy: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => {
            const player = e.target;
            player.mute();
            hideCaptions(player);
            player.setLoop(true);
            player.setShuffle(true);
            player.playVideoAt(0);
          },
          onStateChange: (e) => {
            if (e.data === 1) {
              hideCaptions(e.target);
              setIsPlaying(true);
              setReady(true);
            }
            if (e.data === 2) setIsPlaying(false);
          },
          onError: () => {
            setReady(false);
            playerRef.current?.nextVideo();
          },
        },
      });
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        createPlayer();
      };
      if (!document.getElementById("yt-iframe-api")) {
        const tag = document.createElement("script");
        tag.id = "yt-iframe-api";
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
    }

    return () => {
      destroyed = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (isMuted) {
      p.unMute();
      p.setVolume(100);
    } else {
      p.mute();
    }
    setIsMuted(!isMuted);
  };

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    if (isPlaying) p.pauseVideo();
    else p.playVideo();
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] w-full flex-col justify-end overflow-hidden bg-black">
      {/* Clean background video */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-black">
        <div
          className={`absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.35] transition-opacity duration-700 [&_iframe]:h-full [&_iframe]:w-full ${ready ? "opacity-100" : "opacity-0"
            }`}
        >
          <div ref={containerRef} />
        </div>
      </div>

      {/* Bottom Bar: Action Buttons + Video Controls */}
      <div className="relative z-10 flex w-full flex-col gap-4 px-4 pb-12 sm:flex-row sm:items-center sm:justify-between sm:pb-16 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a href="#experience" className="w-full sm:w-fit">
            <Button className="group h-11 w-full rounded-full px-6 font-medium text-black bg-white hover:bg-white/90 sm:w-fit cursor-pointer shadow-lg transition-all">
              <span>Explore Portfolio</span>
              <ArrowUpRight className="ml-1.5 size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
          </a>

          <a href="#social" className="w-full sm:w-fit">
            <Button
              variant="outline"
              className="group h-11 w-full rounded-full px-6 font-medium border-[rgba(39,39,42,0.9)] bg-[rgba(255,255,255,0.06)] text-[#F4F4F5] backdrop-blur-md hover:bg-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.3)] sm:w-fit cursor-pointer transition-all"
            >
              <span>Connect With Vikas</span>
              <ArrowUpRight className="ml-1.5 size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
          </a>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            className="h-11 w-11 rounded-full border-[rgba(39,39,42,0.9)] bg-[rgba(255,255,255,0.06)] text-[#F4F4F5] backdrop-blur-md hover:bg-[rgba(255,255,255,0.12)] hover:text-white cursor-pointer transition-all"
          >
            {isPlaying ? <Pause className="size-5" /> : <Play className="size-5" />}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            className="h-11 w-11 rounded-full border-[rgba(39,39,42,0.9)] bg-[rgba(255,255,255,0.06)] text-[#F4F4F5] backdrop-blur-md hover:bg-[rgba(255,255,255,0.12)] hover:text-white cursor-pointer transition-all"
          >
            {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </Button>
        </div>
      </div>
    </section>
  );
}