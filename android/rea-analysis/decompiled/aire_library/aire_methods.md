# Aire Image Processing Library - 100 Methods

**Class:** `com.awxkee.aire.Aire`
**Source:** Image Toolbox.apk (v4.2.0)
**Package:** com.awxkee.aire

## All 100 Methods

### Color/Tone Operations
- `acesFilmicToneMapping(Bitmap, float)` - ACES Filmic tone mapping
- `acesHillToneMapping(Bitmap, float)` - ACES Hill tone mapping
- `aldridge(Bitmap, float, float)` - Aldridge tone mapping
- `drago(Bitmap, float, float)` - Drago tone mapping
- `hableFilmicToneMapping(Bitmap, float)` - Hable tone mapping
- `hejlBurgessToneMapping(Bitmap, float)` - Hejl-Burgess tone mapping
- `logarithmicToneMapping(Bitmap, float)` - Logarithmic tone mapping
- `brightness(Bitmap, float)` - Brightness adjustment
- `contrast(Bitmap, float)` - Contrast adjustment
- `gamma(Bitmap, float)` - Gamma correction
- `exposure(Bitmap, float)` - Exposure adjustment
- `saturation(Bitmap, float, boolean)` - Saturation adjustment
- `vibrance(Bitmap, float)` - Vibrance adjustment
- `whiteBalance(Bitmap, float, float)` - White balance
- `colorMatrix(Bitmap, float[])` - Color matrix transform
- `grayscale(Bitmap, float, float, float)` - Grayscale conversion
- `monochrome(Bitmap, float[], float)` - Monochrome conversion

### Blur Operations
- `gaussianBlur(Bitmap, int, int, float, float, EdgeMode, GaussianPreciseLevel)` - Gaussian blur
- `boxBlur(Bitmap, int)` - Box blur
- `bilateralBlur(Bitmap, int, float, float, EdgeMode, Scalar)` - Bilateral blur
- `fastBilateralBlur(Bitmap, int, float, float)` - Fast bilateral blur
- `stackBlur(Bitmap, int, int)` - Stack blur
- `medianBlur(Bitmap, int)` - Median blur
- `motionBlur(Bitmap, int, float, EdgeMode, Scalar)` - Motion blur
- `zoomBlur(Bitmap, int, float, float, float, float, float)` - Zoom blur
- `tiltShift(Bitmap, int, float, float, float, float)` - Tilt shift
- `horizontalTiltShift(Bitmap, int, float, float, float, float, float)` - Horizontal tilt shift
- `bokeh(Bitmap, int, int, boolean)` - Bokeh effect
- `bokehBlur(Bitmap, int, int, EdgeMode, Scalar, MorphOpMode)` - Bokeh blur
- `getBokehKernel(int, int)` - Get bokeh kernel
- `getBokehConvolutionKernel(int, int)` - Get bokeh convolution kernel
- `fastGaussian2Degree/3Degree/4Degree` - Fast Gaussian variants
- `linearGaussianBlur/linearGaussianBoxBlur/linearFastGaussian/linearStackBlur` - Linear blur variants

### Edge & Morphological
- `sobel(Bitmap, EdgeMode, Scalar)` - Sobel edge detection
- `laplacian(Bitmap, EdgeMode, Scalar)` - Laplacian edge detection
- `morphology(Bitmap, MorphOp, MorphOpMode, EdgeMode, Scalar, int[])` - Morphological operations
- `threshold(Bitmap, int)` - Thresholding
- `emboss(Bitmap, float)` - Emboss effect
- `convolve2D(Bitmap, float[], Lut8, EdgeMode, Scalar, MorphOpMode)` - 2D convolution

### Special Effects
- `glitch(Bitmap, float, float, float, int, float, float)` - Glitch effect
- `grain(Bitmap, float)` - Grain/noise
- `crystallize(Bitmap, int, int)` - Crystallize effect
- `fractalGlass(Bitmap, float, float)` - Fractal glass
- `marble(Bitmap, float, float, float)` - Marble effect
- `mobius(Bitmap, float, float, float)` - Möbius transform
- `oil(Bitmap, int, float)` - Oil paint effect
- `perlinDistortion(Bitmap, float, float, float)` - Perlin distortion
- `waterEffect(Bitmap, float, float, float, float, float)` - Water effect
- `warpAffine(Bitmap, float[], int, int)` - Affine warp
- `horizontalWindStagger(Bitmap, float, int, int)` - Wind stagger

### CLAHE (Contrast Limited Adaptive Histogram Equalization)
- `clahe(Bitmap, float, int, int)` - CLAHE
- `claheHSL/HSV/LAB/LUV/Oklab/Oklch/Jzazbz` - CLAHE in various colorspaces

### Histogram Equalization
- `equalizeHist(Bitmap)` - Standard equalize
- `equalizeHistAdaptive(HSL/HSV/LAB/LUV)` - Adaptive variants
- `equalizeHistHSL/HSV/LAB/LUV` - Colorspace variants
- `equalizeHistSquares(Bitmap, int, int)` - Squares variant

### Other
- `dehaze(Bitmap, int, float)` - Dehaze
- `removeShadows(Bitmap, int)` - Remove shadows
- `sharpness(Bitmap, int)` - Sharpness
- `unsharp(Bitmap, float)` - Unsharp mask
- `rotate(Bitmap, float, int, int, int, int)` - Rotate
- `scale(Bitmap, int, int, ResizeFunction, ScaleColorSpace)` - Scale
- `crop(Bitmap, int, int, int, int)` - Crop
- `copyPalette(Bitmap, Bitmap, float, PaletteTransferColorspace)` - Copy palette
- `palette(Bitmap, int, AireQuantize, AirePaletteDithering, AireColorMapper)` - Palette quantization
- `toPNG(Bitmap, int, AireQuantize, AirePaletteDithering, AireColorMapper, int)` - PNG export
- `mozjpeg(Bitmap, int)` - MozJPEG compression
- `initializeLibrary()` - Library initialization
- `Yuv420NV21ToBGR/RGBA(ByteBuffer, int, ByteBuffer, int, int, int)` - YUV conversion

## Helper Classes
- `com.awxkee.aire.AireColorMapper` - Color mapping
- `com.awxkee.aire.AirePaletteDithering` - Palette dithering
- `com.awxkee.aire.AireQuantize` - Quantization
- `com.awxkee.aire.EdgeMode` - Edge handling mode
- `com.awxkee.aire.Scalar` - Scalar value
- `com.awxkee.aire.MorphOpMode` - Morphological operation mode
- `com.awxkee.aire.Lut8` - 8-bit lookup table
- `com.awxkee.aire.TransferFunction` - Transfer function
- `com.awxkee.aire.ResizeFunction` - Resize function
- `com.awxkee.aire.ScaleColorSpace` - Scale color space
- `com.awxkee.aire.GaussianPreciseLevel` - Gaussian precision level
