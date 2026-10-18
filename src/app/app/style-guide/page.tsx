"use client";

import React, { useState } from "react";
import TopBar from "@/components/mobile/TopBar";
import BottomNav, { NavTab } from "@/components/mobile/BottomNav";
import StickyPreview from "@/components/mobile/StickyPreview";
import QuickActions from "@/components/mobile/QuickActions";
import ToolChipRow, { ToolChipId } from "@/components/mobile/ToolChipRow";
import SettingsCard from "@/components/mobile/SettingsCard";
import Segmented from "@/components/mobile/Segmented";
import ChipGroup from "@/components/mobile/ChipGroup";
import NumberField from "@/components/mobile/NumberField";
import QualitySlider from "@/components/mobile/QualitySlider";
import ColorSwatches from "@/components/mobile/ColorSwatches";
import BottomSheet from "@/components/mobile/BottomSheet";
import ActionBar from "@/components/mobile/ActionBar";
import SizeEstimate from "@/components/mobile/SizeEstimate";
import InfoSheet, { InfoContent } from "@/components/mobile/InfoSheet";
import { Sparkles, SlidersHorizontal } from "lucide-react";

export default function MobileStyleGuide() {
  const [activeTab, setActiveTab] = useState<NavTab>("edit");
  const [activeTool, setActiveTool] = useState<ToolChipId | null>("crop");
  const [segmentVal, setSegmentVal] = useState("flexible");
  const [selectedFormat, setSelectedFormat] = useState("webp");
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [quality, setQuality] = useState(85);
  const [bgColor, setBgColor] = useState("transparent");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [infoContent, setInfoContent] = useState<InfoContent | null>(null);

  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: "var(--bg, #0f1320)",
        color: "var(--ink, #f2f4fb)",
        paddingBottom: "100px",
      }}
    >
      <TopBar
        title={<SizeEstimate originalBytes={2945120} estimatedBytes={1820400} />}
        onBack={() => history.back()}
        actions={[
          {
            id: "settings",
            icon: <SlidersHorizontal size={20} />,
            label: "Settings",
            onClick: () => setIsSheetOpen(true),
          },
        ]}
      />

      <StickyPreview
        previewUrl="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%231c233c'/><circle cx='200' cy='150' r='80' fill='%233fed1e'/><text x='200' y='155' font-size='20' font-family='sans-serif' font-weight='bold' fill='%2307110a' text-anchor='middle'>Preview Frame</text></svg>"
        originalUrl="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23111524'/><circle cx='200' cy='150' r='80' fill='%233089c5'/><text x='200' y='155' font-size='20' font-family='sans-serif' font-weight='bold' fill='%23ffffff' text-anchor='middle'>Original Frame</text></svg>"
        onOpenZoom={() => alert("Zoom viewer opened")}
        onToggleCompare={() => {}}
      />

      <QuickActions
        onRotateLeft={() => {}}
        onFlip={() => {}}
        onRotateRight={() => {}}
        onEditExif={() =>
          setInfoContent({
            title: "Edit EXIF Metadata",
            whatItDoes: "View and edit image metadata tags without re-encoding any pixels.",
            whenToUse: "Use to update author info or remove location data losslessly.",
          })
        }
      />

      <ToolChipRow activeTool={activeTool} onSelectTool={setActiveTool} />

      {/* Resize Type Segmented Control */}
      <SettingsCard
        title="Resize Type"
        onInfoClick={() =>
          setInfoContent({
            title: "Resize Types",
            whatItDoes: "Controls how dimensions are adapted to the output image.",
            whenToUse: "Flexible maintains aspect ratio; Crop fills bounds then crops overflow.",
            cliFlag: "-resize WxH^",
          })
        }
      >
        <Segmented
          options={[
            { value: "explicit", label: "Explicit" },
            { value: "flexible", label: "Flexible" },
            { value: "crop", label: "Crop" },
            { value: "fit", label: "Fit" },
          ]}
          value={segmentVal}
          onChange={setSegmentVal}
        />
      </SettingsCard>

      {/* Dimensions Card */}
      <SettingsCard title="Dimensions">
        <div style={{ display: "flex", gap: "10px" }}>
          <NumberField label="Width" value={width} onChange={setWidth} unit="px" />
          <NumberField label="Height" value={height} onChange={setHeight} unit="px" />
        </div>
      </SettingsCard>

      {/* Quality Card */}
      <SettingsCard title="Quality">
        <QualitySlider value={quality} onChange={setQuality} />
      </SettingsCard>

      {/* Formats Card */}
      <SettingsCard
        title="Image Format"
        badge={
          <span
            style={{
              fontSize: "11px",
              padding: "2px 6px",
              borderRadius: "999px",
              backgroundColor: "var(--m-surface-3, #2a3252)",
              color: "var(--green, #3fed1e)",
            }}
          >
            12
          </span>
        }
      >
        <ChipGroup
          items={[
            { id: "jpg", label: "JPG" },
            { id: "png", label: "PNG" },
            { id: "webp", label: "WEBP" },
            { id: "avif", label: "AVIF" },
            { id: "heic", label: "HEIC", badge: "Desktop", disabled: true, disabledReason: "Needs desktop build" },
            { id: "jxl", label: "JXL", badge: "Desktop", disabled: true, disabledReason: "Needs desktop build" },
            { id: "bmp", label: "BMP" },
            { id: "tiff", label: "TIFF" },
            { id: "ico", label: "ICO" },
            { id: "gif", label: "GIF" },
          ]}
          selected={selectedFormat}
          onSelect={setSelectedFormat}
          layout="scroll"
        />
      </SettingsCard>

      {/* Background Color Card */}
      <SettingsCard title="Background Color">
        <ColorSwatches value={bgColor} onChange={setBgColor} />
      </SettingsCard>

      <ActionBar
        onShare={() => alert("Share clicked")}
        onPreview={() => alert("Preview clicked")}
        onHistory={() => alert("History clicked")}
        onUndo={() => {}}
        onRedo={() => {}}
        onAddImage={() => alert("Add image clicked")}
        onSave={() => alert("Save clicked")}
      />

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} title="Settings Sheet">
        <p style={{ color: "var(--muted, #8a93b8)" }}>
          BottomSheet component supports smooth touch-drag handle, 40%/60%/92% snap points, and hardware back button dismissal.
        </p>
      </BottomSheet>

      <InfoSheet isOpen={!!infoContent} onClose={() => setInfoContent(null)} info={infoContent} />
    </div>
  );
}
