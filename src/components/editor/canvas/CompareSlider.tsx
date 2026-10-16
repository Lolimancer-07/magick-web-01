"use client";

import { useState, useRef, useCallback } from "react";

interface CompareSliderProps {
  beforeUrl: string;
  afterUrl: string;
}

export default function CompareSlider({ beforeUrl, afterUrl }: CompareSliderProps) {
  const [dividerPos, setDividerPos] = useState(50); // 0 to 100 percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (rawX / rect.width) * 100));
      setDividerPos(+pct.toFixed(1));
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative select-none rounded-xl border border-black/15 shadow-[0_20px_50px_rgba(46,54,69,0.2)] overflow-hidden bg-white"
    >
      {/* Before Image (underneath) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={beforeUrl}
        alt="Original before edits"
        className="max-h-[62vh] max-w-[82vw] object-contain block pointer-events-none"
        draggable={false}
      />

      {/* After Image (clipped on top) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${dividerPos}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterUrl}
          alt="Edited preview after edits"
          className="max-h-[62vh] max-w-none object-contain block pointer-events-none"
          style={{
            width: containerRef.current?.querySelector("img")?.clientWidth || "auto",
            height: containerRef.current?.querySelector("img")?.clientHeight || "auto",
          }}
          draggable={false}
        />
      </div>

      {/* Draggable Divider Line */}
      <div
        className="absolute top-0 bottom-0 pointer-events-auto cursor-ew-resize z-10 flex items-center justify-center"
        style={{ left: `calc(${dividerPos}% - 14px)`, width: "28px" }}
        onMouseDown={handleMouseDown}
        role="slider"
        aria-label="Before/after comparison divider"
        aria-valuenow={dividerPos}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            setDividerPos((p) => Math.max(0, +(p - 5).toFixed(1)));
          } else if (e.key === "ArrowRight") {
            setDividerPos((p) => Math.min(100, +(p + 5).toFixed(1)));
          }
        }}
      >
        <div className="w-0.5 h-full bg-white shadow-[0_0_8px_rgba(0,0,0,0.6)]" />
        <div className="absolute w-7 h-7 rounded-full bg-white border border-[#cfc9c3] shadow-md flex items-center justify-center text-ink text-[10px] font-bold select-none">
          ‹›
        </div>
      </div>

      {/* Badges */}
      <span className="absolute top-3 left-3 px-2 py-0.5 bg-black/75 backdrop-blur-md text-white rounded text-[10px] font-bold uppercase tracking-wider select-none">
        After
      </span>
      <span className="absolute top-3 right-3 px-2 py-0.5 bg-white/90 backdrop-blur-md text-ink border border-[#cfc9c3] rounded text-[10px] font-bold uppercase tracking-wider select-none">
        Before
      </span>
    </div>
  );
}
