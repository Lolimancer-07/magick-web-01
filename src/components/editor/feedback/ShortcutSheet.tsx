"use client";

import { useEffect } from "react";
import { X, Command, Keyboard } from "lucide-react";
import { useEditorStore } from "@/store/editorStore";

export default function ShortcutSheet() {
  const { shortcutSheetOpen, setShortcutSheetOpen } = useEditorStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        setShortcutSheetOpen(!shortcutSheetOpen);
      }
      if (e.key === "Escape" && shortcutSheetOpen) {
        setShortcutSheetOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcutSheetOpen, setShortcutSheetOpen]);

  if (!shortcutSheetOpen) return null;

  const SHORTCUT_GROUPS = [
    {
      title: "Canvas & Navigation",
      items: [
        { key: "0", desc: "Fit image to canvas view" },
        { key: "1", desc: "100% 1:1 Actual size" },
        { key: "+ / -", desc: "Zoom in / Zoom out" },
        { key: "Space + Drag", desc: "Pan around canvas" },
        { key: "\\", desc: "Hold to peek original image" },
      ],
    },
    {
      title: "Editing & Pipeline",
      items: [
        { key: "/", desc: "Focus tool search field" },
        { key: "Ctrl + Z", desc: "Undo last modification" },
        { key: "Ctrl + Y", desc: "Redo modification" },
        { key: "Alt + ↑ / ↓", desc: "Reorder selected pipeline step" },
        { key: "Delete", desc: "Remove selected step from pipeline" },
      ],
    },
    {
      title: "File & Export",
      items: [
        { key: "Ctrl + V", desc: "Paste image directly from clipboard" },
        { key: "O", desc: "Open new image file" },
        { key: "E", desc: "Open full-resolution export dialog" },
        { key: "?", desc: "Toggle this keyboard shortcuts sheet" },
        { key: "Esc", desc: "Close dialogs & sheets" },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150 select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard Shortcuts"
    >
      <div className="relative w-full max-w-lg bg-[var(--surface)] rounded-3xl border-2 border-[var(--line-2)] shadow-[4px_4px_0_var(--ink)] p-6 text-[var(--ink)]">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setShortcutSheetOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] hover:bg-[var(--surface)] text-[var(--ink)] transition-colors cursor-pointer"
          aria-label="Close shortcuts"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-[#a4cad7] border border-[var(--line-2)]/20 flex items-center justify-center text-[var(--ink)] shadow-[1px_1px_0_var(--ink)]">
            <Keyboard size={18} />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-[var(--ink)]">Keyboard Shortcuts</h3>
            <p className="text-xs text-[var(--muted)]">Speed up your editing workflow</p>
          </div>
        </div>

        {/* Shortcut Groups */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.title} className="space-y-2">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--muted)]">
                {group.title}
              </h4>
              <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] divide-y divide-[#cfc9c3]/60">
                {group.items.map((item) => (
                  <div key={item.key} className="flex items-center justify-between px-3 py-2 text-xs">
                    <span className="text-[var(--muted)] font-medium">{item.desc}</span>
                    <kbd className="px-2 py-0.5 rounded-md bg-[var(--surface)] border border-[var(--line)] font-mono text-[11px] font-bold text-[var(--ink)] shadow-sm">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
