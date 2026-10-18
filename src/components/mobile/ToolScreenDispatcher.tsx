"use client";

import React, { Suspense } from "react";
import SingleEditScreen from "./screens/SingleEditScreen";
import CropScreen from "./screens/CropScreen";
import ImageCuttingScreen from "./screens/ImageCuttingScreen";
import ResizeByWeightScreen from "./screens/ResizeByWeightScreen";
import ResizeByLimitsScreen from "./screens/ResizeByLimitsScreen";
import EditExifScreen from "./screens/EditExifScreen";
import DeleteExifScreen from "./screens/DeleteExifScreen";
import BatchRenameScreen from "./screens/BatchRenameScreen";
import FormatConversionScreen from "./screens/FormatConversionScreen";
import CollageScreen from "./screens/CollageScreen";
import ImageInfoScreen from "./screens/ImageInfoScreen";
import HistogramScreen from "./screens/HistogramScreen";
import PaletteExtractorScreen from "./screens/PaletteExtractorScreen";
import CompareImagesScreen from "./screens/CompareImagesScreen";
import AllOptionsScreen from "./screens/AllOptionsScreen";
import ExtraToolsScreen from "./screens/ExtraToolsScreen";

interface ToolScreenDispatcherProps {
  toolId: string;
}

export default function ToolScreenDispatcher({ toolId }: ToolScreenDispatcherProps) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100dvh", backgroundColor: "var(--bg, #0f1320)" }} />}>
      {renderScreen(toolId)}
    </Suspense>
  );
}

function renderScreen(toolId: string) {
  switch (toolId) {
    case "single-edit":
      return <SingleEditScreen isBatchMode={false} />;
    case "resize-convert":
      return <SingleEditScreen isBatchMode={true} />;
    case "format-conversion":
      return <FormatConversionScreen />;
    case "crop":
      return <CropScreen />;
    case "image-cutting":
      return <ImageCuttingScreen />;
    case "resize-weight":
      return <ResizeByWeightScreen />;
    case "resize-limits":
      return <ResizeByLimitsScreen />;
    case "edit-exif":
      return <EditExifScreen />;
    case "delete-exif":
      return <DeleteExifScreen />;
    case "batch-rename":
      return <BatchRenameScreen />;
    case "collage":
      return <CollageScreen />;
    case "image-info":
      return <ImageInfoScreen />;
    case "histogram":
      return <HistogramScreen />;
    case "palette-extractor":
      return <PaletteExtractorScreen />;
    case "compare-images":
      return <CompareImagesScreen />;
    case "all-options":
      return <AllOptionsScreen />;
    case "canvas":
    case "watermark":
    case "image-to-pdf":
    case "gif-maker":
    case "color-picker":
    case "strip-optimize":
    case "checksum":
    case "preset-manager":
      return <ExtraToolsScreen toolId={toolId} />;
    default:
      return <SingleEditScreen isBatchMode={false} />;
  }
}
