# ImageMagick CLI Feature Coverage Manifest

This document tracks the full implementation and coverage of all options from `magick -help`.

## Summary Statistics

| Metric | Count | Percentage |
| :--- | :--- | :--- |
| **Total CLI Options** | **261** | 100% |
| **Browser UI Tools (WASM)** | **227** | 87.0% |
| **Desktop Native Tools** | **16** | 6.1% |
| **Not Applicable (CLI-only / daemon / X11)** | **18** | 6.9% |
| **Planned / Unaccounted** | **0** | 0.0% |

## Breakdown by Section

- **Misc**: 7 options
- **Operator**: 138 options
- **Sequence**: 22 options
- **Setting**: 88 options
- **Stack**: 6 options

## Native-Only Tools (Desktop Engine)

| CLI Option | Section | Tool | Reason / Requirement |
| :--- | :--- | :--- | :--- |
| `-authenticate` | setting | `authenticate` | Requires cipher delegate and passphrase; runs in desktop app |
| `-complex` | sequence | `complex` | Requires native complex number mathematics; runs in desktop app |
| `-connected-components` | operator | `connectedComponents` | Requires native connected components labeling; runs in desktop app |
| `-decipher` | operator | `decipher` | Requires cipher delegate for pixel decryption; runs in desktop app |
| `-encipher` | operator | `encipher` | Requires cipher delegate for pixel encryption; runs in desktop app |
| `-fft` | operator | `fft` | Requires FFTW delegate; runs in desktop app |
| `-hough-lines` | operator | `houghLines` | Requires native Hough line transform accumulator; runs in desktop app |
| `-ift` | operator | `ift` | Requires FFTW delegate; runs in desktop app |
| `-integral` | operator | `integral` | Requires native integral image transform operator; runs in desktop app |
| `-kuwahara` | operator | `kuwahara` | Requires native Kuwahara edge-preserving filter; runs in desktop app |
| `-liquid-rescale` | operator | `liquidRescale` | Requires liblqr delegate for seam carving; runs in desktop app |
| `-mean-shift` | operator | `meanShift` | Requires native mean shift clustering operator; runs in desktop app |
| `-poly` | sequence | `polynomial` | Requires native polynomial sequence blending; runs in desktop app |
| `-segment` | operator | `segment` | Requires native color clustering segmentation; runs in desktop app |
| `-sort-pixels` | operator | `sortPixels` | Requires native pixel sorting operator; runs in desktop app |
| `-wavelet-denoise` | operator | `waveletDenoise` | Requires native wavelet denoise operator; runs in desktop app |

## Not-Applicable CLI Flags

| CLI Option | Section | Rationale |
| :--- | :--- | :--- |
| `-bench` | operator | CLI benchmarking flag; performance tests run via Vitest |
| `-debug` | misc | CLI debugging trace; development diagnostics logged via DevTools |
| `-display` | setting | X11 server display viewing; GUI canvas renders image directly |
| `-distribute-cache` | misc | CLI network distributed pixel cache daemon; browser/desktop runs locally |
| `-help` | misc | CLI help flag; interactive documentation and tooltips provided in UI |
| `-list` | misc | CLI listing flag; options and formats listed in UI library and dialogs |
| `-log` | misc | CLI log format configuration; handled through browser/desktop logging |
| `-monitor` | setting | CLI progress monitor; replaced by application progress bars and task indicators |
| `-preview` | setting | CLI contact-sheet generator; UI provides live visual thumbnail previews |
| `-print` | sequence | CLI console output; surfaced through Info/Analyze tab and CLI console |
| `-process` | sequence | CLI external filter module execution; plugins run via WebAssembly/Native modules |
| `-regard-warnings` | setting | CLI warning sensitivity flag; configured in Desktop engine settings |
| `-respect-parentheses` | setting | CLI stack syntax; handled via UI pipeline groups and layers |
| `-synchronize` | setting | CLI disk synchronization flag; memory-backed execution in WASM |
| `-usage` | misc | CLI usage flag; UI tooltips and command palette provide guided usage |
| `-version` | misc | CLI version information; displayed in Status bar and about modal |
| `-view` | setting | FlashPix / interactive X11 viewer; replaced by interactive Canvas view |
| `-write` | sequence | CLI intermediate pipeline write; handled via snapshot history and export dialog |

