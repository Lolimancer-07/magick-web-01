"use client";

import React, { useState, useMemo, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  FolderOpen,
  Clock,
  Settings as SettingsIcon,
  Search,
  Star,
  Camera,
  ClipboardPaste,
  X,
  Sliders,
  Maximize,
  RefreshCw,
  Crop,
  Scissors,
  Scale,
  Minimize2,
  FileCode,
  ShieldAlert,
  FileText,
  LayoutGrid,
  Film,
  Palette,
  FileStack,
  Stamp,
  Info,
  BarChart3,
  Pipette,
  Columns,
  Eye,
  Zap,
  Hash,
  Bookmark,
  Terminal,
  HelpCircle,
} from "lucide-react";
import BottomNav, { NavTab } from "@/components/mobile/BottomNav";
import BottomSheet from "@/components/mobile/BottomSheet";
import FloatingPaste from "@/components/mobile/FloatingPaste";
import { TOOLS, ToolDef, getTotalToolCount } from "@/tools/toolRegistry";
import { useMobileImageStore, triggerHaptic, ImageFileEntry } from "@/store/mobileImageStore";
import { engine } from "@/engine/engineClient";
import Link from "next/link";

// Icon mapping helper
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Sliders,
  Maximize,
  RefreshCw,
  Crop,
  Scissors,
  Scale,
  Minimize2,
  FileCode,
  ShieldAlert,
  FileText,
  LayoutGrid,
  Film,
  Palette,
  FileStack,
  Stamp,
  Info,
  BarChart3,
  Pipette,
  Columns,
  Eye,
  Zap,
  Hash,
  Bookmark,
  Terminal,
};

function ToolHubContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab from URL or default "edit"
  const urlTab = (searchParams.get("tab") as NavTab) || "edit";
  const [activeTab, setActiveTab] = useState<NavTab>(
    ["edit", "create", "image", "tools"].includes(urlTab) ? urlTab : "edit"
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedToolForInput, setSelectedToolForInput] = useState<ToolDef | null>(null);
  const [whatsNewOpen, setWhatsNewOpen] = useState(false);
  const [recentSheetOpen, setRecentSheetOpen] = useState(false);

  // Store
  const {
    currentImage,
    recentImages,
    favoriteToolIds,
    toggleFavorite,
    isFavorite,
    setCurrentImage,
    addBatchImages,
    theme,
    setTheme,
  } = useMobileImageStore();

  // Hidden file input refs
  const singleFileRef = useRef<HTMLInputElement>(null);
  const multiFileRef = useRef<HTMLInputElement>(null);
  const cameraFileRef = useRef<HTMLInputElement>(null);

  // Apply theme attribute on mount
  useEffect(() => {
    if (theme === "mauve") {
      document.documentElement.setAttribute("data-theme", "mauve");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [theme]);

  // Update URL on tab change
  const handleTabChange = (tab: NavTab) => {
    triggerHaptic(10);
    setActiveTab(tab);
    router.replace(`/app/?tab=${tab}`);
  };

  // Filter tools by tab and search
  const tabTools = useMemo(() => {
    return TOOLS.filter((t) => t.tab === activeTab);
  }, [activeTab]);

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return tabTools;
    const q = searchQuery.toLowerCase().trim();
    return tabTools.filter((t) => {
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchKeywords = t.keywords.some((k) => k.toLowerCase().includes(q));
      const matchFlags = t.cliFlags?.some((f) => f.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchKeywords || matchFlags;
    });
  }, [tabTools, searchQuery]);

  // Favorite tools for current tab
  const favoriteTools = useMemo(() => {
    if (searchQuery.trim()) return [];
    return tabTools.filter((t) => favoriteToolIds.includes(t.id));
  }, [tabTools, favoriteToolIds, searchQuery]);

  const regularTools = useMemo(() => {
    if (searchQuery.trim()) return filteredTools;
    return tabTools.filter((t) => !favoriteToolIds.includes(t.id));
  }, [tabTools, favoriteToolIds, filteredTools, searchQuery]);

  // Tool click handler
  const handleToolClick = (tool: ToolDef) => {
    triggerHaptic(10);
    if (tool.input === "none") {
      router.push(tool.route);
      return;
    }
    // If we already have an active image loaded in session, give choice or navigate directly
    if (currentImage && tool.input === "single") {
      router.push(tool.route);
      return;
    }
    // Open input picker sheet
    setSelectedToolForInput(tool);
  };

  // Handle files chosen from inputs
  const handleFilesSelected = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    const targetTool = selectedToolForInput || TOOLS[0];

    try {
      if (targetTool.input === "multi") {
        addBatchImages(fileList);
      } else {
        setCurrentImage(fileList[0]);
        // Warm up worker with image
        engine.load(fileList[0]).catch(() => {});
      }
      setSelectedToolForInput(null);
      router.push(targetTool.route);
    } catch (err) {
      console.error("Error loading files:", err);
    }
  };

  const handleClipboardPaste = async (file: File) => {
    setCurrentImage(file);
    engine.load(file).catch(() => {});
    if (selectedToolForInput) {
      const route = selectedToolForInput.route;
      setSelectedToolForInput(null);
      router.push(route);
    } else {
      router.push("/app/tool/single-edit");
    }
  };

  const totalToolCount = getTotalToolCount();

  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: "var(--bg, #0f1320)",
        color: "var(--ink, #f2f4fb)",
        paddingBottom: "calc(var(--m-bottom-nav-h, 72px) + var(--safe-bottom, 0px) + 24px)",
      }}
    >
      {/* ── App Header (Spec 1.1) ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          padding: "calc(var(--safe-top, 0px) + 12px) 16px 12px",
          backgroundColor: "var(--bg, #0f1320)",
          borderBottom: "1px solid var(--line, rgba(255,255,255,0.06))",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* App Title & Dynamic Tool Count Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <h1
            style={{
              fontSize: "19px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--ink, #f2f4fb)",
              margin: 0,
            }}
          >
            Magick Studio
          </h1>
          <span
            id="tool-count-badge"
            title="Real dynamic tool count"
            style={{
              fontSize: "12px",
              fontWeight: 800,
              padding: "2px 8px",
              borderRadius: "999px",
              backgroundColor: "var(--m-surface-3, #2a3252)",
              color: "var(--green, #3fed1e)",
              border: "1px solid var(--line-2, rgba(255,255,255,0.12))",
            }}
          >
            {totalToolCount}
          </span>
        </div>

        {/* Action icons: What's new sparkle, Open, Recent, Settings */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <button
            type="button"
            id="btn-whats-new"
            onClick={() => setWhatsNewOpen(true)}
            title="What's new"
            aria-label="What's new"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "none",
              border: "none",
              color: "var(--green, #3fed1e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Sparkles size={20} />
          </button>

          <button
            type="button"
            id="btn-header-open"
            onClick={() => singleFileRef.current?.click()}
            title="Open an image"
            aria-label="Open image"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "none",
              border: "none",
              color: "var(--ink, #f2f4fb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <FolderOpen size={20} />
          </button>

          <button
            type="button"
            id="btn-header-recent"
            onClick={() => setRecentSheetOpen(true)}
            title="Recent images"
            aria-label="Recent images"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "none",
              border: "none",
              color: "var(--ink, #f2f4fb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Clock size={20} />
          </button>

          <Link
            href="/app/settings"
            id="btn-header-settings"
            title="Settings"
            aria-label="Settings"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "none",
              border: "none",
              color: "var(--ink, #f2f4fb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            <SettingsIcon size={20} />
          </Link>
        </div>
      </header>

      {/* ── Search Bar (Spec 4.1) ── */}
      <div style={{ padding: "14px 16px 8px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            height: "48px",
            backgroundColor: "var(--m-surface-1, #1c233c)",
            borderRadius: "var(--m-radius-chip, 999px)",
            padding: "0 16px",
            border: "1px solid var(--line, rgba(255,255,255,0.08))",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          <Search size={18} style={{ color: "var(--muted, #8a93b8)", flexShrink: 0 }} />
          <input
            id="tool-search-input"
            type="text"
            placeholder="Search tools or CLI flags (e.g. -chop)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--ink, #f2f4fb)",
              fontSize: "14px",
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              style={{
                background: "none",
                border: "none",
                color: "var(--muted, #8a93b8)",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ── Tool Cards List ── */}
      <main style={{ padding: "8px 16px" }}>
        {/* Favorites section if any starred */}
        {favoriteTools.length > 0 && (
          <section style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--green, #3fed1e)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "10px",
                paddingLeft: "4px",
              }}
            >
              <Star size={14} fill="var(--green, #3fed1e)" />
              <span>Favorites</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {favoriteTools.map((tool) => renderToolCard(tool, true))}
            </div>
          </section>
        )}

        {/* Regular tools list */}
        <section>
          {favoriteTools.length > 0 && regularTools.length > 0 && (
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--muted, #8a93b8)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "10px",
                paddingLeft: "4px",
              }}
            >
              All {activeTab.toUpperCase()} Tools
            </div>
          )}

          {filteredTools.length === 0 ? (
            <div
              style={{
                padding: "48px 16px",
                textAlign: "center",
                color: "var(--muted, #8a93b8)",
              }}
            >
              <HelpCircle size={36} style={{ margin: "0 auto 12px", opacity: 0.6 }} />
              <p style={{ fontSize: "15px", fontWeight: 600 }}>No tools found matching &ldquo;{searchQuery}&rdquo;</p>
              <p style={{ fontSize: "13px" }}>Try searching for a tool name or CLI flag like -resize</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {regularTools.map((tool) => renderToolCard(tool, false))}
            </div>
          )}
        </section>
      </main>

      {/* ── Floating Paste FAB (Spec 1.1) ── */}
      <FloatingPaste onPasteImage={handleClipboardPaste} />

      {/* ── Bottom Navigation (Spec 1.1) ── */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* ── Input Picker Bottom Sheet (Spec 4.1) ── */}
      <BottomSheet
        isOpen={!!selectedToolForInput}
        onClose={() => setSelectedToolForInput(null)}
        title={selectedToolForInput ? `Open image for ${selectedToolForInput.title}` : "Open Image"}
        snapPoints={[35, 50, 75]}
        defaultSnap={45}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "8px" }}>
          {/* File Picker Option */}
          <button
            type="button"
            onClick={() => {
              if (selectedToolForInput?.input === "multi") {
                multiFileRef.current?.click();
              } else {
                singleFileRef.current?.click();
              }
            }}
            style={pickerOptionStyle}
          >
            <div style={pickerIconStyle}>
              <FolderOpen size={20} />
            </div>
            <div style={{ textAlign: "left", flex: 1 }}>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--ink, #f2f4fb)" }}>
                {selectedToolForInput?.input === "multi" ? "Select Files / Batch" : "Select from Files"}
              </div>
              <div style={{ fontSize: "12px", color: "var(--muted, #8a93b8)" }}>
                Browse system files and gallery
              </div>
            </div>
          </button>

          {/* Camera Option */}
          <button
            type="button"
            onClick={() => cameraFileRef.current?.click()}
            style={pickerOptionStyle}
          >
            <div style={pickerIconStyle}>
              <Camera size={20} />
            </div>
            <div style={{ textAlign: "left", flex: 1 }}>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--ink, #f2f4fb)" }}>
                Take Photo
              </div>
              <div style={{ fontSize: "12px", color: "var(--muted, #8a93b8)" }}>
                Capture directly using your device camera
              </div>
            </div>
          </button>

          {/* Clipboard Option */}
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.read?.().then((items) => {
                for (const item of items) {
                  for (const type of item.types) {
                    if (type.startsWith("image/")) {
                      item.getType(type).then((blob) => {
                        const file = new File([blob], `clipboard-${Date.now()}.png`, { type });
                        handleClipboardPaste(file);
                      });
                      return;
                    }
                  }
                }
              }).catch(() => {});
            }}
            style={pickerOptionStyle}
          >
            <div style={pickerIconStyle}>
              <ClipboardPaste size={20} />
            </div>
            <div style={{ textAlign: "left", flex: 1 }}>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--ink, #f2f4fb)" }}>
                Paste from Clipboard
              </div>
              <div style={{ fontSize: "12px", color: "var(--muted, #8a93b8)" }}>
                Use copied image from another app
              </div>
            </div>
          </button>

          {/* Recent image if available */}
          {recentImages.length > 0 && (
            <div style={{ marginTop: "4px" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted, #8a93b8)", marginBottom: "8px" }}>
                Recent in this session
              </div>
              <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                {recentImages.slice(0, 5).map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => {
                      setCurrentImage(img.file);
                      if (selectedToolForInput) {
                        const route = selectedToolForInput.route;
                        setSelectedToolForInput(null);
                        router.push(route);
                      }
                    }}
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "12px",
                      border: "1px solid var(--line-2, rgba(255,255,255,0.12))",
                      overflow: "hidden",
                      padding: 0,
                      background: "var(--m-surface-2, #222a46)",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </BottomSheet>

      {/* ── What's New Bottom Sheet ── */}
      <BottomSheet
        isOpen={whatsNewOpen}
        onClose={() => setWhatsNewOpen(false)}
        title="What's New in Magick Studio"
        snapPoints={[50, 70, 90]}
        defaultSnap={65}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", color: "var(--ink, #f2f4fb)" }}>
          <div style={{ padding: "12px", borderRadius: "16px", backgroundColor: "var(--m-surface-2, #222a46)" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--green, #3fed1e)", margin: "0 0 4px" }}>
              Mobile-First Tool Hub
            </h3>
            <p style={{ fontSize: "13px", color: "var(--muted, #8a93b8)", margin: 0, lineHeight: 1.5 }}>
              Modeled after Android Image Toolbox: rounded cards, bottom thumb action bar, quick rotation, and 48px touch targets.
            </p>
          </div>

          <div style={{ padding: "12px", borderRadius: "16px", backgroundColor: "var(--m-surface-2, #222a46)" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--blue, #3089c5)", margin: "0 0 4px" }}>
              Lossless EXIF Segment Editor
            </h3>
            <p style={{ fontSize: "13px", color: "var(--muted, #8a93b8)", margin: 0, lineHeight: 1.5 }}>
              Edit camera tags or strip GPS metadata on JPEG, PNG, and WebP files without recompressing pixel scanlines.
            </p>
          </div>

          <div style={{ padding: "12px", borderRadius: "16px", backgroundColor: "var(--m-surface-2, #222a46)" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--green, #3fed1e)", margin: "0 0 4px" }}>
              Real-Time Size Estimator & Resize by Weight
            </h3>
            <p style={{ fontSize: "13px", color: "var(--muted, #8a93b8)", margin: 0, lineHeight: 1.5 }}>
              Live delta estimation in the top bar and binary-search target file-size compression in KB/MB.
            </p>
          </div>
        </div>
      </BottomSheet>

      {/* ── Recent Images Sheet ── */}
      <BottomSheet
        isOpen={recentSheetOpen}
        onClose={() => setRecentSheetOpen(false)}
        title="Recent Images This Session"
        snapPoints={[40, 60, 80]}
        defaultSnap={50}
      >
        {recentImages.length === 0 ? (
          <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--muted, #8a93b8)" }}>
            <Clock size={32} style={{ margin: "0 auto 8px", opacity: 0.5 }} />
            <p style={{ fontSize: "14px" }}>No recent images opened in this session.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", paddingTop: "8px" }}>
            {recentImages.map((img) => (
              <div
                key={img.id}
                onClick={() => {
                  setCurrentImage(img.file);
                  setRecentSheetOpen(false);
                  router.push("/app/tool/single-edit");
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "var(--m-surface-2, #222a46)",
                  borderRadius: "14px",
                  padding: "8px",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "80px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    marginBottom: "6px",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--ink, #f2f4fb)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  {img.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </BottomSheet>

      {/* ── Hidden File Inputs ── */}
      <input
        ref={singleFileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
      />
      <input
        ref={multiFileRef}
        type="file"
        multiple
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
      />
      <input
        ref={cameraFileRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
      />
    </div>
  );

  // Helper to render tool cards
  function renderToolCard(tool: ToolDef, favorited: boolean) {
    const IconComponent = ICON_MAP[tool.icon] || Sliders;
    return (
      <div
        key={tool.id}
        id={`tool-card-${tool.id}`}
        onClick={() => handleToolClick(tool)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "14px 16px",
          backgroundColor: "var(--m-surface-1, #1c233c)",
          borderRadius: "var(--m-radius-card, 24px)",
          border: "1px solid var(--line, rgba(255,255,255,0.07))",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          cursor: "pointer",
          transition: "transform 0.14s ease, background-color 0.14s ease",
          WebkitTapHighlightColor: "transparent",
          userSelect: "none",
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.985)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {/* 56px Icon Tile */}
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "18px",
            backgroundColor: "var(--m-surface-2, #222a46)",
            color: "var(--green, #3fed1e)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            border: "1px solid var(--line-2, rgba(255,255,255,0.08))",
          }}
        >
          <IconComponent size={26} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "var(--ink, #f2f4fb)",
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              {tool.title}
            </h2>
            {tool.isProposed && (
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  padding: "1px 6px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(48, 137, 197, 0.2)",
                  color: "var(--blue, #3089c5)",
                }}
              >
                PROPOSED
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted, #8a93b8)",
              margin: 0,
              lineHeight: "1.4",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {tool.description}
          </p>
        </div>

        {/* Favorite Star Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic(15);
            toggleFavorite(tool.id);
          }}
          title={favorited ? "Remove from favorites" : "Add to favorites"}
          aria-label="Toggle favorite"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "none",
            border: "none",
            color: favorited ? "var(--green, #3fed1e)" : "var(--dim, #4e5880)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <Star size={20} fill={favorited ? "var(--green, #3fed1e)" : "none"} />
        </button>
      </div>
    );
  }
}

export default function ToolHubPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "var(--bg, #0f1320)" }} />}>
      <ToolHubContent />
    </Suspense>
  );
}

const pickerOptionStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "12px 14px",
  borderRadius: "16px",
  backgroundColor: "var(--m-surface-2, #222a46)",
  border: "1px solid var(--line, rgba(255,255,255,0.08))",
  cursor: "pointer",
  width: "100%",
  WebkitTapHighlightColor: "transparent",
};

const pickerIconStyle: React.CSSProperties = {
  width: "44px",
  height: "44px",
  borderRadius: "50%",
  backgroundColor: "var(--m-surface-3, #2a3252)",
  color: "var(--green, #3fed1e)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};
