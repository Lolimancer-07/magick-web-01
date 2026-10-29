# NeuralModel.Type - AI Model Types

**Class:** `com.t8rin.imagetoolbox.feature.ai_tools.domain.model.NeuralModel$Type`
**Type:** Enum
**File:** Decompiled from Image Toolbox.apk (v4.2.0)

## Model Types (14 types)
- `AI_DETECTION` - AI image detection
- `ANIME` - Anime style processing
- `ARTIFACTS` - JPEG/compression artifact removal
- `COLORIZE` - Image colorization
- `DENOISE` - Image denoising
- `DEPTH` - Depth estimation
- `DE_JPEG` - JPEG decompression/repair
- `ENHANCE` - Image enhancement
- `REMOVE_BG` - Background removal
- `SCANS` - Document scanning
- `STYLE_TRANSFER` - Neural style transfer
- `UPSCALE` - Image upscaling

## ONNX Models Embedded in APK
- `assets/u2netp.onnx` (4,574,861 bytes) - Depth/segmentation model
- `assets/face_detection_yunet_2026may.onnx` (229,738 bytes) - Face detection (YuNet)
- `assets/mlkit_barcode_models/` - ML Kit barcode models (TFLite)
- `assets/selfiesegmentation_mlkit-256x256-2021_01_19-v1215.f16.tflite` - Selfie segmentation
- `assets/segmentation_graph.binarypb` - Segmentation graph

## AI Features from String Resources
- Generative inpaint: Remove objects using AI model (~200 MB from GitHub)
- ONNX/ORT model support: Download or import custom ONNX models
- PaddleOCR: Requires additional ONNX models
- Tesseract OCR: Additional training data download
