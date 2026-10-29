# ONNX/ML Models Extracted from APK

**Source:** Image Toolbox.apk (v4.2.0) - assets/ directory

## Extracted Models

| Model | Size | Purpose |
|-------|------|---------|
| `u2netp.onnx` | 4,574,861 bytes (4.4 MB) | Depth estimation / image segmentation (U²-Net lightweight) |
| `face_detection_yunet_2026may.onnx` | 229,738 bytes (224 KB) | Face detection (YuNet - OpenCV) |

## Also in APK (not extracted)
- `assets/mlkit_barcode_models/barcode_ssd_mobilenet_v1_dmp25_quant.tflite` (390 KB)
- `assets/mlkit_barcode_models/oned_auto_regressor_mobile.tflite` (214 KB)
- `assets/mlkit_barcode_models/oned_feature_extractor_mobile.tflite` (277 KB)
- `assets/selfiesegmentation_mlkit-256x256-2021_01_19-v1215.f16.tflite` (249 KB)
- `assets/segmentation_graph.binarypb` (394 bytes)

## AI Model Types Supported
AI_DETECTION, ANIME, ARTIFACTS, COLORIZE, DENOISE, DEPTH, DE_JPEG, ENHANCE, REMOVE_BG, SCANS, STYLE_TRANSFER, UPSCALE

## Download Behavior
- Generative inpaint model: ~200 MB downloaded from GitHub
- ONNX/ORT models: Can be downloaded or imported
- PaddleOCR: Requires additional ONNX model downloads
- Tesseract OCR: Additional training data downloads

## Model Locations
- `/home/rishi/magick-web/android/rea-analysis/models/u2netp.onnx`
- `/home/rishi/magick-web/android/rea-analysis/models/face_detection_yunet_2026may.onnx`
