"use client";

import React, { useState } from "react";
import { ClipboardPaste } from "lucide-react";

interface FloatingPasteProps {
  onPasteImage: (file: File) => void;
  bottomOffset?: string;
}

export default function FloatingPaste({
  onPasteImage,
  bottomOffset = "calc(var(--m-bottom-nav-h, 72px) + var(--safe-bottom, 0px) + 16px)",
}: FloatingPasteProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePaste = async () => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.read) {
        setErrorMsg("Clipboard API not supported in this browser. Use Open file.");
        setTimeout(() => setErrorMsg(null), 3000);
        return;
      }

      const items = await navigator.clipboard.read();
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith("image/")) {
            const blob = await item.getType(type);
            const ext = type.split("/")[1] || "png";
            const file = new File([blob], `clipboard-${Date.now()}.${ext}`, { type });
            onPasteImage(file);
            return;
          }
        }
      }
      setErrorMsg("No image found on clipboard");
      setTimeout(() => setErrorMsg(null), 3000);
    } catch (err: unknown) {
      console.warn("Clipboard paste error:", err);
      setErrorMsg("Clipboard access denied. Try opening a file.");
      setTimeout(() => setErrorMsg(null), 3500);
    }
  };

  return (
    <>
      <button
        id="fab-paste-clipboard"
        type="button"
        onClick={handlePaste}
        title="Paste image from clipboard"
        aria-label="Paste image from clipboard"
        style={{
          position: "fixed",
          right: "16px",
          bottom: bottomOffset,
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "var(--m-surface-3, #2a3252)",
          color: "var(--green, #3fed1e)",
          border: "1px solid var(--line-2, rgba(255,255,255,0.14))",
          boxShadow: "0 6px 24px rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 48,
          transition: "transform 0.15s ease, background-color 0.15s ease",
          WebkitTapHighlightColor: "transparent",
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.92)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <ClipboardPaste size={24} />
      </button>

      {errorMsg && (
        <div
          role="alert"
          style={{
            position: "fixed",
            bottom: "calc(var(--m-bottom-nav-h, 72px) + 80px)",
            right: "16px",
            backgroundColor: "var(--red, #f04040)",
            color: "#fff",
            fontSize: "12px",
            fontWeight: 600,
            padding: "8px 14px",
            borderRadius: "10px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
            zIndex: 100,
            maxWidth: "260px",
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          {errorMsg}
        </div>
      )}
    </>
  );
}
