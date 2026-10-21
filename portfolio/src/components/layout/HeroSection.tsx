"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Pause, Play, Volume2, VolumeX } from "lucide-react";

// Paste your YouTube link here
const YOUTUBE_URL = "https://youtu.be/uX6jCay0c6I?si=CwOxjFOBzLsTF7-w&t=54";

const getYouTubeId = (url: string) =>
  url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1] ?? "";

const videoId = getYouTubeId(YOUTUBE_URL);

export function HeroSection() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const sendCommand = (func: string, args: unknown[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*"
    );
  };

  const toggleMute = () => {
    if (isMuted) {
      sendCommand("unMute");
      sendCommand("setVolume", [100]);
    } else {
      sendCommand("mute");
    }
    setIsMuted(!isMuted);
  };

  const togglePlay = () => {
    sendCommand(isPlaying ? "pauseVideo" : "playVideo");
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] w-full flex-col justify-end overflow-hidden bg-black">
      {/* Background YouTube Video */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <iframe
          ref={iframeRef}
          className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&playsinline=1&disablekb=1&iv_load_policy=3&enablejsapi=1`}
          title="Background video"
          allow="autoplay; encrypted-media"
          allowFullScreen
          tabIndex={-1}
        />
      </div>

      {/* Bottom Bar: Action Buttons + Video Controls */}
      <div className="relative z-10 flex w-full flex-col gap-4 px-4 pb-12 sm:flex-row sm:items-center sm:justify-between sm:pb-16 lg:px-8">
        {/* Action Buttons */}
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

        {/* Video Controls */}
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