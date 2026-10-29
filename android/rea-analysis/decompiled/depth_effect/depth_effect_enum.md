# DepthEffect Enum - Depth-Based AI Effects

**Class:** `com.t8rin.imagetoolbox.feature.ai_tools.domain.model.DepthEffect`
**Type:** Enum
**File:** Decompiled from Image Toolbox.apk (v4.2.0)

## Enum Values (15 effects)
- `BackgroundBlur` - Background blur effect
- `ColorGrade` - Color grading
- `Cutout` - Object cutout
- `DepthEdges` - Depth edge detection
- `DepthMask` - Depth masking
- `FocusColor` - Selective focus color
- `Fog` - Fog effect
- `LensBlur` - Lens blur/bokeh
- `Map` - Depth map
- `NormalMap` - Normal map generation
- `Portrait` - Portrait mode
- `Relight` - Relighting
- `Stereo` - Stereo/depth stereo

## Methods
- `$values()` - Returns all enum values
- `<clinit>()` - Static initializer  
- `<init>(String, int)` - Constructor
- `getEntries()` - Returns entries
- `valueOf(String)` - Get enum by name
- `values()` - Returns all values

## Related
- Uses ONNX model `u2netp.onnx` (4.5 MB) for depth/segmentation
- Uses `face_detection_yunet_2026may.onnx` (230 KB) for face detection