## Browser UI Options (WASM Engine)

| CLI Option | Section | Tool Name | Engine |
| :--- | :--- | :--- | :--- |
| `-adaptive-blur` | operator | `adaptiveBlur` | wasm |
| `-adaptive-resize` | operator | `adaptiveResize` | wasm |
| `-adaptive-sharpen` | operator | `adaptiveSharpen` | wasm |
| `-adjoin` | setting | `adjoin` | wasm |
| `-affine` | setting | `affine` | wasm |
| `-alpha` | operator | `alpha` | wasm |
| `-annotate` | operator | `annotate` | wasm |
| `-antialias` | setting | `antialias` | wasm |
| `-append` | sequence | `append` | wasm |
| `-attenuate` | setting | `attenuate` | wasm |
| `-auto-gamma` | operator | `autoGamma` | wasm |
| `-auto-level` | operator | `autoLevel` | wasm |
| `-auto-orient` | operator | `autoOrient` | wasm |
| `-auto-threshold` | operator | `autoThreshold` | wasm |
| `-background` | setting | `background` | wasm |
| `-bias` | setting | `bias` | wasm |
| `-bilateral-blur` | operator | `bilateralBlur` | wasm |
| `-black-point-compensation` | setting | `blackPointCompensation` | wasm |
| `-black-threshold` | operator | `blackThreshold` | wasm |
| `-blue-primary` | setting | `bluePrimary` | wasm |
| `-blue-shift` | operator | `blueShift` | wasm |
| `-blur` | operator | `blur` | wasm |
| `-border` | operator | `border` | wasm |
| `-bordercolor` | operator | `bordercolor` | wasm |
| `-brightness-contrast` | operator | `brightnessContrast` | wasm |
| `-canny` | operator | `canny` | wasm |
| `-caption` | setting | `caption` | wasm |
| `-cdl` | operator | `cdl` | wasm |
| `-channel` | operator | `channel` | wasm |
| `-channel-fx` | operator | `channelFx` | wasm |
| `-charcoal` | operator | `charcoal` | wasm |
| `-chop` | operator | `chop` | wasm |
| `-clahe` | operator | `clahe` | wasm |
| `-clamp` | operator | `clamp` | wasm |
| `-clip` | setting | `clip` | wasm |
| `-clip-mask` | setting | `clipMask` | wasm |
| `-clip-path` | setting | `clipPath` | wasm |
| `-clone` | stack | `clone` | wasm |
| `-clut` | sequence | `clut` | wasm |
| `-coalesce` | sequence | `coalesce` | wasm |
| `-color-matrix` | operator | `colorMatrix` | wasm |
| `-colorize` | operator | `colorize` | wasm |
| `-colors` | operator | `colors` | wasm |
| `-colorspace` | setting | `colorspace` | wasm |
| `-combine` | sequence | `combine` | wasm |
| `-comment` | setting | `comment` | wasm |
| `-compare` | sequence | `compare` | wasm |
| `-compose` | setting | `compose` | wasm |
| `-composite` | sequence | `composite` | wasm |
| `-compress` | setting | `compress` | wasm |
| `-contrast` | operator | `contrast` | wasm |
| `-contrast-stretch` | operator | `contrastStretch` | wasm |
| `-convolve` | operator | `convolve` | wasm |
| `-copy` | sequence | `copy` | wasm |
| `-crop` | sequence | `crop` | wasm |
| `-cycle` | operator | `cycle` | wasm |
| `-deconstruct` | sequence | `deconstruct` | wasm |
| `-define` | setting | `define` | wasm |
| `-delay` | setting | `delay` | wasm |
| `-delete` | stack | `delete` | wasm |
| `-density` | setting | `density` | wasm |
| `-depth` | setting | `depth` | wasm |
| `-deskew` | operator | `deskew` | wasm |
| `-despeckle` | operator | `despeckle` | wasm |
| `-direction` | setting | `direction` | wasm |
| `-dispose` | setting | `dispose` | wasm |
| `-distort` | operator | `distort` | wasm |
| `-dither` | setting | `dither` | wasm |
| `-draw` | operator | `draw` | wasm |
| `-duplicate` | stack | `duplicate` | wasm |
| `-edge` | operator | `edge` | wasm |
| `-emboss` | operator | `emboss` | wasm |
| `-encoding` | setting | `encoding` | wasm |
| `-endian` | setting | `endian` | wasm |
| `-enhance` | operator | `enhance` | wasm |
| `-equalize` | operator | `equalize` | wasm |
| `-evaluate` | operator | `evaluate` | wasm |
| `-evaluate-sequence` | sequence | `evaluateSequence` | wasm |
| `-extent` | operator | `extent` | wasm |
| `-extract` | operator | `extract` | wasm |
| `-family` | setting | `family` | wasm |
| `-features` | setting | `features` | wasm |
| `-fill` | setting | `fill` | wasm |
| `-filter` | setting | `filter` | wasm |
| `-flatten` | sequence | `flatten` | wasm |
| `-flip` | operator | `flip` | wasm |
| `-floodfill` | operator | `floodfill` | wasm |
| `-flop` | operator | `flop` | wasm |
| `-font` | setting | `font` | wasm |
| `-format` | setting | `format` | wasm |
| `-frame` | operator | `frame` | wasm |
| `-function` | operator | `function` | wasm |
| `-fuzz` | setting | `fuzz` | wasm |
| `-fx` | sequence | `fx` | wasm |
| `-gamma` | operator | `gamma` | wasm |
| `-gaussian-blur` | operator | `gaussianBlur` | wasm |
| `-geometry` | operator | `geometry` | wasm |
| `-gravity` | setting | `gravity` | wasm |
| `-grayscale` | operator | `grayscale` | wasm |
| `-green-primary` | setting | `greenPrimary` | wasm |
| `-hald-clut` | sequence | `haldClut` | wasm |
| `-identify` | operator | `identify` | wasm |
| `-illuminant` | setting | `illuminant` | wasm |
| `-implode` | operator | `implode` | wasm |
| `-insert` | stack | `insert` | wasm |
| `-intensity` | setting | `intensity` | wasm |
| `-intent` | setting | `intent` | wasm |
| `-interlace` | setting | `interlace` | wasm |
| `-interline-spacing` | setting | `interlineSpacing` | wasm |
| `-interpolate` | setting | `interpolate` | wasm |
| `-interpolative-resize` | operator | `interpolativeResize` | wasm |
| `-interword-spacing` | setting | `interwordSpacing` | wasm |
| `-kerning` | setting | `kerning` | wasm |
| `-kmeans` | operator | `kmeans` | wasm |
| `-label` | setting | `label` | wasm |
| `-lat` | operator | `lat` | wasm |
| `-layers` | sequence | `layers` | wasm |
| `-level` | operator | `level` | wasm |
| `-level-colors` | operator | `levelColors` | wasm |
| `-limit` | setting | `limit` | wasm |
| `-linear-stretch` | operator | `linearStretch` | wasm |
| `-local-contrast` | operator | `localContrast` | wasm |
| `-loop` | setting | `loop` | wasm |
| `-matte` | setting | `matte` | wasm |
| `-mattecolor` | setting | `mattecolor` | wasm |
| `-median` | operator | `median` | wasm |
| `-mode` | operator | `mode` | wasm |
| `-modulate` | operator | `modulate` | wasm |
| `-moments` | setting | `moments` | wasm |
| `-monochrome` | operator | `monochrome` | wasm |
| `-morph` | sequence | `morph` | wasm |
| `-morphology` | operator | `morphology` | wasm |
| `-mosaic` | sequence | `mosaic` | wasm |
| `-motion-blur` | operator | `motionBlur` | wasm |
| `-negate` | operator | `negate` | wasm |
| `-noise` | operator | `noise` | wasm |
| `-normalize` | operator | `normalize` | wasm |
| `-opaque` | operator | `opaque` | wasm |
| `-ordered-dither` | operator | `orderedDither` | wasm |
| `-orient` | setting | `orient` | wasm |
| `-page` | setting | `page` | wasm |
| `-paint` | operator | `paint` | wasm |
| `-perceptible` | operator | `perceptible` | wasm |
| `-ping` | setting | `ping` | wasm |
| `-pointsize` | setting | `pointsize` | wasm |
| `-polaroid` | operator | `polaroid` | wasm |
| `-posterize` | operator | `posterize` | wasm |
| `-precision` | setting | `precision` | wasm |
| `-profile` | operator | `profile` | wasm |
| `-quality` | setting | `quality` | wasm |
| `-quantize` | operator | `quantize` | wasm |
| `-quiet` | setting | `quiet` | wasm |
| `-raise` | operator | `raise` | wasm |
| `-random-threshold` | operator | `randomThreshold` | wasm |
| `-range-threshold` | operator | `rangeThreshold` | wasm |
| `-read-mask` | setting | `readMask` | wasm |
| `-red-primary` | setting | `redPrimary` | wasm |
| `-region` | operator | `region` | wasm |
| `-remap` | setting | `remap` | wasm |
| `-render` | operator | `render` | wasm |
| `-repage` | setting | `repage` | wasm |
| `-resample` | operator | `resample` | wasm |
| `-reshape` | operator | `reshape` | wasm |
| `-resize` | operator | `resize` | wasm |
| `-reverse` | stack | `reverse` | wasm |
| `-roll` | operator | `roll` | wasm |
| `-rotate` | operator | `rotate` | wasm |
| `-rotational-blur` | operator | `rotationalBlur` | wasm |
| `-sample` | operator | `sample` | wasm |
| `-sampling-factor` | setting | `samplingFactor` | wasm |
| `-scale` | operator | `scale` | wasm |
| `-scene` | setting | `scene` | wasm |
| `-seed` | setting | `seed` | wasm |
| `-selective-blur` | operator | `selectiveBlur` | wasm |
| `-separate` | operator | `separate` | wasm |
| `-sepia-tone` | operator | `sepiaTone` | wasm |
| `-set` | operator | `set` | wasm |
| `-shade` | operator | `shade` | wasm |
| `-shadow` | operator | `shadow` | wasm |
| `-sharpen` | operator | `sharpen` | wasm |
| `-shave` | operator | `shave` | wasm |
| `-shear` | operator | `shear` | wasm |
| `-sigmoidal-contrast` | operator | `sigmoidalContrast` | wasm |
| `-size` | setting | `size` | wasm |
| `-sketch` | operator | `sketch` | wasm |
| `-smush` | sequence | `smush` | wasm |
| `-solarize` | operator | `solarize` | wasm |
| `-sparse-color` | operator | `sparseColor` | wasm |
| `-splice` | operator | `splice` | wasm |
| `-spread` | operator | `spread` | wasm |
| `-statistic` | operator | `statistic` | wasm |
| `-stretch` | setting | `stretch` | wasm |
| `-strip` | operator | `strip` | wasm |
| `-stroke` | setting | `stroke` | wasm |
| `-strokewidth` | setting | `strokewidth` | wasm |
| `-style` | setting | `style` | wasm |
| `-support` | setting | `support` | wasm |
| `-swap` | stack | `swap` | wasm |
| `-swirl` | operator | `swirl` | wasm |
| `-taint` | setting | `taint` | wasm |
| `-texture` | setting | `texture` | wasm |
| `-threshold` | operator | `threshold` | wasm |
| `-thumbnail` | operator | `thumbnail` | wasm |
| `-tile` | operator | `tile` | wasm |
| `-tile-offset` | setting | `tileOffset` | wasm |
| `-tint` | operator | `tint` | wasm |
| `-transform` | operator | `transform` | wasm |
| `-transparent` | operator | `transparent` | wasm |
| `-transparent-color` | setting | `transparentColor` | wasm |
| `-transpose` | operator | `transpose` | wasm |
| `-transverse` | operator | `transverse` | wasm |
| `-treedepth` | setting | `treedepth` | wasm |
| `-trim` | operator | `trim` | wasm |
| `-type` | operator | `type` | wasm |
| `-undercolor` | setting | `undercolor` | wasm |
| `-unique-colors` | operator | `uniqueColors` | wasm |
| `-units` | setting | `units` | wasm |
| `-unsharp` | operator | `unsharp` | wasm |
| `-verbose` | setting | `verbose` | wasm |
| `-vignette` | operator | `vignette` | wasm |
| `-virtual-pixel` | setting | `virtualPixel` | wasm |
| `-wave` | operator | `wave` | wasm |
| `-weight` | setting | `weight` | wasm |
| `-white-balance` | operator | `whiteBalance` | wasm |
| `-white-point` | setting | `whitePoint` | wasm |
| `-white-threshold` | operator | `whiteThreshold` | wasm |
| `-write-mask` | setting | `writeMask` | wasm |
