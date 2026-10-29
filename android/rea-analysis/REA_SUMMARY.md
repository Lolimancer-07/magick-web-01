# REA Reverse Engineering Analysis: Image Toolbox APK

**Target:** `/home/rishi/Downloads/Image Toolbox.apk`
**APK SHA-256:** `bbc04b7678f9411c8f248e090f8efc70501802a03dc88241d5da4dd6f6f75d59`
**Package:** `ru.tech.imageresizershrinker`
**Version:** 4.2.0 (code 267)
**Developer:** Malik Mukhametzyanov (T8RIN)
**Analysis Date:** 2026-10-30
**Tools:** REA v6.8.0, apktool 2.11.0, jadx-headless-mcp 0.7.1

## Analysis Output Location
`/home/rishi/magick-web/android/rea-analysis/`

| Subfolder | Contents |
|-----------|----------|
| `models/` | Extracted ONNX models (u2netp.onnx, face_detection_yunet_2026may.onnx) |
| `models/metadata/` | Model documentation |
| `decompiled/ai_detection/` | AiDetectionResult.Verdict enum analysis |
| `decompiled/depth_effect/` | DepthEffect enum (15 depth effects) |
| `decompiled/neural_model/` | NeuralModel.Type (14 AI model types) |
| `decompiled/aire_library/` | Aire library (100 image processing methods) |
| `network/` | API endpoints, Firebase config, security flags |
| `strings/` | All decoded string resources (apktool output) |

## Key Findings

### AI/ML Features
- **AI Detection:** Classifies images as LikelyAi / LikelyHuman / Uncertain
- **Depth Effects:** 15 effects (BackgroundBlur, Portrait, LensBlur, Relight, Stereo, etc.)
- **Neural Models:** 14 types including AI_DETECTION, DENOISE, REMOVE_BG, UPSCALE, STYLE_TRANSFER, COLORIZE, DEPTH, DE_JPEG, ARTIFACTS, ANIME, ENHANCE, SCANS, REMOVE_BG
- **Generative Inpaint:** Object removal via AI model (~200 MB from GitHub)

### Embedded Models (extracted to models/)
- `u2netp.onnx` - 4.4 MB depth/segmentation model
- `face_detection_yunet_2026may.onnx` - 224 KB face detection (YuNet/OpenCV)

### Image Processing (Aire Library - 100 methods)
Tone mapping, blur, CLAHE, equalization, emboss, glitch, grain, dehaze, and 90+ other bitmap operations

### Network & Firebase
- **Firebase Project:** `imagetoolbox-13e3c`
- **API Key:** `AIzaSyBH5QgaBw6XAfuxhPVJzq-r9s8ZMFalXzU`
- **Storage:** `imagetoolbox-13e3c.appspot.com`
- **Cleartext traffic:** Enabled (security risk)

### APK Security Profile
- 24,246 classes, 2,340 resources, no native .so libraries
- v2+v3 signing, self-consistent
- 17 permissions including CAMERA, INTERNET, READ_CONTACTS, FOREGROUND_SERVICE
- 12 exported components
- `usesCleartextTraffic="true"`, `extractNativeLibs="true"`, `allowBackup="true"`

## How to Re-run Analysis
```bash
export REA_JADX_MCP_JAR="/home/rishi/.local/share/rea/android/jadx-headless-mcp-0.7.1-all.jar"
APK="/home/rishi/Downloads/Image Toolbox.apk"

# JADX inspection
npx rea-agents@latest inspect-android-package "$APK" --format json

# Search classes
npx rea-agents@latest search-android-classes "$APK" "AiDetection"

# Decompile method
npx rea-agents@latest inspect-android-method "$APK" "ClassName" "methodName"

# Decode resources
npx rea-agents@latest decode-android-resources "$APK"

# Inspect signature
npx rea-agents@latest inspect-apk-signature "$APK"
```
