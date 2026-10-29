# AiDetectionResult.Verdict - AI Detection Enum

**Class:** `com.t8rin.imagetoolbox.feature.ai_tools.domain.model.AiDetectionResult$Verdict`
**Type:** Enum
**File:** Decompiled from Image Toolbox.apk (v4.2.0)

## Enum Values
- `LikelyAi` - Image likely AI-generated
- `LikelyHuman` - Image likely human-created  
- `Uncertain` - Detection uncertain

## Methods
- `$values()` - Returns all enum values
- `<clinit>()` - Static initializer
- `<init>(String, int)` - Constructor
- `getEntries()` - Returns entries
- `valueOf(String)` - Get enum by name
- `values()` - Returns all values (smali decompiled above)

## Detection Logic
The verdict enum is part of the AI detection feature that classifies images as AI-generated or human-created. Related string resources indicate:
- `ai_detector_analyze`: "Analyze"
- `ai_detector_disclaimer`: "The result is a probabilistic estimate, not proof..."
- `ai_detector_likely_ai`: "Likely AI-generated"
- `ai_detector_likely_human`: "Likely human-created"
- `ai_detector_uncertain`: "Uncertain"
- `ai_probability`: "AI Probability: %1$s"

## Related Classes
- `AiDetectionContract$ResizeMode` - Resize modes: ShortestSideCenterCrop, Stretch
- `NeuralModel$Type` - Model types: AI_DETECTION, ANIME, ARTIFACTS, COLORIZE, DENOISE, DEPTH, DE_JPEG, ENHANCE, REMOVE_BG, SCANS, STYLE_TRANSFER, UPSCALE
