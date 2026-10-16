// node_modules/.pnpm/@imagemagick+magick-wasm@0.0.44/node_modules/@imagemagick/magick-wasm/dist/index.js
function e(e29) {
  return e29 instanceof Int8Array || e29 instanceof Uint8Array || e29 instanceof Uint8ClampedArray;
}
var t = class {
  fileName;
  data;
  constructor(e29, t3) {
    this.fileName = e29, this.data = t3;
  }
};
var n = { XmlResourceFiles: {
  log: '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE logmap [\n<!ELEMENT logmap (log)+>\n<!ELEMENT log (#PCDATA)>\n<!ATTLIST log events CDATA #IMPLIED>\n<!ATTLIST log output CDATA #IMPLIED>\n<!ATTLIST log filename CDATA #IMPLIED>\n<!ATTLIST log generations CDATA #IMPLIED>\n<!ATTLIST log limit CDATA #IMPLIED>\n<!ATTLIST log format CDATA #IMPLIED>\n]>\n<logmap>\n  <log events="None"/>\n  <log output="Debug"/>\n  <log filename="Magick-%g.log"/>\n  <log generations="3"/>\n  <log limit="2000"/>\n  <log format="%t %r %u %v %d %c[%p]: %m/%f/%l/%d\n  %e"/>\n</logmap>\n',
  policy: '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE policymap [\n<!ELEMENT policymap (policy)*>\n<!ATTLIST policymap xmlns CDATA #FIXED "">\n<!ELEMENT policy EMPTY>\n<!ATTLIST policy xmlns CDATA #FIXED "">\n<!ATTLIST policy domain NMTOKEN #REQUIRED>\n<!ATTLIST policy name NMTOKEN #IMPLIED>\n<!ATTLIST policy pattern CDATA #IMPLIED>\n<!ATTLIST policy rights NMTOKEN #IMPLIED>\n<!ATTLIST policy stealth NMTOKEN #IMPLIED>\n<!ATTLIST policy value CDATA #IMPLIED>\n]>\n<policymap>\n  <policy domain="cache" name="shared-secret" value="passphrase"/>\n  <policy domain="coder" rights="none" pattern="EPHEMERAL" />\n  <policy domain="coder" rights="none" pattern="MVG" />\n  <policy domain="coder" rights="none" pattern="MSL" />\n  <policy domain="path" rights="none" pattern="@*" />\n  <policy domain="path" rights="none" pattern="|*" />\n</policymap>\n'
} };
var r = class e2 {
  constructor() {
    this.log = new t("log.xml", n.XmlResourceFiles.log), this.policy = new t("policy.xml", n.XmlResourceFiles.policy);
  }
  static default = new e2();
  *all() {
    yield this.log, yield this.policy;
  }
  log;
  policy;
};
var p = class {
  constructor(e29, t3) {
    this.eventType = e29, this.message = t3 ?? "";
  }
  eventType;
  message;
};
var m = {
  Undefined: 0,
  Activate: 1,
  Associate: 2,
  Background: 3,
  Copy: 4,
  Deactivate: 5,
  Discrete: 6,
  Disassociate: 7,
  Extract: 8,
  Off: 9,
  On: 10,
  Opaque: 11,
  Remove: 12,
  Set: 13,
  Shape: 14,
  Transparent: 15,
  OffIfOpaque: 16
};
var h = {
  Red: 0,
  Cyan: 0,
  Gray: 0,
  Green: 1,
  Magenta: 1,
  Blue: 2,
  Yellow: 2,
  Black: 3,
  Alpha: 4,
  Index: 5,
  Meta0: 10,
  Meta1: 11,
  Meta2: 12,
  Meta3: 13,
  Meta4: 14,
  Meta5: 15,
  Meta6: 16,
  Meta7: 17,
  Meta8: 18,
  Meta9: 19,
  Meta10: 20,
  Meta11: 21,
  Meta12: 22,
  Meta13: 23,
  Meta14: 24,
  Meta15: 25,
  Meta16: 26,
  Meta17: 27,
  Meta18: 28,
  Meta19: 29,
  Meta20: 30,
  Meta21: 31,
  Meta22: 32,
  Meta23: 33,
  Meta24: 34,
  Meta25: 35,
  Meta26: 36,
  Meta27: 37,
  Meta28: 38,
  Meta29: 39,
  Meta30: 40,
  Meta31: 41,
  Meta32: 42,
  Meta33: 43,
  Meta34: 44,
  Meta35: 45,
  Meta36: 46,
  Meta37: 47,
  Meta38: 48,
  Meta39: 49,
  Meta40: 50,
  Meta41: 51,
  Meta42: 52,
  Meta43: 53,
  Meta44: 54,
  Meta45: 55,
  Meta46: 56,
  Meta47: 57,
  Meta48: 58,
  Meta49: 59,
  Meta50: 60,
  Meta51: 61,
  Meta52: 62,
  Composite: 64
};
var g = {
  Undefined: 0,
  Red: 1,
  Gray: 1,
  Cyan: 1,
  Green: 2,
  Magenta: 2,
  Blue: 4,
  Yellow: 4,
  Black: 8,
  Alpha: 16,
  Opacity: 16,
  Index: 32,
  Composite: 31,
  TrueAlpha: 256,
  get RGB() {
    return this.Red | this.Green | this.Blue;
  },
  get CMYK() {
    return this.Cyan | this.Magenta | this.Yellow | this.Black;
  },
  get CMYKA() {
    return this.Cyan | this.Magenta | this.Yellow | this.Black | this.Alpha;
  },
  Meta0: 1 << h.Meta0,
  Meta1: 1 << h.Meta1,
  Meta2: 1 << h.Meta2,
  Meta3: 1 << h.Meta3,
  Meta4: 1 << h.Meta4,
  Meta5: 1 << h.Meta5,
  Meta6: 1 << h.Meta6,
  Meta7: 1 << h.Meta7,
  Meta8: 1 << h.Meta8,
  Meta9: 1 << h.Meta9,
  Meta10: 1 << h.Meta10,
  Meta11: 1 << h.Meta11,
  Meta12: 1 << h.Meta12,
  Meta13: 1 << h.Meta13,
  Meta14: 1 << h.Meta14,
  Meta15: 1 << h.Meta15,
  Meta16: 1 << h.Meta16,
  Meta17: 1 << h.Meta17,
  Meta18: 1 << h.Meta18,
  Meta19: 1 << h.Meta19,
  Meta20: 1 << h.Meta20,
  Meta21: 1 << h.Meta21,
  All: 134217727
};
var ee = class {
  constructor(e29, t3, n2, r2) {
    this.red = e29, this.green = t3, this.blue = n2, this.white = r2;
  }
  red;
  green;
  blue;
  white;
};
var _ = {
  Undefined: 0,
  CMY: 1,
  CMYK: 2,
  Gray: 3,
  HCL: 4,
  HCLp: 5,
  HSB: 6,
  HSI: 7,
  HSL: 8,
  HSV: 9,
  HWB: 10,
  Lab: 11,
  LCH: 12,
  LCHab: 13,
  LCHuv: 14,
  Log: 15,
  LMS: 16,
  Luv: 17,
  OHTA: 18,
  Rec601YCbCr: 19,
  Rec709YCbCr: 20,
  RGB: 21,
  scRGB: 22,
  sRGB: 23,
  Transparent: 24,
  XyY: 25,
  XYZ: 26,
  YCbCr: 27,
  YCC: 28,
  YDbDr: 29,
  YIQ: 30,
  YPbPr: 31,
  YUV: 32,
  LinearGray: 33,
  Jzazbz: 34,
  DisplayP3: 35,
  Adobe98: 36,
  ProPhoto: 37,
  Oklab: 38,
  Oklch: 39,
  CAT02LMSC: 40
};
var te = {
  [_.Undefined]: "Undefined",
  [_.CMY]: "CMY",
  [_.CMYK]: "CMYK",
  [_.Gray]: "Gray",
  [_.HCL]: "HCL",
  [_.HCLp]: "HCLp",
  [_.HSB]: "HSB",
  [_.HSI]: "HSI",
  [_.HSL]: "HSL",
  [_.HSV]: "HSV",
  [_.HWB]: "HWB",
  [_.Lab]: "Lab",
  [_.LCH]: "LCH",
  [_.LCHab]: "LCHab",
  [_.LCHuv]: "LCHuv",
  [_.Log]: "Log",
  [_.LMS]: "LMS",
  [_.Luv]: "Luv",
  [_.OHTA]: "OHTA",
  [_.Rec601YCbCr]: "Rec601YCbCr",
  [_.Rec709YCbCr]: "Rec709YCbCr",
  [_.RGB]: "RGB",
  [_.scRGB]: "scRGB",
  [_.sRGB]: "sRGB",
  [_.Transparent]: "Transparent",
  [_.XyY]: "XyY",
  [_.XYZ]: "XYZ",
  [_.YCbCr]: "YCbCr",
  [_.YCC]: "YCC",
  [_.YDbDr]: "YDbDr",
  [_.YIQ]: "YIQ",
  [_.YPbPr]: "YPbPr",
  [_.YUV]: "YUV",
  [_.LinearGray]: "LinearGray",
  [_.Jzazbz]: "Jzazbz",
  [_.DisplayP3]: "DisplayP3",
  [_.Adobe98]: "Adobe98",
  [_.ProPhoto]: "ProPhoto",
  [_.Oklab]: "Oklab",
  [_.Oklch]: "Oklch",
  [_.CAT02LMSC]: "CAT02LMS"
};
var ne = class {
  colorSpace = _.Undefined;
  copyright = null;
  description = null;
  manufacturer = null;
  model = null;
};
var re = class {
  _data;
  _index;
  constructor(e29) {
    this._data = e29, this._index = 0, this.isLittleEndian = false;
  }
  get index() {
    return this._index;
  }
  isLittleEndian;
  readLong() {
    return this.canRead(4) ? this.isLittleEndian ? this.readLongLSB() : this.readLongMSB() : null;
  }
  readString(e29) {
    if (e29 == 0) return "";
    if (!this.canRead(e29)) return null;
    let t3 = new TextDecoder("utf-8").decode(this._data.subarray(this._index, this._index + e29)), n2 = t3.indexOf("\0");
    return n2 != -1 && (t3 = t3.substring(0, n2)), this._index += e29, t3;
  }
  seek(e29) {
    return e29 >= this._data.length ? false : (this._index = e29, true);
  }
  skip(e29) {
    return this._index + e29 >= this._data.length ? false : (this._index += e29, true);
  }
  canRead(e29) {
    return e29 > this._data.length ? false : this._index + e29 <= this._data.length;
  }
  readLongLSB() {
    let e29 = this._data[this._index];
    return e29 |= this._data[this._index + 1] << 8, e29 |= this._data[this._index + 2] << 16, e29 |= this._data[this._index + 3] << 24, this._index += 4, e29;
  }
  readLongMSB() {
    let e29 = this._data[this._index] << 24;
    return e29 |= this._data[this._index + 1] << 16, e29 |= this._data[this._index + 2] << 8, e29 |= this._data[this._index + 3], this._index += 4, e29;
  }
};
var v = class e3 {
  _data = new ne();
  _reader;
  constructor(e29) {
    this._reader = new re(e29);
  }
  static read(t3) {
    let n2 = new e3(t3);
    return n2.readColorSpace(), n2.readTagTable(), n2._data;
  }
  readColorSpace() {
    this._reader.seek(16);
    let e29 = this._reader.readString(4);
    e29 != null && (this._data.colorSpace = this.determineColorSpace(e29.trimEnd()));
  }
  determineColorSpace(e29) {
    switch (e29) {
      case "CMY":
        return _.CMY;
      case "CMYK":
        return _.CMYK;
      case "GRAY":
        return _.Gray;
      case "HSL":
        return _.HSL;
      case "HSV":
        return _.HSV;
      case "Lab":
        return _.Lab;
      case "Luv":
        return _.Luv;
      case "RGB":
        return _.sRGB;
      case "XYZ":
        return _.XYZ;
      case "YCbr":
        return _.YCbCr;
      default:
        return _.Undefined;
    }
  }
  readTagTable() {
    if (!this._reader.seek(128)) return;
    let e29 = this._reader.readLong();
    if (e29 != null) for (let t3 = 0; t3 < e29; t3++) switch (this._reader.readLong()) {
      case 1668313716:
        this._data.copyright = this.readTag();
        break;
      case 1684370275:
        this._data.description = this.readTag();
        break;
      case 1684893284:
        this._data.manufacturer = this.readTag();
        break;
      case 1684890724:
        this._data.model = this.readTag();
        break;
      default:
        this._reader.skip(8);
    }
  }
  readTag() {
    let e29 = this._reader.readLong(), t3 = this._reader.readLong();
    if (e29 === null || t3 === null) return null;
    let n2 = this._reader.index;
    if (!this._reader.seek(e29)) return null;
    let r2 = this.readTagValue(t3);
    return this._reader.seek(n2), r2;
  }
  readTagValue(e29) {
    switch (this._reader.readString(4)) {
      case "desc":
        return this.readTextDescriptionTypeValue();
      case "text":
        return this.readTextTypeValue(e29);
      default:
        return null;
    }
  }
  readTextDescriptionTypeValue() {
    if (!this._reader.skip(4)) return null;
    let e29 = this._reader.readLong();
    return e29 == null ? null : this._reader.readString(e29);
  }
  readTextTypeValue(e29) {
    return this._reader.skip(4) ? this._reader.readString(e29) : null;
  }
};
var ie = class {
  constructor(e29, t3) {
    this.name = e29, this.data = t3;
  }
  name;
  data;
};
var ae = class extends ie {
  _data;
  constructor(e29) {
    super("icc", e29);
  }
  get colorSpace() {
    return this.initialize(), this._data.colorSpace;
  }
  get copyright() {
    return this.initialize(), this._data.copyright;
  }
  get description() {
    return this.initialize(), this._data.description;
  }
  get manufacturer() {
    return this.initialize(), this._data.manufacturer;
  }
  get model() {
    return this.initialize(), this._data.model;
  }
  initialize() {
    this._data ||= v.read(this.data);
  }
};
var oe = {
  HighRes: 0,
  Quantum: 1
};
var se = class e4 {
  constructor(e29, t3) {
    this.distortion = e29, this.difference = t3;
  }
  difference;
  distortion;
  static _create(t3, n2) {
    return new e4(t3, n2);
  }
};
var ce = class {
  constructor(e29) {
    this.metric = e29;
  }
  metric;
  highlightColor;
  lowlightColor;
  masklightColor;
  _setArtifacts(e29) {
    this.highlightColor !== void 0 && e29.setArtifact("compare:highlight-color", this.highlightColor), this.lowlightColor !== void 0 && e29.setArtifact("compare:lowlight-color", this.lowlightColor), this.masklightColor !== void 0 && e29.setArtifact("compare:masklight-color", this.masklightColor);
  }
};
var le = {
  Undefined: 0,
  Alpha: 1,
  Atop: 2,
  Blend: 3,
  Blur: 4,
  Bumpmap: 5,
  ChangeMask: 6,
  Clear: 7,
  ColorBurn: 8,
  ColorDodge: 9,
  Colorize: 10,
  CopyBlack: 11,
  CopyBlue: 12,
  Copy: 13,
  CopyCyan: 14,
  CopyGreen: 15,
  CopyMagenta: 16,
  CopyAlpha: 17,
  CopyRed: 18,
  CopyYellow: 19,
  Darken: 20,
  DarkenIntensity: 21,
  Difference: 22,
  Displace: 23,
  Dissolve: 24,
  Distort: 25,
  DivideDst: 26,
  DivideSrc: 27,
  DstAtop: 28,
  Dst: 29,
  DstIn: 30,
  DstOut: 31,
  DstOver: 32,
  Exclusion: 33,
  HardLight: 34,
  HardMix: 35,
  Hue: 36,
  In: 37,
  Intensity: 38,
  Lighten: 39,
  LightenIntensity: 40,
  LinearBurn: 41,
  LinearDodge: 42,
  LinearLight: 43,
  Luminize: 44,
  Mathematics: 45,
  MinusDst: 46,
  MinusSrc: 47,
  Modulate: 48,
  ModulusAdd: 49,
  ModulusSubtract: 50,
  Multiply: 51,
  No: 52,
  Out: 53,
  Over: 54,
  Overlay: 55,
  PegtopLight: 56,
  PinLight: 57,
  Plus: 58,
  Replace: 59,
  Saturate: 60,
  Screen: 61,
  SoftLight: 62,
  SrcAtop: 63,
  Src: 64,
  SrcIn: 65,
  SrcOut: 66,
  SrcOver: 67,
  Threshold: 68,
  VividLight: 69,
  Xor: 70,
  Stereo: 71,
  Freeze: 72,
  Interpolate: 73,
  Negate: 74,
  Reflect: 75,
  SoftBurn: 76,
  SoftDodge: 77,
  Stamp: 78,
  RMSE: 79,
  SaliencyBlend: 80,
  SeamlessBlend: 81
};
var ue = {
  Warning: 300,
  ResourceLimitWarning: 300,
  TypeWarning: 305,
  OptionWarning: 310,
  DelegateWarning: 315,
  MissingDelegateWarning: 320,
  CorruptImageWarning: 325,
  FileOpenWarning: 330,
  BlobWarning: 335,
  StreamWarning: 340,
  CacheWarning: 345,
  CoderWarning: 350,
  FilterWarning: 352,
  ModuleWarning: 355,
  DrawWarning: 360,
  ImageWarning: 365,
  WandWarning: 370,
  RandomWarning: 375,
  XServerWarning: 380,
  MonitorWarning: 385,
  RegistryWarning: 390,
  ConfigureWarning: 395,
  PolicyWarning: 399,
  Error: 400,
  ResourceLimitError: 400,
  TypeError: 405,
  OptionError: 410,
  DelegateError: 415,
  MissingDelegateError: 420,
  CorruptImageError: 425,
  FileOpenError: 430,
  BlobError: 435,
  StreamError: 440,
  CacheError: 445,
  CoderError: 450,
  FilterError: 452,
  ModuleError: 455,
  DrawError: 460,
  ImageError: 465,
  WandError: 470,
  RandomError: 475,
  XServerError: 480,
  MonitorError: 485,
  RegistryError: 490,
  ConfigureError: 495,
  PolicyError: 499
};
var y = class extends Error {
  _relatedErrors = [];
  constructor(e29, t3 = ue.Error) {
    super(e29), this.severity = t3;
  }
  severity;
  get relatedErrors() {
    return this._relatedErrors;
  }
  _setRelatedErrors(e29) {
    this._relatedErrors = e29;
  }
};
var de = class {
  static get depth() {
    return Number(R._api._Quantum_Depth_Get());
  }
  static get max() {
    return R._api._Quantum_Max_Get();
  }
};
function b(e29, t3) {
  return e29 === R._api._NullPointer ? t3 ?? null : x(e29);
}
function x(e29) {
  return R._api.UTF8ToString(Number(e29));
}
function S(e29, t3) {
  let n2 = b(t3);
  return e29._MagickMemory_Relinquish(t3), n2;
}
function fe(e29, t3, n2) {
  let r2 = e29.lengthBytesUTF8(t3) + 1, i = e29._malloc(r2);
  try {
    return e29.stringToUTF8(t3, i, r2), n2(e29._CastToSize(i));
  } finally {
    e29._free(i);
  }
}
function C(e29, t3) {
  return e29 === null ? t3(R._api._NullPointer) : fe(R._api, e29, t3);
}
var w = class e5 {
  constructor(e29, t3, n2, r2, i) {
    if (e29 !== void 0) {
      if (typeof e29 == "string") {
        let t4 = R._api._NullPointer;
        try {
          t4 = R._api._MagickColor_Create(), C(e29, (e30) => {
            if (R._api._MagickColor_Initialize(t4, e30) === 0) throw new y("invalid color specified");
            this.initialize(t4);
          });
        } finally {
          R._api._free(Number(t4));
        }
      } else this.r = e29, this.g = t3 ?? 0, this.b = n2 ?? 0, i === void 0 ? this.a = r2 ?? de.max : (this.k = r2 ?? 0, this.a = i, this.isCmyk = true);
    }
  }
  r = 0;
  g = 0;
  b = 0;
  a = 0;
  k = 0;
  isCmyk = false;
  static _create(t3) {
    let n2 = new e5();
    return n2.initialize(t3), n2;
  }
  fuzzyEquals(e29, t3) {
    return e29 == this || this._use((n2) => e29._use((e30) => R._api._MagickColor_FuzzyEquals(n2, e30, t3._toQuantum()) === 1));
  }
  toShortString() {
    return this.a === de.max ? this.isCmyk ? `cmyka(${this.r},${this.g},${this.b},${this.k})` : `#${this.toHex(this.r)}${this.toHex(this.g)}${this.toHex(this.b)}` : this.toString();
  }
  toString() {
    return this.isCmyk ? `cmyka(${this.r},${this.g},${this.b},${this.k},${(this.a / de.max).toFixed(4)})` : `#${this.toHex(this.r)}${this.toHex(this.g)}${this.toHex(this.b)}${this.toHex(this.a)}`;
  }
  _use(e29) {
    let t3 = R._api._NullPointer;
    try {
      return t3 = R._api._MagickColor_Create(), R._api._MagickColor_Red_Set(t3, this.r), R._api._MagickColor_Green_Set(t3, this.g), R._api._MagickColor_Blue_Set(t3, this.b), R._api._MagickColor_Alpha_Set(t3, this.a), this.isCmyk ? (R._api._MagickColor_Black_Set(t3, this.k), R._api._MagickColor_IsCMYK_Set(t3, 1)) : R._api._MagickColor_IsCMYK_Set(t3, 0), e29(t3);
    } finally {
      R._api._MagickColor_Dispose(t3);
    }
  }
  initialize(e29) {
    this.r = R._api._MagickColor_Red_Get(e29), this.g = R._api._MagickColor_Green_Get(e29), this.b = R._api._MagickColor_Blue_Get(e29), this.a = R._api._MagickColor_Alpha_Get(e29), this.isCmyk = R._api._MagickColor_IsCMYK_Get(e29) === 1, this.isCmyk && (this.k = R._api._MagickColor_Black_Get(e29));
  }
  toHex(e29) {
    return e29.toString(16).padStart(2, "0");
  }
};
var pe = /* @__PURE__ */ (function(e29) {
  return e29[e29.NoValue = 0] = "NoValue", e29[e29.PercentValue = 4096] = "PercentValue", e29[e29.IgnoreAspectRatio = 8192] = "IgnoreAspectRatio", e29[e29.Less = 16384] = "Less", e29[e29.Greater = 32768] = "Greater", e29[e29.FillArea = 65536] = "FillArea", e29[e29.LimitPixels = 131072] = "LimitPixels", e29[e29.AspectRatio = 1048576] = "AspectRatio", e29;
})({});
function T(e29) {
  return R._api._CastToSize(e29);
}
var E = class e6 {
  _includeXyInToString;
  _width = 0;
  _height = 0;
  _x = 0;
  _y = 0;
  _aspectRatio = false;
  _fillArea = false;
  _greater = false;
  _isPercentage = false;
  _ignoreAspectRatio = false;
  _less = false;
  _limitPixels = false;
  constructor(e29, t3, n2, r2) {
    if (typeof e29 == "string") {
      this._includeXyInToString = e29.indexOf("+") >= 0 || e29.indexOf("-") >= 0;
      let t4 = R._api._MagickGeometry_Create();
      try {
        C(e29, (n3) => {
          let r3 = R._api._MagickGeometry_Initialize(t4, n3);
          if (r3 === pe.NoValue) throw new y("invalid geometry specified");
          this.hasFlag(r3, pe.AspectRatio) ? this.initializeFromAspectRation(t4, e29) : this.initialize(t4, r3);
        });
      } finally {
        R._api._MagickGeometry_Dispose(t4);
      }
    } else {
      if (n2 !== void 0 && r2 !== void 0 ? (this._width = n2, this._height = r2, this._x = e29, this._y = t3 ?? 0, this._includeXyInToString = true) : (this._width = e29, this._height = t3 ?? this._width, this._x = 0, this._y = 0, this._includeXyInToString = false), this._width < 0) throw new y("negative width is not allowed");
      if (this._height < 0) throw new y("negative height is not allowed");
    }
  }
  get aspectRatio() {
    return this._aspectRatio;
  }
  get fillArea() {
    return this._fillArea;
  }
  set fillArea(e29) {
    this._fillArea = e29;
  }
  get greater() {
    return this._greater;
  }
  set greater(e29) {
    this._greater = e29;
  }
  get height() {
    return this._height;
  }
  set height(e29) {
    this._height = e29;
  }
  get ignoreAspectRatio() {
    return this._ignoreAspectRatio;
  }
  set ignoreAspectRatio(e29) {
    this._ignoreAspectRatio = e29;
  }
  get isPercentage() {
    return this._isPercentage;
  }
  set isPercentage(e29) {
    this._isPercentage = e29;
  }
  get less() {
    return this._less;
  }
  set less(e29) {
    this._less = e29;
  }
  get limitPixels() {
    return this._limitPixels;
  }
  set limitPixels(e29) {
    this._limitPixels = e29;
  }
  get width() {
    return this._width;
  }
  set width(e29) {
    this._width = e29;
  }
  get x() {
    return this._x;
  }
  set x(e29) {
    this._x = e29;
  }
  get y() {
    return this._y;
  }
  set y(e29) {
    this._y = e29;
  }
  toString() {
    if (this._aspectRatio) return this._width + ":" + this._height;
    let e29 = "";
    return this._width == 0 && this._height == 0 ? e29 += "0x0" : (this._width > 0 && (e29 += this._width.toString()), this._height > 0 ? e29 += "x" + this._height.toString() : e29 += "x"), (this._x != 0 || this._y != 0 || this._includeXyInToString) && (this._x >= 0 && (e29 += "+"), e29 += this._x, this.y >= 0 && (e29 += "+"), e29 += this.y), this._fillArea && (e29 += "^"), this._greater && (e29 += ">"), this._isPercentage && (e29 += "%"), this._ignoreAspectRatio && (e29 += "!"), this._less && (e29 += "<"), this._limitPixels && (e29 += "@"), e29;
  }
  static _fromRectangle(t3) {
    if (t3 === R._api._NullPointer) throw new y("unable to allocate memory");
    try {
      let n2 = Number(R._api._MagickRectangle_Width_Get(t3)), r2 = Number(R._api._MagickRectangle_Height_Get(t3)), i = Number(R._api._MagickRectangle_X_Get(t3)), a = Number(R._api._MagickRectangle_Y_Get(t3));
      return new e6(i, a, n2, r2);
    } finally {
      R._api._MagickRectangle_Dispose(t3);
    }
  }
  _toRectangle(e29) {
    let t3 = R._api._MagickRectangle_Create();
    if (t3 === R._api._NullPointer) throw new y("unable to allocate memory");
    try {
      return R._api._MagickRectangle_Width_Set(t3, T(this._width)), R._api._MagickRectangle_Height_Set(t3, T(this._height)), R._api._MagickRectangle_X_Set(t3, T(this._x)), R._api._MagickRectangle_Y_Set(t3, T(this._y)), e29(t3);
    } finally {
      R._api._MagickRectangle_Dispose(t3);
    }
  }
  initialize(e29, t3) {
    this._width = Number(R._api._MagickGeometry_Width_Get(e29)), this._height = Number(R._api._MagickGeometry_Height_Get(e29)), this._x = Number(R._api._MagickGeometry_X_Get(e29)), this._y = Number(R._api._MagickGeometry_Y_Get(e29)), this._ignoreAspectRatio = this.hasFlag(t3, pe.IgnoreAspectRatio), this._isPercentage = this.hasFlag(t3, pe.PercentValue), this._fillArea = this.hasFlag(t3, pe.FillArea), this._greater = this.hasFlag(t3, pe.Greater), this._less = this.hasFlag(t3, pe.Less), this._limitPixels = this.hasFlag(t3, pe.LimitPixels);
  }
  initializeFromAspectRation(e29, t3) {
    this._aspectRatio = true;
    let n2 = t3.split(":");
    this._width = this.parseNumber(n2[0]), this._height = this.parseNumber(n2[1]), this._x = Number(R._api._MagickGeometry_X_Get(e29)), this._y = Number(R._api._MagickGeometry_Y_Get(e29));
  }
  parseNumber(e29) {
    let t3 = 0;
    for (; t3 < e29.length && !this.isNumber(e29[t3]); ) t3++;
    let n2 = t3;
    for (; t3 < e29.length && this.isNumber(e29[t3]); ) t3++;
    return parseInt(e29.substr(n2, t3 - n2));
  }
  isNumber(e29) {
    return e29 >= "0" && e29 <= "9";
  }
  hasFlag(e29, t3) {
    return (e29 & t3) === t3;
  }
};
var me = class e7 {
  constructor(e29, t3) {
    this.x = e29, this.y = t3 ?? e29;
  }
  x;
  y;
  static _create(t3) {
    return t3 === R._api._NullPointer ? new e7(0, 0) : new e7(R._api._PointInfo_X_Get(t3), R._api._PointInfo_Y_Get(t3));
  }
};
var he = class e8 {
  constructor(e29) {
    this.area = Number(R._api._ConnectedComponent_GetArea(e29)), this.centroid = me._create(R._api._ConnectedComponent_GetCentroid(e29)), this.color = w._create(R._api._ConnectedComponent_GetColor(e29)), this.height = Number(R._api._ConnectedComponent_GetHeight(e29)), this.id = Number(R._api._ConnectedComponent_GetId(e29)), this.width = Number(R._api._ConnectedComponent_GetWidth(e29)), this.x = Number(R._api._ConnectedComponent_GetX(e29)), this.y = Number(R._api._ConnectedComponent_GetY(e29));
  }
  area;
  centroid;
  color;
  height;
  id;
  width;
  x;
  y;
  static _create(t3, n2) {
    let r2 = [];
    if (t3 === R._api._NullPointer) return r2;
    for (let i = 0; i < n2; i++) {
      let n3 = R._api._ConnectedComponent_GetInstance(t3, T(i));
      n3 === R._api._NullPointer || R._api._ConnectedComponent_GetArea(n3) < 2 ** -52 || r2.push(new e8(n3));
    }
    return r2;
  }
  toGeometry() {
    return new E(this.x, this.y, this.width, this.height);
  }
};
var ge = class {
  angleThreshold;
  areaThreshold;
  circularityThreshold;
  connectivity;
  diameterThreshold;
  eccentricityThreshold;
  majorAxisThreshold;
  meanColor;
  minorAxisThreshold;
  perimeterThreshold;
  constructor(e29) {
    this.connectivity = e29;
  }
  _setArtifacts(e29) {
    this.angleThreshold !== void 0 && e29.setArtifact("connected-components:angle-threshold", this.angleThreshold.toString()), this.areaThreshold !== void 0 && e29.setArtifact("connected-components:area-threshold", this.areaThreshold.toString()), this.circularityThreshold !== void 0 && e29.setArtifact("connected-components:circularity-threshold", this.circularityThreshold.toString()), this.diameterThreshold !== void 0 && e29.setArtifact("connected-components:diameter-threshold", this.diameterThreshold.toString()), this.eccentricityThreshold !== void 0 && e29.setArtifact("connected-components:eccentricity-threshold", this.eccentricityThreshold.toString()), this.majorAxisThreshold !== void 0 && e29.setArtifact("connected-components:major-axis-threshold", this.majorAxisThreshold.toString()), this.meanColor !== void 0 && e29.setArtifact("connected-components:mean-color", this.meanColor.toString()), this.minorAxisThreshold !== void 0 && e29.setArtifact("connected-components:minor-axis-threshold", this.minorAxisThreshold.toString()), this.perimeterThreshold !== void 0 && e29.setArtifact("connected-components:perimeter-threshold", this.perimeterThreshold.toString());
  }
};
var D = {
  Undefined: 0,
  PixelsPerInch: 1,
  PixelsPerCentimeter: 2
};
var _e = class e9 {
  constructor(e29, t3, n2) {
    t3 === void 0 ? (this.x = e29, this.y = e29, this.units = D.PixelsPerInch) : n2 === void 0 ? (this.x = e29, this.y = e29, this.units = t3) : (this.x = e29, this.y = t3, this.units = n2);
  }
  x;
  y;
  units;
  toString(t3) {
    return t3 == this.units || t3 === D.Undefined || t3 === void 0 ? e9.toString(this.x, this.y, t3 ?? D.Undefined) : this.units == D.PixelsPerCentimeter && t3 == D.PixelsPerInch ? e9.toString(this.x * 2.54, this.y * 2.54, t3) : e9.toString(this.x / 2.54, this.y / 2.54, t3);
  }
  static toString(e29, t3, n2) {
    let r2 = `${e29}x${t3}`;
    switch (n2) {
      case D.PixelsPerCentimeter:
        r2 += "cm";
        break;
      case D.PixelsPerInch:
        r2 += "inch";
    }
    return r2;
  }
};
var O = class e10 {
  static _disposeAfterExecution(t3, n2) {
    try {
      let r2 = n2(t3);
      return r2 instanceof Promise ? Promise.resolve(r2).then((n3) => (t3.dispose(), e10.checkResult(t3, n3), n3)) : (t3.dispose(), e10.checkResult(t3, r2), r2);
    } catch (e29) {
      throw t3.dispose(), e29;
    }
  }
  static checkResult(e29, t3) {
    if (t3 === e29) throw new y("The result of the function cannot be the instance that has been disposed.");
    return t3;
  }
};
var ve = class {
  _pointer;
  _bytes;
  _func;
  constructor(e29, t3, n2) {
    this._pointer = e29, this._func = n2, this._bytes = R._api.HEAPU8.subarray(Number(e29), Number(e29) + t3);
  }
  func(e29) {
    return e29._bytes === void 0 ? e29._func(/* @__PURE__ */ new Uint8Array()) : e29._func(e29._bytes);
  }
  dispose() {
    this._pointer = R._api._MagickMemory_Relinquish(this._pointer);
  }
};
var ye = class {
  instance;
  type;
  constructor(e29, t3) {
    this.instance = R._api._malloc(e29), this.type = t3, R._api.setValue(this.instance, 0, this.type);
  }
  free() {
    R._api._free(this.instance);
  }
  get ptr() {
    return R._api._CastToSize(this.instance);
  }
  get value() {
    return R._api._CastToSize(R._api.getValue(this.instance, this.type));
  }
};
var be = class e11 extends ye {
  constructor() {
    super(R._api._PointerSize, "*");
  }
  static use(t3) {
    let n2 = new e11();
    try {
      return t3(n2);
    } finally {
      n2.free();
    }
  }
};
var k = class e12 {
  pointer;
  constructor(e29) {
    this.pointer = e29;
  }
  get ptr() {
    return this.pointer.ptr;
  }
  check(e29, t3) {
    return this.isError() ? t3() : e29();
  }
  static usePointer(t3, n2) {
    return be.use((r2) => {
      let i = t3(r2.ptr);
      return e12.checkException(r2, i, n2);
    });
  }
  static use(t3, n2) {
    return be.use((r2) => {
      let i = t3(new e12(r2));
      return e12.checkException(r2, i, n2);
    });
  }
  static checkException(t3, n2, r2) {
    if (!e12.isRaised(t3)) return n2;
    let i = e12.getErrorSeverity(t3.value);
    return i >= ue.Error ? e12.throw(t3, i) : r2 === void 0 ? e12.dispose(t3) : r2(e12.createError(t3.value, i)), n2;
  }
  isError() {
    return e12.isRaised(this.pointer) ? e12.getErrorSeverity(this.pointer.value) >= ue.Error : false;
  }
  static getErrorSeverity(e29) {
    return R._api._MagickExceptionHelper_Severity(e29);
  }
  static isRaised(e29) {
    return e29.value !== R._api._NullPointer;
  }
  static throw(t3, n2) {
    let r2 = e12.createError(t3.value, n2);
    throw e12.dispose(t3), r2;
  }
  static createError(t3, n2) {
    let r2 = new y(e12.getMessage(t3), n2), i = R._api._MagickExceptionHelper_RelatedCount(t3);
    if (i === R._api._NullPointer) return r2;
    let a = [];
    for (let n3 = 0; n3 < i; n3++) {
      let r3 = R._api._MagickExceptionHelper_Related(t3, T(n3)), i2 = e12.getErrorSeverity(r3), o = e12.createError(r3, i2);
      a.push(o);
    }
    return r2._setRelatedErrors(a), r2;
  }
  static getMessage(e29) {
    let t3 = R._api._MagickExceptionHelper_Message(e29), n2 = R._api._MagickExceptionHelper_Description(e29), r2 = b(t3, "Unknown error");
    return n2 !== R._api._NullPointer && (r2 += `(${x(n2)})`), r2;
  }
  static dispose(e29) {
    R._api._MagickExceptionHelper_Dispose(e29.value);
  }
};
var xe = class {
  disposeMethod;
  instance;
  constructor(e29, t3) {
    this.instance = e29, this.disposeMethod = t3;
  }
  get _instance() {
    if (this.instance !== R._api._NullPointer) return this.instance;
    throw new y("instance is disposed");
  }
  set _instance(e29) {
    this.disposeInstance(this.instance), this.instance = e29;
  }
  dispose() {
    this.instance = this.disposeInstance(this.instance);
  }
  _setInstance(e29, t3) {
    return t3.check(() => this.instance !== R._api._NullPointer && (this.dispose(), this.instance = e29, true), () => (this.disposeInstance(e29), true));
  }
  disposeInstance(e29) {
    return e29 > 0 && (this.onDispose !== void 0 && this.onDispose(), this.disposeMethod(e29)), R._api._NullPointer;
  }
};
var Se = class e13 {
  constructor(e29, t3, n2, r2, i, a, o) {
    this.ascent = e29, this.descent = t3, this.maxHorizontalAdvance = n2, this.textHeight = r2, this.textWidth = i, this.underlinePosition = a, this.underlineThickness = o;
  }
  ascent;
  descent;
  maxHorizontalAdvance;
  textHeight;
  textWidth;
  underlinePosition;
  underlineThickness;
  static _create(t3) {
    if (t3 === R._api._NullPointer) return null;
    try {
      let n2 = R._api._TypeMetric_Ascent_Get(t3), r2 = R._api._TypeMetric_Descent_Get(t3), i = R._api._TypeMetric_MaxHorizontalAdvance_Get(t3), a = R._api._TypeMetric_TextHeight_Get(t3), o = R._api._TypeMetric_TextWidth_Get(t3), s = R._api._TypeMetric_UnderlinePosition_Get(t3), c = R._api._TypeMetric_UnderlineThickness_Get(t3);
      return new e13(n2, r2, i, a, o, s, c);
    } finally {
      R._api._TypeMetric_Dispose(t3);
    }
  }
};
function Ce(e29, t3) {
  if (e29.byteLength === 0) throw new y("The specified array cannot be empty");
  let n2 = 0;
  try {
    return n2 = R._api._malloc(e29.byteLength), R._api.HEAPU8.set(e29, n2), t3(T(n2));
  } finally {
    n2 !== 0 && R._api._free(n2);
  }
}
function we(e29, t3) {
  if (e29.length === 0) throw new y("The specified array cannot be empty");
  let n2 = e29.length * 8, r2 = 0;
  try {
    r2 = R._api._malloc(n2);
    let i = new ArrayBuffer(n2), a = new Float64Array(i);
    for (let t4 = 0; t4 < e29.length; t4++) a[t4] = e29[t4];
    return R._api.HEAPU8.set(new Int8Array(i), r2), t3(T(r2));
  } finally {
    r2 !== 0 && R._api._free(r2);
  }
}
function Te(e29, t3) {
  if (e29.byteLength === 0) throw new y("The specified array cannot be empty");
  let n2 = 0;
  try {
    return n2 = R._api._malloc(e29.byteLength), R._api.HEAPU8.set(e29, n2), t3(T(n2));
  } finally {
    n2 !== 0 && R._api._free(n2);
  }
}
var Ee = class e14 extends xe {
  constructor(e29) {
    let t3 = e29.settings._drawing._use((t4) => R._api._DrawingWand_Create(e29._instance, t4._instance)), n2 = R._api._DrawingWand_Dispose;
    super(t3, n2);
  }
  affine(e29, t3, n2, r2, i, a) {
    k.usePointer((o) => {
      R._api._DrawingWand_Affine(this._instance, e29, t3, n2, r2, i, a, o);
    });
  }
  borderColor(e29) {
    k.usePointer((t3) => {
      e29._use((e30) => {
        R._api._DrawingWand_BorderColor(this._instance, e30, t3);
      });
    });
  }
  color(e29, t3, n2) {
    k.usePointer((r2) => {
      R._api._DrawingWand_Color(this._instance, e29, t3, n2, r2);
    });
  }
  draw(e29) {
    e29.forEach((e30) => {
      e30.draw(this);
    }), k.usePointer((e30) => {
      R._api._DrawingWand_Render(this._instance, e30);
    });
  }
  fillColor(e29) {
    k.usePointer((t3) => {
      e29._use((e30) => {
        R._api._DrawingWand_FillColor(this._instance, e30, t3);
      });
    });
  }
  fillOpacity(e29) {
    k.usePointer((t3) => {
      R._api._DrawingWand_FillOpacity(this._instance, e29, t3);
    });
  }
  fillRule(e29) {
    k.usePointer((t3) => {
      R._api._DrawingWand_FillRule(this._instance, e29, t3);
    });
  }
  font(e29) {
    k.usePointer((t3) => {
      C(e29, (e30) => {
        R._api._DrawingWand_Font(this._instance, e30, t3);
      });
    });
  }
  fontPointSize(e29) {
    k.usePointer((t3) => {
      R._api._DrawingWand_FontPointSize(this._instance, e29, t3);
    });
  }
  fontTypeMetrics(e29, t3) {
    return k.usePointer((n2) => C(e29, (e30) => {
      let r2 = R._api._DrawingWand_FontTypeMetrics(this._instance, e30, +!!t3, n2);
      return Se._create(r2);
    }));
  }
  gravity(e29) {
    k.usePointer((t3) => {
      R._api._DrawingWand_Gravity(this._instance, e29, t3);
    });
  }
  line(e29, t3, n2, r2) {
    k.usePointer((i) => {
      R._api._DrawingWand_Line(this._instance, e29, t3, n2, r2, i);
    });
  }
  pathFinish() {
    k.usePointer((e29) => {
      R._api._DrawingWand_PathFinish(this._instance, e29);
    });
  }
  pathLineToAbs(e29, t3) {
    k.usePointer((n2) => {
      R._api._DrawingWand_PathLineToAbs(this._instance, e29, t3, n2);
    });
  }
  pathLineToRel(e29, t3) {
    k.usePointer((n2) => {
      R._api._DrawingWand_PathLineToRel(this._instance, e29, t3, n2);
    });
  }
  pathMoveToAbs(e29, t3) {
    k.usePointer((n2) => {
      R._api._DrawingWand_PathMoveToAbs(this._instance, e29, t3, n2);
    });
  }
  pathMoveToRel(e29, t3) {
    k.usePointer((n2) => {
      R._api._DrawingWand_PathMoveToRel(this._instance, e29, t3, n2);
    });
  }
  pathStart() {
    k.usePointer((e29) => {
      R._api._DrawingWand_PathStart(this._instance, e29);
    });
  }
  point(e29, t3) {
    k.usePointer((n2) => {
      R._api._DrawingWand_Point(this._instance, e29, t3, n2);
    });
  }
  rectangle(e29, t3, n2, r2) {
    k.usePointer((i) => {
      R._api._DrawingWand_Rectangle(this._instance, e29, t3, n2, r2, i);
    });
  }
  roundRectangle(e29, t3, n2, r2, i, a) {
    k.usePointer((o) => {
      R._api._DrawingWand_RoundRectangle(this._instance, e29, t3, n2, r2, i, a, o);
    });
  }
  strokeColor(e29) {
    k.usePointer((t3) => {
      e29._use((e30) => {
        R._api._DrawingWand_StrokeColor(this._instance, e30, t3);
      });
    });
  }
  strokeDashArray(e29) {
    k.usePointer((t3) => {
      we(e29, (n2) => {
        R._api._DrawingWand_StrokeDashArray(this._instance, n2, T(e29.length), t3);
      });
    });
  }
  strokeDashOffset(e29) {
    k.usePointer((t3) => {
      R._api._DrawingWand_StrokeDashOffset(this._instance, e29, t3);
    });
  }
  strokeWidth(e29) {
    k.usePointer((t3) => {
      R._api._DrawingWand_StrokeWidth(this._instance, e29, t3);
    });
  }
  text(e29, t3, n2) {
    k.usePointer((r2) => {
      C(n2, (n3) => {
        R._api._DrawingWand_Text(this._instance, e29, t3, n3, r2);
      });
    });
  }
  textAlignment(e29) {
    k.usePointer((t3) => {
      R._api._DrawingWand_TextAlignment(this._instance, e29, t3);
    });
  }
  textAntialias(e29) {
    k.usePointer((t3) => {
      R._api._DrawingWand_TextAntialias(this._instance, +!!e29, t3);
    });
  }
  textDecoration(e29) {
    k.usePointer((t3) => {
      R._api._DrawingWand_TextDecoration(this._instance, e29, t3);
    });
  }
  textInterlineSpacing(e29) {
    k.usePointer((t3) => {
      R._api._DrawingWand_TextInterlineSpacing(this._instance, e29, t3);
    });
  }
  textInterwordspacing(e29) {
    k.usePointer((t3) => {
      R._api._DrawingWand_TextInterwordSpacing(this._instance, e29, t3);
    });
  }
  textKerning(e29) {
    k.usePointer((t3) => {
      R._api._DrawingWand_TextKerning(this._instance, e29, t3);
    });
  }
  textUnderColor(e29) {
    k.usePointer((t3) => {
      e29._use((e30) => {
        R._api._DrawingWand_TextUnderColor(this._instance, e30, t3);
      });
    });
  }
  static _use(t3, n2) {
    let r2 = new e14(t3);
    return O._disposeAfterExecution(r2, n2);
  }
};
var A = class e15 extends ye {
  constructor() {
    super(8, "double");
  }
  static use(t3) {
    let n2 = new e15();
    try {
      return t3(n2);
    } finally {
      n2.free();
    }
  }
};
var j = {
  Undefined: 0,
  Forget: 0,
  Northwest: 1,
  North: 2,
  Northeast: 3,
  West: 4,
  Center: 5,
  East: 6,
  Southwest: 7,
  South: 8,
  Southeast: 9
};
function* De(e29) {
  for (let t3 of e29) switch (t3) {
    case j.North:
      yield "north";
      break;
    case j.Northeast:
      yield "north", yield "east";
      break;
    case j.Northwest:
      yield "north", yield "west";
      break;
    case j.East:
      yield "east";
      break;
    case j.West:
      yield "west";
      break;
    case j.South:
      yield "south";
      break;
    case j.Southeast:
      yield "south", yield "east";
      break;
    case j.Southwest:
      yield "south", yield "west";
  }
}
function Oe(e29) {
  switch (e29) {
    case j.North:
      return "north";
    case j.Northeast:
      return "northeast";
    case j.Northwest:
      return "northwest";
    case j.East:
      return "east";
    case j.West:
      return "west";
    case j.South:
      return "south";
    case j.Southeast:
      return "southeast";
    case j.Southwest:
      return "southwest";
    case j.Center:
      return "center";
    default:
      return;
  }
}
var ke = class e16 {
  constructor(e29, t3, n2) {
    this.meanErrorPerPixel = e29, this.normalizedMeanError = t3, this.normalizedMaximumError = n2;
  }
  meanErrorPerPixel;
  normalizedMaximumError;
  normalizedMeanError;
  static _create(t3) {
    let n2 = R._api._MagickImage_MeanErrorPerPixel_Get(t3._instance), r2 = R._api._MagickImage_NormalizedMeanError_Get(t3._instance), i = R._api._MagickImage_NormalizedMaximumError_Get(t3._instance);
    return new e16(n2, r2, i);
  }
};
var Ae = {
  Unknown: "UNKNOWN",
  ThreeFr: "3FR",
  ThreeG2: "3G2",
  ThreeGp: "3GP",
  A: "A",
  Aai: "AAI",
  Ai: "AI",
  APng: "APNG",
  Art: "ART",
  Arw: "ARW",
  Ashlar: "ASHLAR",
  Ase: "ASE",
  Aseprite: "ASEPRITE",
  Avci: "AVCI",
  Avi: "AVI",
  Avif: "AVIF",
  Avs: "AVS",
  B: "B",
  Bayer: "BAYER",
  Bayera: "BAYERA",
  Bgr: "BGR",
  Bgra: "BGRA",
  Bgro: "BGRO",
  Bmp: "BMP",
  Bmp2: "BMP2",
  Bmp3: "BMP3",
  Brf: "BRF",
  C: "C",
  C2pa: "C2PA",
  Cal: "CAL",
  Cals: "CALS",
  Canvas: "CANVAS",
  Caption: "CAPTION",
  Cin: "CIN",
  Cip: "CIP",
  Clip: "CLIP",
  Cmyk: "CMYK",
  Cmyka: "CMYKA",
  Cr2: "CR2",
  Cr3: "CR3",
  Crw: "CRW",
  Cube: "CUBE",
  Cur: "CUR",
  Cut: "CUT",
  Data: "DATA",
  Dcm: "DCM",
  Dcr: "DCR",
  Dcraw: "DCRAW",
  Dcx: "DCX",
  Dds: "DDS",
  Dfont: "DFONT",
  Dng: "DNG",
  Dpx: "DPX",
  Dxt1: "DXT1",
  Dxt5: "DXT5",
  Epdf: "EPDF",
  Epi: "EPI",
  Eps: "EPS",
  Eps2: "EPS2",
  Eps3: "EPS3",
  Epsf: "EPSF",
  Epsi: "EPSI",
  Ept: "EPT",
  Ept2: "EPT2",
  Ept3: "EPT3",
  Erf: "ERF",
  Exr: "EXR",
  Farbfeld: "FARBFELD",
  Fax: "FAX",
  Ff: "FF",
  Fff: "FFF",
  File: "FILE",
  Fits: "FITS",
  Fl32: "FL32",
  Flv: "FLV",
  Fractal: "FRACTAL",
  Ftp: "FTP",
  Fts: "FTS",
  Ftxt: "FTXT",
  G: "G",
  G3: "G3",
  G4: "G4",
  Gif: "GIF",
  Gif87: "GIF87",
  Gradient: "GRADIENT",
  Gray: "GRAY",
  Graya: "GRAYA",
  Group4: "GROUP4",
  Hald: "HALD",
  Hdr: "HDR",
  Heic: "HEIC",
  Heif: "HEIF",
  Histogram: "HISTOGRAM",
  Hrz: "HRZ",
  Htm: "HTM",
  Html: "HTML",
  Http: "HTTP",
  Https: "HTTPS",
  Icb: "ICB",
  Ico: "ICO",
  Icon: "ICON",
  Icn: "ICN",
  Iiq: "IIQ",
  Info: "INFO",
  Inline: "INLINE",
  Ipl: "IPL",
  Isobrl: "ISOBRL",
  Isobrl6: "ISOBRL6",
  J2c: "J2C",
  J2k: "J2K",
  Jng: "JNG",
  Jnx: "JNX",
  Jp2: "JP2",
  Jpc: "JPC",
  Jpe: "JPE",
  Jpeg: "JPEG",
  Jpg: "JPG",
  Jpm: "JPM",
  Jps: "JPS",
  Jpt: "JPT",
  Json: "JSON",
  Jxl: "JXL",
  K: "K",
  K25: "K25",
  Kdc: "KDC",
  Kernel: "KERNEL",
  Label: "LABEL",
  M: "M",
  M2v: "M2V",
  M4v: "M4V",
  Mac: "MAC",
  Map: "MAP",
  Mask: "MASK",
  Mat: "MAT",
  Matte: "MATTE",
  Mdc: "MDC",
  Mef: "MEF",
  Miff: "MIFF",
  Mkv: "MKV",
  Mng: "MNG",
  Mono: "MONO",
  Mov: "MOV",
  Mos: "MOS",
  Mp4: "MP4",
  Mpc: "MPC",
  Mpeg: "MPEG",
  Mpg: "MPG",
  Mpo: "MPO",
  Mrw: "MRW",
  Msl: "MSL",
  Msvg: "MSVG",
  Mtv: "MTV",
  Mvg: "MVG",
  Nef: "NEF",
  Nrw: "NRW",
  Null: "NULL",
  O: "O",
  Ora: "ORA",
  Orf: "ORF",
  Otb: "OTB",
  Otf: "OTF",
  Pal: "PAL",
  Palm: "PALM",
  Pam: "PAM",
  Pango: "PANGO",
  Pattern: "PATTERN",
  Pbm: "PBM",
  Pcd: "PCD",
  Pcds: "PCDS",
  Pcl: "PCL",
  Pct: "PCT",
  Pcx: "PCX",
  Pdb: "PDB",
  Pdf: "PDF",
  Pdfa: "PDFA",
  Pef: "PEF",
  Pes: "PES",
  Pfa: "PFA",
  Pfb: "PFB",
  Pfm: "PFM",
  Pgm: "PGM",
  Pgx: "PGX",
  Phm: "PHM",
  Picon: "PICON",
  Pict: "PICT",
  Pix: "PIX",
  Pjpeg: "PJPEG",
  Plasma: "PLASMA",
  Png: "PNG",
  Png00: "PNG00",
  Png24: "PNG24",
  Png32: "PNG32",
  Png48: "PNG48",
  Png64: "PNG64",
  Png8: "PNG8",
  Pnm: "PNM",
  Pocketmod: "POCKETMOD",
  Ppm: "PPM",
  Ps: "PS",
  Ps2: "PS2",
  Ps3: "PS3",
  Psb: "PSB",
  Psd: "PSD",
  Ptif: "PTIF",
  Pwp: "PWP",
  Qoi: "QOI",
  R: "R",
  RadialGradient: "RADIAL-GRADIENT",
  Raf: "RAF",
  Ras: "RAS",
  Raw: "RAW",
  Rgb: "RGB",
  Rgb565: "RGB565",
  Rgba: "RGBA",
  Rgbo: "RGBO",
  Rgf: "RGF",
  Rla: "RLA",
  Rle: "RLE",
  Rmf: "RMF",
  Rw2: "RW2",
  Rwl: "RWL",
  Scr: "SCR",
  Screenshot: "SCREENSHOT",
  Sct: "SCT",
  Sf3: "SF3",
  Sfw: "SFW",
  Sgi: "SGI",
  Shtml: "SHTML",
  Six: "SIX",
  Sixel: "SIXEL",
  SparseColor: "SPARSE-COLOR",
  Sr2: "SR2",
  Srf: "SRF",
  Srw: "SRW",
  Stegano: "STEGANO",
  Sti: "STI",
  StrImg: "STRIMG",
  Sun: "SUN",
  Svg: "SVG",
  Svgz: "SVGZ",
  Text: "TEXT",
  Tga: "TGA",
  Thumbnail: "THUMBNAIL",
  Tif: "TIF",
  Tiff: "TIFF",
  Tiff64: "TIFF64",
  Tile: "TILE",
  Tim: "TIM",
  Tm2: "TM2",
  Ttc: "TTC",
  Ttf: "TTF",
  Txt: "TXT",
  Ubrl: "UBRL",
  Ubrl6: "UBRL6",
  Uil: "UIL",
  Uyvy: "UYVY",
  Vda: "VDA",
  Vicar: "VICAR",
  Vid: "VID",
  Viff: "VIFF",
  Vips: "VIPS",
  Vst: "VST",
  WebM: "WEBM",
  WebP: "WEBP",
  Wbmp: "WBMP",
  Wbinfo: "WBINFO",
  Wmv: "WMV",
  Wpg: "WPG",
  X3f: "X3F",
  Xbm: "XBM",
  Xc: "XC",
  Xcf: "XCF",
  Xpm: "XPM",
  Xps: "XPS",
  Xv: "XV",
  Y: "Y",
  Yaml: "YAML",
  Ycbcr: "YCBCR",
  Ycbcra: "YCBCRA",
  Yuv: "YUV"
};
var M = {
  Undefined: 0,
  Coalesce: 1,
  CompareAny: 2,
  CompareClear: 3,
  CompareOverlay: 4,
  Dispose: 5,
  Optimize: 6,
  OptimizeImage: 7,
  OptimizePlus: 8,
  OptimizeTrans: 9,
  RemoveDups: 10,
  RemoveZero: 11,
  Composite: 12,
  Merge: 13,
  Flatten: 14,
  Mosaic: 15,
  Trimbounds: 16
};
var je = class extends xe {
  constructor(e29) {
    let t3 = R._api._DrawingSettings_Create(), n2 = R._api._DrawingSettings_Dispose;
    super(t3, n2);
    let r2 = e29.affine;
    r2 !== void 0 && R._api._DrawingSettings_SetAffine(this._instance, r2.scaleX, r2.scaleY, r2.shearX, r2.shearY, r2.translateX, r2.translateY), e29.borderColor !== void 0 && e29.borderColor._use((e30) => {
      R._api._DrawingSettings_BorderColor_Set(this._instance, e30);
    }), e29.fillColor !== void 0 && e29.fillColor._use((e30) => {
      R._api._DrawingSettings_FillColor_Set(this._instance, e30);
    }), e29.fillRule !== void 0 && R._api._DrawingSettings_FillRule_Set(this._instance, e29.fillRule), e29.font !== void 0 && C(it._getFontFileName(e29.font), (e30) => {
      R._api._DrawingSettings_Font_Set(this._instance, e30);
    }), e29.fontPointsize !== void 0 && R._api._DrawingSettings_FontPointsize_Set(this._instance, e29.fontPointsize), e29.strokeColor !== void 0 && e29.strokeColor._use((e30) => {
      R._api._DrawingSettings_StrokeColor_Set(this._instance, e30);
    });
    let i = e29.strokeDashArray;
    i !== void 0 && we(i, (e30) => {
      R._api._DrawingSettings_SetStrokeDashArray(this._instance, e30, T(i.length));
    }), e29.strokeDashOffset !== void 0 && R._api._DrawingSettings_StrokeDashOffset_Set(this._instance, e29.strokeDashOffset), e29.strokeWidth !== void 0 && R._api._DrawingSettings_StrokeWidth_Set(this._instance, e29.strokeWidth), e29.textAntiAlias !== void 0 && R._api._DrawingSettings_TextAntiAlias_Set(this._instance, +!!e29.textAntiAlias), e29.textGravity !== void 0 && R._api._DrawingSettings_TextGravity_Set(this._instance, e29.textGravity), e29.textKerning !== void 0 && R._api._DrawingSettings_TextKerning_Set(this._instance, e29.textKerning), e29.textUnderColor !== void 0 && e29.textUnderColor._use((e30) => {
      R._api._DrawingSettings_TextUnderColor_Set(this._instance, e30);
    });
  }
  setFillColor(e29) {
    e29 === void 0 ? R._api._DrawingSettings_FillColor_Set(this._instance, R._api._NullPointer) : e29._use((e30) => {
      R._api._DrawingSettings_FillColor_Set(this._instance, e30);
    });
  }
  setFillPattern(e29) {
    k.usePointer((t3) => {
      e29 === void 0 ? R._api._DrawingSettings_SetFillPattern(this._instance, R._api._NullPointer, t3) : R._api._DrawingSettings_SetFillPattern(this._instance, e29._instance, t3);
    });
  }
};
var Me = class {
  affine;
  borderColor;
  backgroundColor;
  fillColor;
  fillRule;
  font;
  fontPointsize;
  strokeColor;
  strokeDashArray;
  strokeDashOffset;
  strokeWidth;
  textAntiAlias;
  textGravity;
  textKerning;
  textUnderColor;
  _use(e29) {
    let t3 = new je(this);
    return O._disposeAfterExecution(t3, e29);
  }
};
var Ne = {
  Undefined: 0,
  EvenOdd: 1,
  NonZero: 2
};
var Pe = class extends xe {
  constructor(e29) {
    let t3 = R._api._MagickSettings_Create(), n2 = R._api._MagickSettings_Dispose;
    super(t3, n2), e29._colorFuzz !== void 0 && R._api._MagickSettings_SetColorFuzz(this._instance, e29._colorFuzz), e29._fileName !== void 0 && C(e29._fileName, (e30) => {
      R._api._MagickSettings_SetFileName(this._instance, e30);
    }), e29._ping && R._api._MagickSettings_SetPing(this._instance, 1), e29._quality !== void 0 && R._api._MagickSettings_SetQuality(this._instance, T(e29._quality)), e29.antiAlias !== void 0 && R._api._MagickSettings_AntiAlias_Set(this._instance, +!!e29.antiAlias), e29.backgroundColor !== void 0 && e29.backgroundColor._use((e30) => {
      R._api._MagickSettings_BackgroundColor_Set(this._instance, e30);
    }), e29.colorSpace !== void 0 && R._api._MagickSettings_ColorSpace_Set(this._instance, e29.colorSpace), e29.colorType !== void 0 && R._api._MagickSettings_ColorType_Set(this._instance, e29.colorType), e29.compression !== void 0 && R._api._MagickSettings_Compression_Set(this._instance, e29.compression), e29.debug !== void 0 && R._api._MagickSettings_Debug_Set(this._instance, +!!e29.debug), e29.density !== void 0 && C(e29.density.toString(), (e30) => {
      R._api._MagickSettings_Density_Set(this._instance, e30);
    }), e29.depth !== void 0 && R._api._MagickSettings_Depth_Set(this._instance, T(e29.depth)), e29.endian !== void 0 && R._api._MagickSettings_Endian_Set(this._instance, e29.endian), e29.fillColor !== void 0 && this.setOption("fill", e29.fillColor.toString()), e29.font !== void 0 && C(it._getFontFileName(e29.font), (e30) => {
      R._api._MagickSettings_SetFont(this._instance, e30);
    }), e29.fontPointsize !== void 0 && R._api._MagickSettings_FontPointsize_Set(this._instance, e29.fontPointsize), e29.format !== void 0 && C(e29.format, (e30) => {
      R._api._MagickSettings_Format_Set(this._instance, e30);
    }), e29.interlace !== void 0 && R._api._MagickSettings_Interlace_Set(this._instance, e29.interlace), e29.page !== void 0 && C(e29.page.toString(), (e30) => {
      R._api._MagickSettings_SetPage(this._instance, e30);
    }), e29.strokeColor !== void 0 && this.setOption("stroke", e29.strokeColor.toString()), e29.strokeWidth !== void 0 && this.setOption("strokeWidth", e29.strokeWidth.toString()), e29.textInterlineSpacing !== void 0 && this.setOption("interline-spacing", e29.textInterlineSpacing.toString());
    for (let t4 in e29._options) this.setOption(t4, e29._options[t4]);
  }
  setOption(e29, t3) {
    C(e29, (e30) => {
      C(t3, (t4) => {
        R._api._MagickSettings_SetOption(this._instance, e30, t4);
      });
    });
  }
};
var Fe = class e17 {
  _colorFuzz;
  _drawing = new Me();
  _fileName;
  _onArtifact;
  _options = {};
  _ping = false;
  _quality;
  get affine() {
    return this._drawing.affine;
  }
  set affine(e29) {
    this._drawing.affine = e29;
  }
  antiAlias;
  backgroundColor;
  get borderColor() {
    return this._drawing.borderColor;
  }
  set borderColor(e29) {
    this._drawing.borderColor = e29;
  }
  colorSpace;
  colorType;
  compression;
  debug;
  density;
  depth;
  endian;
  get fillColor() {
    return this._drawing.fillColor;
  }
  set fillColor(e29) {
    this.setDefineAndArtifact("fill", e29?.toString()), this._drawing.fillColor = e29;
  }
  get fillRule() {
    return this._drawing.fillRule ?? Ne.Undefined;
  }
  set fillRule(e29) {
    this._drawing.fillRule = e29;
  }
  get font() {
    return this._drawing.font;
  }
  set font(e29) {
    this._drawing.font = e29;
  }
  get fontPointsize() {
    return this._drawing.fontPointsize;
  }
  set fontPointsize(e29) {
    this._drawing.fontPointsize = e29;
  }
  format;
  interlace;
  page;
  get strokeColor() {
    return this._drawing.strokeColor;
  }
  set strokeColor(e29) {
    this._drawing.strokeColor = e29;
  }
  get strokeDashArray() {
    return this._drawing.strokeDashArray;
  }
  set strokeDashArray(e29) {
    this._drawing.strokeDashArray = e29;
  }
  get strokeDashOffset() {
    return this._drawing.strokeDashOffset;
  }
  set strokeDashOffset(e29) {
    this._drawing.strokeDashOffset = e29;
  }
  get strokeWidth() {
    return this._drawing.strokeWidth;
  }
  set strokeWidth(e29) {
    this.setDefineAndArtifact("stroke", e29?.toString()), this._drawing.strokeWidth = e29;
  }
  get textAntiAlias() {
    return this._drawing.textAntiAlias;
  }
  set textAntiAlias(e29) {
    this._drawing.textAntiAlias = e29;
  }
  textInterlineSpacing;
  get textKerning() {
    return this._drawing.textKerning;
  }
  set textKerning(e29) {
    this.setDefineAndArtifact("kerning", e29?.toString()), this._drawing.textKerning = e29;
  }
  get textGravity() {
    return this._drawing.textGravity;
  }
  set textGravity(e29) {
    this.setDefineAndArtifact("gravity", Oe(e29)), this._drawing.textGravity = e29;
  }
  get textUnderColor() {
    return this._drawing.textUnderColor;
  }
  set textUnderColor(e29) {
    this._drawing.textUnderColor = e29;
  }
  getDefine(e29, t3) {
    return t3 === void 0 ? this._options[e29] ?? null : this._options[`${e29}:${t3}`] ?? null;
  }
  removeDefine(e29, t3) {
    if (t3 === void 0) delete this._options[e29];
    else {
      let n2 = this.parseDefine(e29, t3);
      delete this._options[n2];
    }
  }
  setDefine(e29, t3, n2) {
    if (n2 === void 0) this._options[e29] = t3;
    else {
      let r2 = this.parseDefine(e29, t3);
      typeof n2 == "string" ? this._options[r2] = n2 : typeof n2 == "number" ? this._options[r2] = n2.toString() : this._options[r2] = n2 ? "true" : "false";
    }
  }
  setDefines(e29) {
    e29.getDefines().forEach((e30) => {
      e30 !== void 0 && this.setDefine(e30.format, e30.name, e30.value);
    });
  }
  _clone() {
    let t3 = new e17();
    return Object.assign(t3, this), t3;
  }
  _use(e29) {
    let t3 = new Pe(this);
    return O._disposeAfterExecution(t3, e29);
  }
  parseDefine(e29, t3) {
    return e29 === Ae.Unknown ? t3 : `${e29}:${t3}`;
  }
  setDefineAndArtifact(e29, t3) {
    t3 === void 0 ? this.removeDefine(e29) : this.setDefine(e29, t3), this._onArtifact !== void 0 && this._onArtifact(e29, t3);
  }
};
var N = class extends Fe {
  constructor(e29) {
    super(), Object.assign(this, e29);
  }
  extractArea;
  frameIndex;
  frameCount;
  height;
  get syncImageWithExifProfile() {
    let e29 = this.getDefine("exif:sync-image");
    return e29 === null || e29.toLowerCase() === "true";
  }
  set syncImageWithExifProfile(e29) {
    this.setDefine("exif:sync-image", e29.toString());
  }
  get syncImageWithTiffProperties() {
    let e29 = this.getDefine("tiff:sync-image");
    return e29 === null || e29.toLowerCase() === "true";
  }
  set syncImageWithTiffProperties(e29) {
    this.setDefine("tiff:sync-image", e29.toString());
  }
  width;
  _use(e29) {
    let t3 = new Pe(this), n2 = this.getSize();
    if (n2 !== "" && C(n2, (e30) => {
      R._api._MagickSettings_SetSize(t3._instance, e30);
    }), this.frameIndex !== void 0 || this.frameCount !== void 0) {
      let e30 = T(this.frameIndex ?? 0), n3 = T(this.frameCount ?? 1);
      R._api._MagickSettings_SetScene(t3._instance, e30), R._api._MagickSettings_SetNumberScenes(t3._instance, n3), C((this.frameCount === void 0 ? e30.toString() : `${e30}-${Number(e30) + Number(n3)}`).toString(), (e31) => {
        R._api._MagickSettings_SetScenes(t3._instance, e31);
      });
    }
    return this.extractArea !== void 0 && C(this.extractArea.toString(), (e30) => {
      R._api._MagickSettings_Extract_Set(t3._instance, e30);
    }), O._disposeAfterExecution(t3, e29);
  }
  getSize() {
    return this.width !== void 0 && this.height !== void 0 ? `${this.width}x${this.height}` : this.width === void 0 ? this.height === void 0 ? "" : `x${this.height}` : `${this.width}x`;
  }
};
var P = {
  Undefined: 0,
  No: 1,
  Riemersma: 2,
  FloydSteinberg: 3
};
var Ie = class extends xe {
  constructor(e29) {
    let t3 = R._api._QuantizeSettings_Create(), n2 = R._api._QuantizeSettings_Dispose;
    super(t3, n2), R._api._QuantizeSettings_SetColors(this._instance, T(e29.colors)), R._api._QuantizeSettings_SetColorSpace(this._instance, e29.colorSpace), R._api._QuantizeSettings_SetDitherMethod(this._instance, e29.ditherMethod ?? P.No), R._api._QuantizeSettings_SetMeasureErrors(this._instance, +!!e29.measureErrors), R._api._QuantizeSettings_SetTreeDepth(this._instance, T(e29.treeDepth));
  }
};
var Le = class {
  constructor() {
    this.colors = 256, this.colorSpace = _.Undefined, this.ditherMethod = P.Riemersma, this.measureErrors = false, this.treeDepth = 0;
  }
  colors;
  colorSpace;
  ditherMethod;
  measureErrors;
  treeDepth;
  _use(e29) {
    let t3 = new Ie(this);
    return O._disposeAfterExecution(t3, e29);
  }
};
var Re = class e18 {
  _image;
  _names = [];
  constructor(e29) {
    this._image = e29;
  }
  setArtifact(e29, t3) {
    this._names.push(e29), this._image.setArtifact(e29, t3);
  }
  static use(t3, n2) {
    let r2 = new e18(t3);
    try {
      return n2(r2);
    } finally {
      r2.dispose();
    }
  }
  dispose() {
    for (let e29 of this._names) this._image.removeArtifact(e29);
  }
};
var F = class e19 extends Array {
  constructor() {
    super();
  }
  static create(t3) {
    let n2 = e19.createObject();
    return t3 !== void 0 && n2.read(t3), n2;
  }
  dispose() {
    let e29 = this.pop();
    for (; e29 !== void 0; ) e29.dispose(), e29 = this.pop();
  }
  appendHorizontally(e29) {
    return this.createImage((e30, t3) => R._api._MagickImageCollection_Append(e30, 0, t3.ptr), e29);
  }
  appendVertically(e29) {
    return this.createImage((e30, t3) => R._api._MagickImageCollection_Append(e30, 1, t3.ptr), e29);
  }
  clone(t3) {
    return e19.use((e29) => {
      for (let t4 = 0; t4 < this.length; t4++) e29.push(Qe._clone(this[t4]));
      return t3(e29);
    });
  }
  coalesce() {
    this.replaceImages((e29, t3) => R._api._MagickImageCollection_Coalesce(e29, t3.ptr));
  }
  combine(e29, t3) {
    let n2 = t3, r2 = _.sRGB;
    return typeof e29 == "number" ? r2 = e29 : n2 = e29, this.createImage((e30, t4) => R._api._MagickImageCollection_Combine(e30, r2, t4.ptr), n2);
  }
  complex(e29, t3) {
    return Re.use(this[0], (n2) => (e29._setArtifacts(n2), this.createImage((t4, n3) => R._api._MagickImageCollection_Complex(t4, e29.complexOperator, n3.ptr), t3)));
  }
  deconstruct() {
    this.replaceImages((e29, t3) => R._api._MagickImageCollection_Deconstruct(e29, t3.ptr));
  }
  evaluate(e29, t3) {
    return this.createImage((t4, n2) => R._api._MagickImageCollection_Evaluate(t4, T(e29), n2.ptr), t3);
  }
  flatten(e29) {
    return this.mergeImages(M.Flatten, e29);
  }
  fx(e29, t3, n2) {
    this.throwIfEmpty();
    let r2 = g.All, i = n2;
    return typeof t3 == "number" ? r2 = t3 : i = t3, C(e29, (e30) => this.createImage((t4, n3) => R._api._MagickImageCollection_Fx(t4, e30, T(r2), n3.ptr), i));
  }
  merge(e29) {
    return this.mergeImages(M.Merge, e29);
  }
  montage(t3, n2) {
    return this.throwIfEmpty(), this.attachImages((r2) => {
      let i = t3._use((e29) => k.use((t4) => {
        let n3 = R._api._MagickImageCollection_Montage(r2, e29._instance, t4.ptr);
        return this.checkResult(n3, t4);
      }));
      return e19._createFromImages(i, this.getSettings(), (e29) => {
        let r3 = t3.transparentColor;
        return r3 !== void 0 && e29.forEach((e30) => {
          e30.transparent(r3);
        }), e29.merge(n2);
      });
    });
  }
  morph(e29) {
    if (this.length < 2) throw new y("operation requires at least two images");
    this.replaceImages((t3, n2) => R._api._MagickImageCollection_Morph(t3, T(e29), n2.ptr));
  }
  mosaic(e29) {
    return this.mergeImages(M.Mosaic, e29);
  }
  optimize() {
    this.replaceImages((e29, t3) => R._api._MagickImageCollection_Optimize(e29, t3.ptr));
  }
  optimizePlus() {
    this.replaceImages((e29, t3) => R._api._MagickImageCollection_OptimizePlus(e29, t3.ptr));
  }
  optimizeTransparency() {
    this.throwIfEmpty(), this.attachImages((e29) => {
      k.usePointer((t3) => {
        R._api._MagickImageCollection_OptimizeTransparency(e29, t3);
      });
    });
  }
  ping(e29, t3) {
    this.readOrPing(true, e29, t3);
  }
  polynomial(e29, t3) {
    return this.createImage((t4, n2) => we(e29, (r2) => R._api._MagickImageCollection_Polynomial(t4, r2, T(e29.length), n2.ptr)), t3);
  }
  quantize(e29) {
    this.throwIfEmpty();
    let t3 = e29 === void 0 ? new Le() : e29;
    return this.attachImages((e30) => {
      t3._use((t4) => {
        k.usePointer((n2) => {
          R._api._MagickImageCollection_Quantize(e30, t4._instance, n2);
        });
      });
    }), t3.measureErrors ? ke._create(this[0]) : null;
  }
  read(e29, t3) {
    this.readOrPing(false, e29, t3);
  }
  remap(e29, t3) {
    this.throwIfEmpty();
    let n2 = t3 === void 0 ? new Le() : t3;
    this.attachImages((t4) => {
      n2._use((n3) => {
        k.use((r2) => {
          R._api._MagickImageCollection_Remap(t4, n3._instance, e29._instance, r2.ptr);
        });
      });
    });
  }
  resetPage() {
    this.forEach((e29) => {
      e29.resetPage();
    });
  }
  smushHorizontal(e29, t3) {
    return this.smush(e29, false, t3);
  }
  smushVertical(e29, t3) {
    return this.smush(e29, true, t3);
  }
  trimBounds() {
    this.mergeImages(M.Trimbounds, () => {
    });
  }
  static use(t3) {
    let n2 = e19.create();
    return O._disposeAfterExecution(n2, t3);
  }
  write(e29, t3) {
    this.throwIfEmpty();
    let n2 = R._api._NullPointer, r2 = 0, i = this[0], a = this.getSettings();
    t3 === void 0 ? (t3 = e29, a.format = i.format) : a.format = e29, k.use((e30) => {
      be.use((t4) => {
        a._use((i2) => {
          this.attachImages((a2) => {
            n2 = R._api._MagickImage_WriteBlob(a2, i2._instance, t4.ptr, e30.ptr), r2 = Number(t4.value);
          });
        });
      });
    });
    let o = new ve(n2, r2, t3);
    return O._disposeAfterExecution(o, o.func);
  }
  static _createFromImages(t3, n2, r2) {
    let i = e19.createObject();
    return i.addImages(t3, n2._clone()), r2(i);
  }
  addImages(e29, t3) {
    t3.format = Ae.Unknown;
    let n2 = e29;
    for (; n2 !== R._api._NullPointer; ) {
      let e30 = R._api._MagickImage_GetNext(n2);
      R._api._MagickImage_SetNext(n2, R._api._NullPointer), this.push(Qe._createFromImage(n2, t3)), n2 = e30;
    }
  }
  attachImages(e29) {
    try {
      for (let e30 = 0; e30 < this.length - 1; e30++) R._api._MagickImage_SetNext(this[e30]._instance, this[e30 + 1]._instance);
      return e29(this[0]._instance);
    } finally {
      for (let e30 = 0; e30 < this.length - 1; e30++) R._api._MagickImage_SetNext(this[e30]._instance, R._api._NullPointer);
    }
  }
  checkResult(e29, t3) {
    return t3.check(() => e29, () => (R._api._MagickImageCollection_Dispose(e29), R._api._NullPointer));
  }
  static createObject() {
    return Object.create(e19.prototype);
  }
  createImage(e29, t3) {
    this.throwIfEmpty();
    let n2 = this.attachImages((t4) => k.use((n3) => {
      let r2 = e29(t4, n3);
      return this.checkResult(r2, n3);
    }));
    return Qe._createFromImage(n2, this.getSettings())._use(t3);
  }
  getSettings() {
    return this[0]._getSettings()._clone();
  }
  mergeImages(e29, t3) {
    return this.createImage((t4, n2) => R._api._MagickImageCollection_Merge(t4, T(e29), n2.ptr), t3);
  }
  readOrPing(e29, t3, n2) {
    this.dispose(), k.use((r2) => {
      let i = n2 === void 0 ? new N() : new N(n2);
      i._ping = e29, typeof t3 == "string" ? (i._fileName = t3, i._use((e30) => {
        let t4 = R._api._MagickImageCollection_ReadFile(e30._instance, r2.ptr);
        this.addImages(t4, i);
      })) : i._use((e30) => {
        let n3 = t3.byteLength, a = 0;
        try {
          a = R._api._malloc(n3), R._api.HEAPU8.set(t3, a);
          let o = T(a), s = R._api._MagickImageCollection_ReadBlob(e30._instance, o, R._api._NullPointer, T(n3), r2.ptr);
          this.addImages(s, i);
        } finally {
          a !== 0 && R._api._free(a);
        }
      });
    });
  }
  replaceImages(e29) {
    this.throwIfEmpty();
    let t3 = this.attachImages((t4) => k.use((n3) => {
      let r2 = e29(t4, n3);
      return this.checkResult(r2, n3);
    })), n2 = this.getSettings()._clone();
    this.dispose(), this.addImages(t3, n2);
  }
  smush(e29, t3, n2) {
    return this.createImage((n3, r2) => R._api._MagickImageCollection_Smush(n3, T(e29), +!!t3, r2.ptr), n2);
  }
  throwIfEmpty() {
    if (this.length === 0) throw new y("operation requires at least one image");
  }
};
var I = class e20 {
  _value;
  constructor(e29) {
    this._value = e29;
  }
  static _fromQuantum(t3) {
    return new e20(t3 / de.max * 100);
  }
  multiply(e29) {
    return e29 * this._value / 100;
  }
  toDouble() {
    return this._value;
  }
  toString() {
    return `${parseFloat(this._value.toFixed(2))}%`;
  }
  _toQuantum() {
    return de.max * (this._value / 100);
  }
};
var ze = class {
  static use(e29, t3, n2) {
    let r2 = R._api._MagickRectangle_Create();
    try {
      R._api._MagickRectangle_X_Set(r2, T(t3.x)), R._api._MagickRectangle_Y_Set(r2, T(t3.y));
      let i = t3.width, a = t3.height;
      return t3.isPercentage && (i = new I(t3.width).multiply(e29.width), a = new I(t3.height).multiply(e29.height)), R._api._MagickRectangle_Width_Set(r2, T(i)), R._api._MagickRectangle_Height_Set(r2, T(a)), n2(r2);
    } finally {
      R._api._MagickRectangle_Dispose(r2);
    }
  }
};
var Be = class {
  static _use(e29, t3, n2) {
    let r2 = R._api._NullPointer;
    try {
      return r2 = R._api._OffsetInfo_Create(), R._api._PrimaryInfo_X_Set(r2, e29), R._api._PrimaryInfo_Y_Set(r2, t3), n2(r2);
    } finally {
      R._api._free(Number(r2));
    }
  }
};
var Ve = class {
  _values;
  constructor() {
    this._values = Array(7).fill(0);
  }
  get(e29) {
    return this._values[e29];
  }
  set(e29, t3) {
    this._values[e29] = t3;
  }
};
var He = class e21 {
  _huPhashes = /* @__PURE__ */ new Map();
  _hash = "";
  channel;
  constructor(e29, t3, n2) {
    if (this.channel = e29, typeof n2 == "string") this.parseHash(t3, n2);
    else for (let e30 = 0; e30 < t3.length; e30++) {
      let r2 = new Ve();
      for (let t4 = 0; t4 < 7; t4++) {
        let i = R._api._ChannelPerceptualHash_GetHuPhash(n2, T(e30), T(t4));
        r2.set(t4, i);
      }
      this._huPhashes.set(t3[e30], r2);
    }
  }
  huPhash(e29, t3) {
    if (t3 < 0 || t3 > 6) throw new y("Invalid index specified");
    let n2 = this._huPhashes.get(e29);
    if (n2 === void 0) throw new y("Invalid color space specified");
    return n2.get(t3);
  }
  sumSquaredDistance(e29) {
    let t3 = 0;
    return this._huPhashes.forEach((n2, r2) => {
      for (let i = 0; i < 7; i++) {
        let a = n2.get(i), o = e29.huPhash(r2, i);
        t3 += (a - o) * (a - o);
      }
    }), t3;
  }
  toString() {
    return this._hash == "" && this.setHash(), this._hash;
  }
  parseHash(t3, n2) {
    this._hash = n2;
    let r2 = 0;
    for (let i of t3) {
      let t4 = new Ve();
      for (let i2 = 0; i2 < 7; i2++, r2 += 5) {
        let a = Number.parseInt(n2.substring(r2, r2 + 5), 16);
        if (isNaN(a)) throw new y("Invalid hash specified");
        let o = a / e21.powerOfTen(a >> 17);
        a & 65536 && (o = -o), t4.set(i2, o);
      }
      this._huPhashes.set(i, t4);
    }
  }
  static powerOfTen(e29) {
    switch (e29) {
      case 2:
        return 100;
      case 3:
        return 1e3;
      case 4:
        return 1e4;
      case 5:
        return 1e5;
      case 6:
        return 1e6;
      default:
        return 10;
    }
  }
  setHash() {
    this._hash = "", this._huPhashes.forEach((e29) => {
      for (let t3 = 0; t3 < 7; t3++) {
        let n2 = e29.get(t3), r2 = 0;
        for (; r2 < 7 && Math.abs(n2 * 10) < 65356; ) n2 *= 10, r2++;
        r2 <<= 1, r2 < 0 && (r2 |= 1), r2 = (r2 << 16) + Math.floor(n2 < 0 ? -(n2 - 0.5) : n2 + 0.5), this._hash += r2.toString(16);
      }
    });
  }
};
var Ue = class e22 {
  _red;
  _green;
  _blue;
  constructor(t3, n2, r2) {
    if (typeof t3 == "string") {
      let r3 = n2 ?? e22._defaultColorspaces();
      e22._validateColorSpaces(r3);
      let i = 35 * r3.length;
      if (t3.length !== 3 * i) throw new y("Invalid hash size");
      this._red = new He(h.Red, r3, t3.substring(0, i)), this._blue = new He(h.Blue, r3, t3.substring(i, i + i)), this._green = new He(h.Green, r3, t3.substring(i + i));
    } else this._red = t3, this._green = n2, this._blue = r2;
  }
  static _create(t3, n2, r2) {
    if (r2 === R._api._NullPointer) throw new y("The native operation failed to create an instance");
    let i = e22.createChannel(t3, n2, r2, h.Red), a = e22.createChannel(t3, n2, r2, h.Green), o = e22.createChannel(t3, n2, r2, h.Blue);
    return new e22(i, a, o);
  }
  static _defaultColorspaces() {
    return [_.XyY, _.HSB];
  }
  static _validateColorSpaces(e29) {
    if (e29.length < 1 || e29.length > 6) throw new y("Invalid number of colorspaces, the minimum is 1 and the maximum is 6");
    if (new Set(e29).size !== e29.length) throw new y("Specifying the same colorspace more than once is not allowed");
  }
  getChannel(e29) {
    switch (e29) {
      case h.Red:
        return this._red;
      case h.Green:
        return this._green;
      case h.Blue:
        return this._blue;
      default:
        return null;
    }
  }
  sumSquaredDistance(e29) {
    let t3 = e29.getChannel(h.Red), n2 = e29.getChannel(h.Green), r2 = e29.getChannel(h.Blue);
    if (t3 === null || n2 === null || r2 === null) throw new y("The other perceptual hash should contain a red, green and blue channel.");
    return this._red.sumSquaredDistance(t3) + this._green.sumSquaredDistance(n2) + this._blue.sumSquaredDistance(r2);
  }
  toString() {
    return this._red.toString() + this._green.toString() + this._blue.toString();
  }
  static createChannel(e29, t3, n2, r2) {
    return new He(r2, t3, R._api._PerceptualHash_GetInstance(e29._instance, n2, T(r2)));
  }
};
var We = class e23 extends xe {
  image;
  constructor(e29) {
    let t3 = k.usePointer((t4) => R._api._PixelCollection_Create(e29._instance, t4)), n2 = R._api._PixelCollection_Dispose;
    super(t3, n2), this.image = e29;
  }
  static _create(t3) {
    return new e23(t3);
  }
  static _use(t3, n2) {
    let r2 = new e23(t3);
    return O._disposeAfterExecution(r2, n2);
  }
  static _map(t3, n2, r2) {
    let i = new e23(t3);
    try {
      i.use(0, 0, t3.width, t3.height, n2, (e29) => {
        r2(Number(e29));
      });
    } finally {
      i.dispose();
    }
  }
  getArea(e29, t3, n2, r2) {
    return k.usePointer((i) => {
      let a = Number(R._api._PixelCollection_GetArea(this._instance, T(e29), T(t3), T(n2), T(r2), i)), o = Number(n2 * r2 * this.image.channelCount);
      return R._api.HEAPU8.subarray(a, a + o);
    });
  }
  getReadOnlyArea(e29, t3, n2, r2) {
    return k.usePointer((i) => {
      let a = Number(R._api._PixelCollection_GetReadOnlyArea(this.image._instance, T(e29), T(t3), T(n2), T(r2), i)), o = Number(n2 * r2 * this.image.channelCount);
      return R._api.HEAPU8.subarray(a, a + o);
    });
  }
  getChannelIndex(e29) {
    return this.image._channelOffset(e29);
  }
  getColor(e29, t3) {
    let n2 = this.getArea(e29, t3, 1, 1), r2 = Array.from(n2), i = this.image._channelOffset(h.Index);
    if (i >= 0 && r2.splice(i, 1), r2.length === 0) return null;
    if (r2.length === 1) return new w(r2[0], r2[0], r2[0]);
    if (r2.length === 2) return new w(r2[0], r2[0], r2[0], r2[1]);
    let a = this.image._channelOffset(h.Black) >= 0, o = this.image._channelOffset(h.Alpha) >= 0;
    return a ? r2.length === 4 || !o ? new w(r2[0], r2[1], r2[2], r2[3], de.max) : new w(r2[0], r2[1], r2[2], r2[3], r2[4]) : r2.length === 3 || !o ? new w(r2[0], r2[1], r2[2]) : new w(r2[0], r2[1], r2[2], r2[3]);
  }
  getPixel(e29, t3) {
    return this.getArea(e29, t3, 1, 1);
  }
  setArea(e29, t3, n2, r2, i) {
    k.usePointer((a) => {
      let o = i instanceof Uint8Array ? i : new Uint8Array(i);
      Te(o, (i2) => {
        let s = T(o.length);
        R._api._PixelCollection_SetArea(this._instance, T(e29), T(t3), T(n2), T(r2), i2, s, a);
      });
    });
  }
  setPixel(e29, t3, n2) {
    n2 instanceof Uint8Array, this.setArea(e29, t3, 1, 1, n2);
  }
  toByteArray(e29, t3, n2, r2, i) {
    return this.use(e29, t3, n2, r2, i, (e30) => {
      if (e30 === R._api._NullPointer) return null;
      let t4 = Number(n2 * r2 * i.length), a = Number(e30);
      return R._api.HEAPU8.slice(a, a + t4);
    });
  }
  use(e29, t3, n2, r2, i, a) {
    return C(i, (i2) => k.use((o) => {
      let s = R._api._PixelCollection_ToByteArray(this._instance, T(e29), T(t3), T(n2), T(r2), i2, o.ptr);
      return o.check(() => {
        let e30 = a(s);
        return s = R._api._MagickMemory_Relinquish(s), e30;
      }, () => (s = R._api._MagickMemory_Relinquish(s), null));
    }));
  }
};
var Ge = {
  Undefined: 0,
  Average: 1,
  Brightness: 2,
  Lightness: 3,
  MS: 4,
  Rec601Luma: 5,
  Rec601Luminance: 6,
  Rec709Luma: 7,
  Rec709Luminance: 8,
  RMS: 9
};
var Ke = {
  Undefined: 0,
  Average: 1,
  Average9: 2,
  Average16: 3,
  Background: 4,
  Bilinear: 5,
  Blend: 6,
  Catrom: 7,
  Integer: 8,
  Mesh: 9,
  Nearest: 10,
  Spline: 11
};
var qe = class e24 {
  constructor(e29, t3, n2) {
    this.x = e29, this.y = t3, this.z = n2;
  }
  x;
  y;
  z;
  static _create(t3) {
    return t3 === R._api._NullPointer ? new e24(0, 0, 0) : new e24(R._api._PrimaryInfo_X_Get(t3), R._api._PrimaryInfo_Y_Get(t3), R._api._PrimaryInfo_Z_Get(t3));
  }
  _use(e29) {
    let t3 = R._api._NullPointer;
    try {
      t3 = R._api._PrimaryInfo_Create(), R._api._PrimaryInfo_X_Set(t3, this.x), R._api._PrimaryInfo_Y_Set(t3, this.y), R._api._PrimaryInfo_Z_Set(t3, this.z), e29(t3);
    } finally {
      R._api._PrimaryInfo_Dispose(t3);
    }
  }
};
var Je = class {
  channel;
  depth;
  entropy;
  kurtosis;
  maximum;
  mean;
  minimum;
  skewness;
  standardDeviation;
  constructor(e29, t3) {
    this.channel = e29, this.depth = Number(R._api._ChannelStatistics_Depth_Get(t3)), this.entropy = R._api._ChannelStatistics_Entropy_Get(t3), this.kurtosis = R._api._ChannelStatistics_Kurtosis_Get(t3), this.maximum = R._api._ChannelStatistics_Maximum_Get(t3), this.mean = R._api._ChannelStatistics_Mean_Get(t3), this.minimum = R._api._ChannelStatistics_Minimum_Get(t3), this.skewness = R._api._ChannelStatistics_Skewness_Get(t3), this.standardDeviation = R._api._ChannelStatistics_StandardDeviation_Get(t3);
  }
};
var Ye = class e25 {
  _channels = /* @__PURE__ */ new Map();
  get channels() {
    return Array.from(this._channels.keys());
  }
  composite() {
    return this._channels.get(h.Composite);
  }
  getChannel(e29) {
    let t3 = this._channels.get(e29);
    return t3 === void 0 ? null : t3;
  }
  static _create(t3, n2, r2) {
    let i = new e25();
    return t3.channels.forEach((e29) => {
      r2 >> e29 & 1 && i.addChannel(n2, e29);
    }), i.addChannel(n2, h.Composite), i;
  }
  addChannel(e29, t3) {
    let n2 = R._api._Statistics_GetInstance(e29, T(t3));
    n2 !== R._api._NullPointer && this._channels.set(t3, new Je(t3, n2));
  }
};
var Xe = class {
  static toArray(e29) {
    if (e29 === R._api._NullPointer) return null;
    let t3 = Number(R._api._StringInfo_Datum_Get(e29)), n2 = Number(R._api._StringInfo_Length_Get(e29));
    return R._api.HEAPU8.subarray(t3, t3 + n2);
  }
};
var Ze = class {
  constructor(e29) {
    this.error = e29;
  }
  error;
};
var Qe = class t2 extends xe {
  _settings;
  _progress;
  _warning;
  constructor(e29, t3) {
    super(e29, R._api._MagickImage_Dispose), this._settings = t3, this._settings._onArtifact = this.onSettingsArtifactChanged.bind(this);
  }
  get animationDelay() {
    return Number(R._api._MagickImage_AnimationDelay_Get(this._instance));
  }
  set animationDelay(e29) {
    R._api._MagickImage_AnimationDelay_Set(this._instance, T(e29));
  }
  get animationIterations() {
    return Number(R._api._MagickImage_AnimationIterations_Get(this._instance));
  }
  set animationIterations(e29) {
    R._api._MagickImage_AnimationIterations_Set(this._instance, T(e29));
  }
  get animationTicksPerSecond() {
    return Number(R._api._MagickImage_AnimationTicksPerSecond_Get(this._instance));
  }
  set animationTicksPerSecond(e29) {
    R._api._MagickImage_AnimationTicksPerSecond_Set(this._instance, T(e29));
  }
  get artifactNames() {
    let e29 = [];
    R._api._MagickImage_ResetArtifactIterator(this._instance);
    let t3 = R._api._MagickImage_GetNextArtifactName(this._instance);
    for (; t3 !== R._api._NullPointer; ) e29.push(x(t3)), t3 = R._api._MagickImage_GetNextArtifactName(this._instance);
    return e29;
  }
  get attributeNames() {
    let e29 = [];
    R._api._MagickImage_ResetAttributeIterator(this._instance);
    let t3 = R._api._MagickImage_GetNextAttributeName(this._instance);
    for (; t3 !== R._api._NullPointer; ) e29.push(x(t3)), t3 = R._api._MagickImage_GetNextAttributeName(this._instance);
    return e29;
  }
  get backgroundColor() {
    let e29 = R._api._MagickImage_BackgroundColor_Get(this._instance);
    return w._create(e29);
  }
  set backgroundColor(e29) {
    e29._use((e30) => {
      R._api._MagickImage_BackgroundColor_Set(this._instance, e30);
    });
  }
  get baseHeight() {
    return Number(R._api._MagickImage_BaseHeight_Get(this._instance));
  }
  get baseWidth() {
    return Number(R._api._MagickImage_BaseWidth_Get(this._instance));
  }
  get blackPointCompensation() {
    return R._api._MagickImage_BlackPointCompensation_Get(this._instance) === 1;
  }
  set blackPointCompensation(e29) {
    R._api._MagickImage_BlackPointCompensation_Set(this._instance, +!!e29);
  }
  get borderColor() {
    let e29 = R._api._MagickImage_BorderColor_Get(this._instance);
    return w._create(e29);
  }
  set borderColor(e29) {
    e29._use((e30) => {
      R._api._MagickImage_BorderColor_Set(this._instance, e30);
    });
  }
  get boundingBox() {
    return this.useExceptionPointer((e29) => {
      let t3 = R._api._MagickImage_BoundingBox_Get(this._instance, e29), n2 = E._fromRectangle(t3);
      return n2.width === 0 || n2.height === 0 ? null : n2;
    });
  }
  get channelCount() {
    return Number(R._api._MagickImage_ChannelCount_Get(this._instance));
  }
  get channels() {
    let e29 = [];
    return [
      h.Red,
      h.Green,
      h.Blue,
      h.Black,
      h.Alpha
    ].forEach((t3) => {
      R._api._MagickImage_HasChannel(this._instance, T(t3)) && e29.push(t3);
    }), e29;
  }
  get chromaticity() {
    return new ee(qe._create(R._api._MagickImage_ChromaRed_Get(this._instance)), qe._create(R._api._MagickImage_ChromaGreen_Get(this._instance)), qe._create(R._api._MagickImage_ChromaBlue_Get(this._instance)), qe._create(R._api._MagickImage_ChromaWhite_Get(this._instance)));
  }
  set chromaticity(e29) {
    e29.blue._use((e30) => R._api._MagickImage_ChromaBlue_Set(this._instance, e30)), e29.green._use((e30) => R._api._MagickImage_ChromaGreen_Set(this._instance, e30)), e29.red._use((e30) => R._api._MagickImage_ChromaRed_Set(this._instance, e30)), e29.white._use((e30) => R._api._MagickImage_ChromaWhite_Set(this._instance, e30));
  }
  get classType() {
    return Number(R._api._MagickImage_ClassType_Get(this._instance));
  }
  set classType(e29) {
    this.useExceptionPointer((t3) => {
      R._api._MagickImage_ClassType_Set(this._instance, T(e29), t3);
    });
  }
  get colorFuzz() {
    return I._fromQuantum(R._api._MagickImage_ColorFuzz_Get(this._instance));
  }
  set colorFuzz(e29) {
    let t3 = e29._toQuantum();
    R._api._MagickImage_ColorFuzz_Set(this._instance, t3), this._settings._colorFuzz = t3;
  }
  get colormapSize() {
    return Number(R._api._MagickImage_ColormapSize_Get(this._instance));
  }
  set colormapSize(e29) {
    this.useExceptionPointer((t3) => {
      R._api._MagickImage_ColormapSize_Set(this._instance, T(e29), t3);
    });
  }
  get colorSpace() {
    return Number(R._api._MagickImage_ColorSpace_Get(this._instance));
  }
  set colorSpace(e29) {
    this.useExceptionPointer((t3) => {
      R._api._MagickImage_ColorSpace_Set(this._instance, T(e29), t3);
    });
  }
  get colorType() {
    return this.settings.colorType === void 0 ? Number(R._api._MagickImage_ColorType_Get(this._instance)) : this.settings.colorType;
  }
  set colorType(e29) {
    this.useExceptionPointer((t3) => {
      R._api._MagickImage_ColorType_Set(this._instance, T(e29), t3);
    });
  }
  get comment() {
    return this.getAttribute("comment");
  }
  set comment(e29) {
    e29 === null ? this.removeAttribute("comment") : this.setAttribute("comment", e29);
  }
  get compose() {
    return Number(R._api._MagickImage_Compose_Get(this._instance));
  }
  set compose(e29) {
    R._api._MagickImage_Compose_Set(this._instance, T(e29));
  }
  get compression() {
    return Number(R._api._MagickImage_Compression_Get(this._instance));
  }
  get density() {
    return new _e(R._api._MagickImage_ResolutionX_Get(this._instance), R._api._MagickImage_ResolutionY_Get(this._instance), Number(R._api._MagickImage_ResolutionUnits_Get(this._instance)));
  }
  set density(e29) {
    R._api._MagickImage_ResolutionX_Set(this._instance, e29.x), R._api._MagickImage_ResolutionY_Set(this._instance, e29.y), R._api._MagickImage_ResolutionUnits_Set(this._instance, T(e29.units));
  }
  get depth() {
    return Number(R._api._MagickImage_Depth_Get(this._instance));
  }
  set depth(e29) {
    R._api._MagickImage_Depth_Set(this._instance, T(e29));
  }
  get endian() {
    return Number(R._api._MagickImage_Endian_Get(this._instance));
  }
  set endian(e29) {
    R._api._MagickImage_Endian_Set(this._instance, T(e29));
  }
  get fileName() {
    return b(R._api._MagickImage_FileName_Get(this._instance));
  }
  get filterType() {
    return Number(R._api._MagickImage_FilterType_Get(this._instance));
  }
  set filterType(e29) {
    R._api._MagickImage_FilterType_Set(this._instance, T(e29));
  }
  get format() {
    return b(R._api._MagickImage_Format_Get(this._instance), "");
  }
  set format(e29) {
    C(e29.toString(), (e30) => R._api._MagickImage_Format_Set(this._instance, e30));
  }
  get gamma() {
    return R._api._MagickImage_Gamma_Get(this._instance);
  }
  get gifDisposeMethod() {
    return Number(R._api._MagickImage_GifDisposeMethod_Get(this._instance));
  }
  set gifDisposeMethod(e29) {
    R._api._MagickImage_GifDisposeMethod_Set(this._instance, T(e29));
  }
  get hasAlpha() {
    return this.toBool(R._api._MagickImage_HasAlpha_Get(this._instance));
  }
  set hasAlpha(e29) {
    this.useExceptionPointer((t3) => {
      e29 && this.alpha(m.Opaque), R._api._MagickImage_HasAlpha_Set(this._instance, this.fromBool(e29), t3);
    });
  }
  get height() {
    return Number(R._api._MagickImage_Height_Get(this._instance));
  }
  get interlace() {
    return Number(R._api._MagickImage_Interlace_Get(this._instance));
  }
  get isOpaque() {
    return this.useExceptionPointer((e29) => this.toBool(R._api._MagickImage_IsOpaque_Get(this._instance, e29)));
  }
  get interpolate() {
    return Number(R._api._MagickImage_Interpolate_Get(this._instance));
  }
  set interpolate(e29) {
    R._api._MagickImage_Interpolate_Set(this._instance, T(e29));
  }
  get label() {
    return this.getAttribute("label");
  }
  set label(e29) {
    e29 === null ? this.removeAttribute("label") : this.setAttribute("label", e29);
  }
  get matteColor() {
    let e29 = R._api._MagickImage_MatteColor_Get(this._instance);
    return w._create(e29);
  }
  set matteColor(e29) {
    e29._use((e30) => {
      R._api._MagickImage_MatteColor_Set(this._instance, e30);
    });
  }
  get metaChannelCount() {
    return Number(R._api._MagickImage_MetaChannelCount_Get(this._instance));
  }
  set metaChannelCount(e29) {
    this.useExceptionPointer((t3) => {
      R._api._MagickImage_MetaChannelCount_Set(this._instance, T(e29), t3);
    });
  }
  get orientation() {
    return Number(R._api._MagickImage_Orientation_Get(this._instance));
  }
  set orientation(e29) {
    R._api._MagickImage_Orientation_Set(this._instance, T(e29));
  }
  get onProgress() {
    return this._progress;
  }
  set onProgress(e29) {
    e29 === void 0 ? this.disposeProgressDelegate() : nt.setProgressDelegate(this), this._progress = e29;
  }
  get onWarning() {
    return this._warning;
  }
  set onWarning(e29) {
    this._warning = e29;
  }
  get page() {
    let e29 = R._api._MagickImage_Page_Get(this._instance);
    return E._fromRectangle(e29);
  }
  set page(e29) {
    e29._toRectangle((e30) => {
      R._api._MagickImage_Page_Set(this._instance, e30);
    });
  }
  get profileNames() {
    let e29 = [];
    R._api._MagickImage_ResetProfileIterator(this._instance);
    let t3 = R._api._MagickImage_GetNextProfileName(this._instance);
    for (; t3 !== R._api._NullPointer; ) e29.push(x(t3)), t3 = R._api._MagickImage_GetNextProfileName(this._instance);
    return e29;
  }
  get quality() {
    return Number(R._api._MagickImage_Quality_Get(this._instance));
  }
  set quality(e29) {
    let t3 = e29 < 1 ? 1 : e29;
    t3 = t3 > 100 ? 100 : t3, R._api._MagickImage_Quality_Set(this._instance, T(t3)), this._settings._quality = t3;
  }
  get renderingIntent() {
    return Number(R._api._MagickImage_RenderingIntent_Get(this._instance));
  }
  set renderingIntent(e29) {
    R._api._MagickImage_RenderingIntent_Set(this._instance, T(e29));
  }
  get settings() {
    return this._settings;
  }
  get signature() {
    return this.useExceptionPointer((e29) => b(R._api._MagickImage_Signature_Get(this._instance, e29)));
  }
  get totalColors() {
    return this.useExceptionPointer((e29) => Number(R._api._MagickImage_TotalColors_Get(this._instance, e29)));
  }
  get virtualPixelMethod() {
    return Number(R._api._MagickImage_VirtualPixelMethod_Get(this._instance));
  }
  set virtualPixelMethod(e29) {
    this.useExceptionPointer((t3) => {
      R._api._MagickImage_VirtualPixelMethod_Set(this._instance, T(e29), t3);
    });
  }
  get width() {
    return Number(R._api._MagickImage_Width_Get(this._instance));
  }
  adaptiveBlur(e29, t3) {
    let n2 = this.valueOrDefault(e29, 0), r2 = this.valueOrDefault(t3, 1);
    this.useException((e30) => {
      let t4 = R._api._MagickImage_AdaptiveBlur(this._instance, n2, r2, e30.ptr);
      this._setInstance(t4, e30);
    });
  }
  adaptiveResize(e29, t3) {
    let n2 = typeof e29 == "number" ? new E(0, 0, e29, t3) : e29;
    this.useException((e30) => {
      C(n2.toString(), (t4) => {
        let n3 = R._api._MagickImage_AdaptiveResize(this._instance, t4, e30.ptr);
        this._setInstance(n3, e30);
      });
    });
  }
  adaptiveSharpen(e29, t3, n2) {
    let r2 = 0, i = t3 ?? 1, a = n2 ?? g.Undefined;
    e29 !== void 0 && (t3 === void 0 ? a = e29 : r2 = e29), this.useException((e30) => {
      let t4 = R._api._MagickImage_AdaptiveSharpen(this._instance, r2, i, T(a), e30.ptr);
      this._setInstance(t4, e30);
    });
  }
  adaptiveThreshold(e29, t3, n2, r2) {
    let i = n2 instanceof I ? n2._toQuantum() : 0, a = r2 ?? g.Undefined;
    typeof n2 == "number" && (a = n2), this.useException((n3) => {
      let r3 = R._api._MagickImage_AdaptiveThreshold(this._instance, T(e29), T(t3), i, T(a), n3.ptr);
      this._setInstance(r3, n3);
    });
  }
  addNoise(e29, t3, n2) {
    let r2 = 1, i = n2 ?? g.Undefined;
    t3 !== void 0 && (n2 === void 0 ? i = t3 : r2 = t3), this.useException((t4) => {
      let n3 = R._api._MagickImage_AddNoise(this._instance, T(e29), r2, T(i), t4.ptr);
      this._setInstance(n3, t4);
    });
  }
  affineTransform(e29) {
    this.useException((t3) => {
      let n2 = R._api._MagickImage_AffineTransform(this._instance, e29.scaleX, e29.scaleY, e29.shearX, e29.shearY, e29.translateX, e29.translateY, t3.ptr);
      this._setInstance(n2, t3);
    });
  }
  alpha(e29) {
    this.useExceptionPointer((t3) => {
      R._api._MagickImage_SetAlpha(this._instance, T(e29), t3);
    });
  }
  annotate(e29, t3, n2, r2) {
    return this.useExceptionPointer((i) => this._settings._drawing._use((a) => {
      C(e29, (e30) => {
        let o = null, s = j.Undefined, c = 0;
        typeof t3 == "object" ? (o = t3.toString(), n2 !== void 0 && (s = n2), r2 !== void 0 && (c = r2)) : (s = t3, n2 !== void 0 && (c = n2)), C(o, (t4) => {
          R._api._MagickImage_Annotate(this._instance, a._instance, e30, t4, T(s), c, i);
        });
      });
    }));
  }
  autoGamma(e29) {
    this.useExceptionPointer((t3) => {
      let n2 = this.valueOrDefault(e29, g.Composite);
      R._api._MagickImage_AutoGamma(this._instance, T(n2), t3);
    });
  }
  autoLevel(e29) {
    this.useExceptionPointer((t3) => {
      let n2 = this.valueOrDefault(e29, g.Undefined);
      R._api._MagickImage_AutoLevel(this._instance, T(n2), t3);
    });
  }
  autoOrient() {
    this.useException((e29) => {
      let t3 = R._api._MagickImage_AutoOrient(this._instance, e29.ptr);
      this._setInstance(t3, e29);
    });
  }
  autoThreshold(e29) {
    this.useException((t3) => {
      R._api._MagickImage_AutoThreshold(this._instance, T(e29), t3.ptr);
    });
  }
  bilateralBlur(e29, t3, n2, r2) {
    let i = this.valueOrComputedDefault(n2, () => Math.sqrt(Number(e29 * e29 + t3 * t3))), a = this.valueOrDefault(r2, i * 0.25);
    this.useException((n3) => {
      let r3 = R._api._MagickImage_BilateralBlur(this._instance, T(e29), T(t3), i, a, n3.ptr);
      this._setInstance(r3, n3);
    });
  }
  blackThreshold(e29, t3) {
    let n2 = this.valueOrDefault(t3, g.Composite);
    this.useException((t4) => {
      C(e29.toString(), (e30) => {
        R._api._MagickImage_BlackThreshold(this._instance, e30, T(n2), t4.ptr);
      });
    });
  }
  blueShift(e29) {
    let t3 = this.valueOrDefault(e29, 1.5);
    this.useException((e30) => {
      let n2 = R._api._MagickImage_BlueShift(this._instance, t3, e30.ptr);
      this._setInstance(n2, e30);
    });
  }
  blur(e29, t3, n2) {
    let r2 = 0, i = this.valueOrDefault(t3, 1), a = this.valueOrDefault(n2, g.Undefined);
    e29 !== void 0 && (t3 === void 0 ? a = e29 : r2 = e29), this.useException((e30) => {
      let t4 = R._api._MagickImage_Blur(this._instance, r2, i, T(a), e30.ptr);
      this._setInstance(t4, e30);
    });
  }
  border(e29, t3) {
    let n2 = new E(0, 0, e29, this.valueOrDefault(t3, e29));
    this.useException((e30) => {
      n2._toRectangle((t4) => {
        let n3 = R._api._MagickImage_Border(this._instance, t4, e30.ptr);
        this._setInstance(n3, e30);
      });
    });
  }
  brightnessContrast(e29, t3, n2) {
    let r2 = this.valueOrDefault(n2, g.Undefined);
    this.useException((n3) => {
      R._api._MagickImage_BrightnessContrast(this._instance, e29.toDouble(), t3.toDouble(), T(r2), n3.ptr);
    });
  }
  cannyEdge(e29, t3, n2, r2) {
    let i = this.valueOrDefault(e29, 0), a = this.valueOrDefault(t3, 1), o = this.valueOrDefault(n2, new I(10)).toDouble() / 100, s = this.valueOrDefault(r2, new I(30)).toDouble() / 100;
    this.useException((e30) => {
      let t4 = R._api._MagickImage_CannyEdge(this._instance, i, a, o, s, e30.ptr);
      this._setInstance(t4, e30);
    });
  }
  charcoal(e29, t3) {
    let n2 = e29 === void 0 ? 0 : e29, r2 = t3 === void 0 ? 1 : t3;
    this.useException((e30) => {
      let t4 = R._api._MagickImage_Charcoal(this._instance, n2, r2, e30.ptr);
      this._setInstance(t4, e30);
    });
  }
  chop(e29) {
    this.useException((t3) => {
      e29._toRectangle((e30) => {
        let n2 = R._api._MagickImage_Chop(this._instance, e30, t3.ptr);
        this._setInstance(n2, t3);
      });
    });
  }
  chopHorizontal(e29, t3) {
    this.chop(new E(e29, 0, t3, 0));
  }
  chopVertical(e29, t3) {
    this.chop(new E(0, e29, 0, t3));
  }
  clahe(e29, t3, n2, r2) {
    this.useExceptionPointer((i) => {
      let a = T(e29 instanceof I ? e29.multiply(this.width) : e29), o = T(t3 instanceof I ? t3.multiply(this.height) : t3);
      R._api._MagickImage_Clahe(this._instance, a, o, T(n2), r2, i);
    });
  }
  clone(e29) {
    return t2._clone(this)._use(e29);
  }
  cloneArea(e29, n2) {
    return k.usePointer((r2) => e29._toRectangle((i) => Be._use(0, 0, (a) => {
      let o = R._api._MagickImage_CloneArea(this._instance, T(e29.width), T(e29.height), r2);
      return R._api._MagickImage_CopyPixels(o, this._instance, i, a, T(g.Undefined), r2), n2(new t2(o, this._settings));
    })));
  }
  clut(e29, t3, n2) {
    let r2 = this.valueOrDefault(t3, Ke.Undefined), i = this.valueOrDefault(n2, g.Undefined);
    this.useExceptionPointer((t4) => {
      R._api._MagickImage_Clut(this._instance, e29._instance, T(r2), T(i), t4);
    });
  }
  colorAlpha(e29) {
    if (!this.hasAlpha) return;
    let n2 = t2.create();
    n2.read(e29, this.width, this.height), n2.composite(this, le.SrcOver, new me(0, 0)), this._instance = n2._instance;
  }
  colorDecisionList(e29) {
    this.useExceptionPointer((t3) => {
      C(e29, (e30) => {
        R._api._MagickImage_ColorDecisionList(this._instance, e30, t3);
      });
    });
  }
  compare(e29, n2, r2, i) {
    let a = n2 instanceof ce, o = a ? n2.metric : n2, s = r2;
    i !== void 0 && (s = i);
    let c = g.Undefined;
    if (typeof s != "function") return s !== void 0 && (c = s), this.useExceptionPointer((t3) => R._api._MagickImage_CompareDistortion(this._instance, e29._instance, T(o), T(c), t3));
    r2 !== void 0 && typeof r2 != "function" && (c = r2);
    let l = Re.use(this, (r3) => (a && n2._setArtifacts(r3), A.use((n3) => {
      let r4 = this.useExceptionPointer((t3) => R._api._MagickImage_Compare(this._instance, e29._instance, T(o), T(c), n3.ptr, t3)), i2 = n3.value, a2 = t2._createFromImage(r4, this._settings);
      return se._create(i2, a2);
    })));
    return l.difference._use(() => s(l));
  }
  composite(e29, t3, n2, r2, i) {
    let a = 0, o = 0, s = le.In, c = g.All, l = null;
    t3 instanceof me ? (a = t3.x, o = t3.y) : t3 !== void 0 && (s = t3), n2 instanceof me ? (a = n2.x, o = n2.y) : typeof n2 == "string" ? l = n2 : n2 !== void 0 && (c = n2), typeof r2 == "string" ? l = r2 : r2 !== void 0 && (c = r2), i !== void 0 && (c = i), l !== null && this.setArtifact("compose:args", l), this.useExceptionPointer((t4) => {
      R._api._MagickImage_Composite(this._instance, e29._instance, T(a), T(o), T(s), T(c), t4);
    }), l !== null && this.removeArtifact("compose:args");
  }
  compositeGravity(e29, t3, n2, r2, i, a) {
    let o = 0, s = 0, c = le.In, l = g.All, u = null;
    n2 instanceof me ? (o = n2.x, s = n2.y) : n2 !== void 0 && (c = n2), r2 instanceof me ? (o = r2.x, s = r2.y) : typeof r2 == "string" ? u = r2 : r2 !== void 0 && (l = r2), typeof i == "string" ? u = i : i !== void 0 && (l = i), a !== void 0 && (l = a), u !== null && this.setArtifact("compose:args", u), this.useExceptionPointer((n3) => {
      R._api._MagickImage_CompositeGravity(this._instance, e29._instance, T(t3), T(o), T(s), T(c), T(l), n3);
    }), u !== null && this.removeArtifact("compose:args");
  }
  connectedComponents(e29) {
    let t3 = typeof e29 == "number" ? new ge(e29) : e29;
    return Re.use(this, (e30) => (t3._setArtifacts(e30), this.useException((e31) => be.use((n2) => {
      try {
        let r2 = R._api._MagickImage_ConnectedComponents(this._instance, T(t3.connectivity), n2.ptr, e31.ptr);
        return this._setInstance(r2, e31), he._create(n2.value, Number(this.colormapSize));
      } finally {
        n2.value !== R._api._NullPointer && R._api._ConnectedComponent_DisposeList(n2.value);
      }
    }))));
  }
  contrast = () => this.contrastPrivate(true);
  contrastStretch(e29, t3, n2) {
    let r2 = Number(this.width * this.height), i = e29.multiply(r2), a = 0, o = this.valueOrDefault(n2, g.Undefined);
    t3 instanceof I ? a = r2 - t3.multiply(r2) : (a = r2 - e29.multiply(r2), t3 !== void 0 && (o = t3)), this.useExceptionPointer((e30) => {
      R._api._MagickImage_ContrastStretch(this._instance, i, a, T(o), e30);
    });
  }
  static create(e29, n2, r2) {
    let i = new t2(t2.createInstance(), new Fe());
    return e29 !== void 0 && i.readOrPing(false, e29, n2, r2), i;
  }
  crop(e29, t3, n2) {
    let r2, i;
    typeof e29 == "number" ? t3 !== void 0 && (r2 = new E(e29, t3), i = this.valueOrDefault(n2, j.Undefined)) : (r2 = e29, i = this.valueOrDefault(t3, j.Undefined)), this.useException((e30) => {
      C(r2.toString(), (t4) => {
        let n3 = R._api._MagickImage_Crop(this._instance, t4, T(i), e30.ptr);
        this._setInstance(n3, e30);
      });
    });
  }
  cropToTiles(e29, t3, n2) {
    let r2, i;
    return typeof e29 == "number" && typeof t3 == "number" && n2 !== void 0 ? (r2 = new E(0, 0, e29, t3), i = n2) : typeof e29 != "number" && typeof t3 != "number" && (r2 = e29, i = t3), this.useException((e30) => C(r2.toString(), (t4) => {
      let n3 = R._api._MagickImage_CropToTiles(this._instance, t4, e30.ptr);
      return F._createFromImages(n3, this._settings, (e31) => i(e31));
    }));
  }
  cycleColormap(e29) {
    this.useExceptionPointer((t3) => {
      R._api._MagickImage_CycleColormap(this._instance, T(e29), t3);
    });
  }
  deskew(e29, t3) {
    return Re.use(this, (n2) => {
      t3 !== void 0 && n2.setArtifact("deskew:auto-crop", t3), this.useException((t4) => {
        let n3 = R._api._MagickImage_Deskew(this._instance, e29._toQuantum(), t4.ptr);
        this._setInstance(n3, t4);
      });
      let r2 = Number(this.getArtifact("deskew:angle"));
      return isNaN(r2) ? 0 : r2;
    });
  }
  determineBitDepth(e29) {
    let t3 = this.valueOrDefault(e29, g.Undefined);
    return this.useExceptionPointer((e30) => Number(R._api._MagickImage_DetermineBitDepth(this._instance, T(t3), e30)));
  }
  distort(e29, t3) {
    Re.use(this, (n2) => {
      let r2, i = 0;
      typeof e29 == "number" ? r2 = e29 : (r2 = e29.method, i = +!!e29.bestFit, e29._setArtifacts(n2)), this.useException((e30) => {
        we(t3, (n3) => {
          let a = R._api._MagickImage_Distort(this._instance, T(r2), i, n3, T(t3.length), e30.ptr);
          this._setInstance(a, e30);
        });
      });
    });
  }
  draw(...e29) {
    let t3 = e29.flat();
    t3.length !== 0 && Ee._use(this, (e30) => {
      e30.draw(t3);
    });
  }
  evaluate(e29, t3, n2, r2) {
    if (typeof t3 == "number") {
      let r3 = t3, i = typeof n2 == "number" ? n2 : n2._toQuantum();
      this.useExceptionPointer((t4) => {
        R._api._MagickImage_EvaluateOperator(this._instance, T(e29), T(r3), i, t4);
      });
    } else if (r2 !== void 0) {
      if (typeof n2 != "number") throw new y("this should not happen");
      let i = t3, a = n2, o = typeof r2 == "number" ? r2 : r2._toQuantum();
      if (i.isPercentage) throw new y("percentage is not supported");
      this.useExceptionPointer((t4) => {
        ze.use(this, i, (n3) => {
          R._api._MagickImage_EvaluateGeometry(this._instance, T(e29), n3, T(a), o, t4);
        });
      });
    }
  }
  extent(e29, t3, n2) {
    let r2 = j.Undefined, i;
    typeof e29 == "number" ? typeof t3 == "number" && (i = new E(e29, t3)) : i = e29, typeof t3 == "number" ? r2 = t3 : t3 !== void 0 && (this.backgroundColor = t3), typeof n2 == "number" ? r2 = n2 : n2 !== void 0 && (this.backgroundColor = n2), this.useException((e30) => {
      C(i.toString(), (t4) => {
        let n3 = R._api._MagickImage_Extent(this._instance, t4, T(r2), e30.ptr);
        this._setInstance(n3, e30);
      });
    });
  }
  flip() {
    this.useException((e29) => {
      let t3 = R._api._MagickImage_Flip(this._instance, e29.ptr);
      this._setInstance(t3, e29);
    });
  }
  floodFill(e29, t3, n2, r2) {
    this.floodFillPrivate(e29, t3, n2, r2, false);
  }
  flop() {
    this.useException((e29) => {
      let t3 = R._api._MagickImage_Flop(this._instance, e29.ptr);
      this._setInstance(t3, e29);
    });
  }
  formatExpression(e29) {
    return this.useExceptionPointer((t3) => this._settings._use((n2) => C(e29, (e30) => {
      let r2 = R._api._MagickImage_FormatExpression(this._instance, n2._instance, e30, t3);
      return S(R._api, r2);
    })));
  }
  gammaCorrect(e29, t3) {
    let n2 = this.valueOrDefault(t3, g.Undefined);
    this.useExceptionPointer((t4) => {
      R._api._MagickImage_GammaCorrect(this._instance, e29, T(n2), t4);
    });
  }
  gaussianBlur(e29, t3, n2) {
    let r2 = this.valueOrDefault(t3, 1), i = this.valueOrDefault(n2, g.Undefined);
    this.useException((t4) => {
      let n3 = R._api._MagickImage_GaussianBlur(this._instance, e29, r2, T(i), t4.ptr);
      this._setInstance(n3, t4);
    });
  }
  getArtifact(e29) {
    return C(e29, (e30) => b(R._api._MagickImage_GetArtifact(this._instance, e30)));
  }
  getAttribute(e29) {
    return this.useException((t3) => C(e29, (e30) => b(R._api._MagickImage_GetAttribute(this._instance, e30, t3.ptr))));
  }
  getColormapColor(e29) {
    let t3 = R._api._MagickImage_GetColormapColor(this._instance, T(e29));
    return t3 === R._api._NullPointer ? null : w._create(t3);
  }
  getColorProfile() {
    for (let e29 of ["icc", "icm"]) {
      let t3 = this.getProfilePrivate(e29);
      if (t3 !== null) return new ae(t3);
    }
    return null;
  }
  getPixels(e29) {
    if (this._settings._ping) throw new y("image contains no pixel data");
    return We._use(this, e29);
  }
  getProfile(e29) {
    let t3 = this.getProfilePrivate(e29);
    return t3 === null ? null : new ie(e29, t3);
  }
  getWriteMask(e29) {
    let n2 = this.useExceptionPointer((e30) => R._api._MagickImage_GetWriteMask(this._instance, e30)), r2 = n2 === R._api._NullPointer ? null : new t2(n2, new Fe());
    return r2 == null ? e29(r2) : r2._use(e29);
  }
  grayscale(e29 = Ge.Undefined) {
    this.useExceptionPointer((t3) => {
      R._api._MagickImage_Grayscale(this._instance, T(e29), t3);
    });
  }
  hasProfile(e29) {
    return C(e29, (e30) => this.toBool(R._api._MagickImage_HasProfile(this._instance, e30)));
  }
  histogram() {
    let e29 = /* @__PURE__ */ new Map();
    return this.useExceptionPointer((t3) => {
      be.use((n2) => {
        let r2 = R._api._MagickImage_Histogram(this._instance, n2.ptr, t3);
        if (r2 !== R._api._NullPointer) {
          let t4 = n2.value;
          for (let n3 = 0; n3 < t4; n3++) {
            let t5 = R._api._MagickColorCollection_Get(r2, T(n3)), i = w._create(t5), a = R._api._MagickColor_Count_Get(t5);
            e29.set(i.toString(), a);
          }
          R._api._MagickColorCollection_Dispose(r2);
        }
      });
    }), e29;
  }
  inverseContrast = () => this.contrastPrivate(false);
  inverseFloodFill(e29, t3, n2, r2) {
    this.floodFillPrivate(e29, t3, n2, r2, true);
  }
  inverseLevel(e29, t3, n2, r2) {
    let i = this.valueOrDefault(n2, 1), a = this.valueOrDefault(r2, g.Composite);
    this.useExceptionPointer((n3) => {
      R._api._MagickImage_InverseLevel(this._instance, e29.toDouble(), t3._toQuantum(), i, T(a), n3);
    });
  }
  inverseLevelColors(e29, t3, n2) {
    this.levelColorsPrivate(true, e29, t3, n2);
  }
  inverseOpaque = (e29, t3) => this.opaquePrivate(e29, t3, true);
  inverseSigmoidalContrast(e29, t3, n2) {
    this.sigmoidalContrastPrivate(false, e29, t3, n2);
  }
  inverseTransparent = (e29) => this.transparentPrivate(e29, true);
  level(e29, t3, n2, r2) {
    let i = this.valueOrDefault(n2, 1), a = this.valueOrDefault(r2, g.Composite);
    this.useExceptionPointer((n3) => {
      R._api._MagickImage_Level(this._instance, e29.toDouble(), t3._toQuantum(), i, T(a), n3);
    });
  }
  levelColors(e29, t3, n2) {
    this.levelColorsPrivate(false, e29, t3, n2);
  }
  linearStretch(e29, t3) {
    this.useExceptionPointer((n2) => {
      R._api._MagickImage_LinearStretch(this._instance, e29.toDouble(), t3._toQuantum(), n2);
    });
  }
  liquidRescale(e29, t3) {
    let n2 = typeof e29 == "number" ? new E(e29, t3) : e29;
    this.useException((e30) => {
      C(n2.toString(), (t4) => {
        let r2 = R._api._MagickImage_LiquidRescale(this._instance, t4, Number(n2.x), Number(n2.y), e30.ptr);
        this._setInstance(r2, e30);
      });
    });
  }
  negate(e29) {
    this.useExceptionPointer((t3) => {
      let n2 = this.valueOrDefault(e29, g.Undefined);
      R._api._MagickImage_Negate(this._instance, 0, T(n2), t3);
    });
  }
  negateGrayScale(e29) {
    this.useExceptionPointer((t3) => {
      let n2 = this.valueOrDefault(e29, g.Undefined);
      R._api._MagickImage_Negate(this._instance, 1, T(n2), t3);
    });
  }
  normalize() {
    this.useExceptionPointer((e29) => {
      R._api._MagickImage_Normalize(this._instance, e29);
    });
  }
  modulate(e29, t3, n2) {
    let r2 = this.valueOrDefault(t3, new I(100)), i = this.valueOrDefault(n2, new I(100));
    this.useExceptionPointer((t4) => {
      C(`${e29.toDouble()}/${r2.toDouble()}/${i.toDouble()}`, (e30) => {
        R._api._MagickImage_Modulate(this._instance, e30, t4);
      });
    });
  }
  morphology(e29) {
    this.useException((t3) => {
      C(e29.kernel, (n2) => {
        let r2 = R._api._MagickImage_Morphology(this._instance, T(e29.method), n2, T(e29.channels), T(e29.iterations), t3.ptr);
        this._setInstance(r2, t3);
      });
    });
  }
  motionBlur(e29, t3, n2) {
    this.useException((r2) => {
      let i = R._api._MagickImage_MotionBlur(this._instance, e29, t3, n2, r2.ptr);
      this._setInstance(i, r2);
    });
  }
  oilPaint(e29) {
    let t3 = this.valueOrDefault(e29, 3);
    this.useException((e30) => {
      let n2 = R._api._MagickImage_OilPaint(this._instance, t3, 0, e30.ptr);
      this._setInstance(n2, e30);
    });
  }
  opaque = (e29, t3) => this.opaquePrivate(e29, t3, false);
  ping(e29, t3) {
    this.readOrPing(true, e29, t3);
  }
  perceptualHash(e29) {
    let t3 = this.valueOrDefault(e29, Ue._defaultColorspaces());
    return Ue._validateColorSpaces(t3), Re.use(this, (e30) => {
      let n2 = t3.map((e31) => te[e31]).join(",");
      return e30.setArtifact("phash:colorspaces", n2), this.useExceptionPointer((e31) => {
        let n3 = R._api._MagickImage_PerceptualHash(this._instance, e31);
        try {
          return Ue._create(this, t3, n3);
        } finally {
          R._api._PerceptualHash_DisposeList(n3);
        }
      });
    });
  }
  quantize(e29) {
    let t3 = this.valueOrDefault(e29, new Le());
    return this.useException((e30) => {
      t3._use((t4) => {
        R._api._MagickImage_Quantize(this._instance, t4._instance, e30.ptr);
      });
    }), t3.measureErrors ? ke._create(this) : null;
  }
  read(e29, t3, n2) {
    this.readOrPing(false, e29, t3, n2);
  }
  readFromCanvas(e29, t3) {
    let n2 = e29.getContext("2d", t3);
    if (n2 === null) return;
    let r2 = n2.getImageData(0, 0, e29.width, e29.height), i = new N();
    i.format = Ae.Rgba, i.width = e29.width, i.height = e29.height, this.useException((e30) => {
      this.readFromArray(r2.data, i, e30);
    });
  }
  removeArtifact(e29) {
    C(e29, (e30) => {
      R._api._MagickImage_RemoveArtifact(this._instance, e30);
    });
  }
  removeAttribute(e29) {
    C(e29, (e30) => {
      R._api._MagickImage_RemoveAttribute(this._instance, e30);
    });
  }
  removeProfile(e29) {
    C(typeof e29 == "string" ? e29 : e29.name, (e30) => {
      R._api._MagickImage_RemoveProfile(this._instance, e30);
    });
  }
  removeWriteMask() {
    this.useExceptionPointer((e29) => {
      R._api._MagickImage_SetWriteMask(this._instance, R._api._NullPointer, e29);
    });
  }
  resetPage() {
    this.page = new E(0, 0, 0, 0);
  }
  resize(e29, t3, n2) {
    let r2 = this.filterType, i;
    typeof e29 == "number" ? (i = new E(e29, t3), n2 !== void 0 && (r2 = n2)) : (i = e29, t3 !== void 0 && (r2 = t3)), this.useException((e30) => {
      C(i.toString(), (t4) => {
        let n3 = R._api._MagickImage_Resize(this._instance, t4, r2, e30.ptr);
        this._setInstance(n3, e30);
      });
    });
  }
  roll(e29, t3) {
    this.useException((n2) => {
      let r2 = R._api._MagickImage_Roll(this._instance, T(e29), T(t3), n2.ptr);
      this._setInstance(r2, n2);
    });
  }
  rotate(e29) {
    this.useException((t3) => {
      let n2 = R._api._MagickImage_Rotate(this._instance, e29, t3.ptr);
      this._setInstance(n2, t3);
    });
  }
  separate(e29, t3) {
    return this.useException((n2) => {
      let r2, i = g.Undefined;
      if (typeof e29 == "number" && t3 !== void 0) i = e29, r2 = t3;
      else if (typeof e29 == "function") r2 = e29;
      else throw new y("invalid arguments");
      let a = R._api._MagickImage_Separate(this._instance, T(i), n2.ptr);
      return F._createFromImages(a, this._settings, (e30) => r2(e30));
    });
  }
  sepiaTone(e29 = new I(80)) {
    this.useException((t3) => {
      let n2 = typeof e29 == "number" ? new I(e29) : e29, r2 = R._api._MagickImage_SepiaTone(this._instance, n2._toQuantum(), t3.ptr);
      this._setInstance(r2, t3);
    });
  }
  setArtifact(e29, t3) {
    let n2;
    n2 = typeof t3 == "string" ? t3 : typeof t3 == "boolean" ? this.fromBool(t3).toString() : t3.toString(), C(e29, (e30) => {
      C(n2, (t4) => {
        R._api._MagickImage_SetArtifact(this._instance, e30, t4);
      });
    });
  }
  setAttribute(e29, t3) {
    this.useException((n2) => {
      C(e29, (e30) => {
        C(t3, (t4) => {
          R._api._MagickImage_SetAttribute(this._instance, e30, t4, n2.ptr);
        });
      });
    });
  }
  setCompression(e29) {
    R._api._MagickImage_Compression_Set(this._instance, T(e29));
  }
  setProfile(e29, t3) {
    let n2 = typeof e29 == "string" ? e29 : e29.name, r2;
    t3 === void 0 ? typeof e29 != "string" && (r2 = e29.data) : r2 = t3, this.useException((e30) => {
      C(n2, (t4) => {
        Ce(r2, (n3) => {
          R._api._MagickImage_SetProfile(this._instance, t4, n3, T(r2.byteLength), e30.ptr);
        });
      });
    });
  }
  setWriteMask(e29) {
    this.useExceptionPointer((t3) => {
      R._api._MagickImage_SetWriteMask(this._instance, e29._instance, t3);
    });
  }
  shadow(e29, t3, n2, r2, i) {
    let a, o = typeof e29 == "number" ? e29 : 5, s = this.valueOrDefault(t3, 5), c = this.valueOrDefault(n2, 0.5), l = this.valueOrDefault(r2, new I(80)), u = typeof e29 == "number" ? i : e29;
    u !== void 0 && (a = this.backgroundColor, this.backgroundColor = u);
    try {
      this.useException((e30) => {
        let t4 = R._api._MagickImage_Shadow(this._instance, T(o), T(s), c, l.toDouble(), e30.ptr);
        this._setInstance(t4, e30);
      });
    } finally {
      a !== void 0 && (this.backgroundColor = a);
    }
  }
  sharpen(e29, t3, n2) {
    let r2 = this.valueOrDefault(e29, 0), i = this.valueOrDefault(t3, 1), a = this.valueOrDefault(n2, g.Undefined);
    this.useException((e30) => {
      let t4 = R._api._MagickImage_Sharpen(this._instance, r2, i, T(a), e30.ptr);
      this._setInstance(t4, e30);
    });
  }
  shave(e29, t3) {
    this.useException((n2) => {
      let r2 = R._api._MagickImage_Shave(this._instance, T(e29), T(t3), n2.ptr);
      this._setInstance(r2, n2);
    });
  }
  sigmoidalContrast(e29, t3, n2) {
    this.sigmoidalContrastPrivate(true, e29, t3, n2);
  }
  solarize(e29 = new I(50)) {
    this.useException((t3) => {
      let n2 = typeof e29 == "number" ? new I(e29) : e29;
      R._api._MagickImage_Solarize(this._instance, n2._toQuantum(), t3.ptr);
    });
  }
  splice(e29, t3) {
    let n2 = this.valueOrDefault(t3, j.Undefined);
    C(e29.toString(), (e30) => {
      this.useException((t4) => {
        let r2 = R._api._MagickImage_Splice(this._instance, e30, T(n2), t4.ptr);
        this._setInstance(r2, t4);
      });
    });
  }
  statistics(e29) {
    let t3 = this.valueOrDefault(e29, g.All);
    return this.useExceptionPointer((e30) => {
      let n2 = R._api._MagickImage_Statistics(this._instance, T(t3), e30), r2 = Ye._create(this, n2, t3);
      return R._api._Statistics_DisposeList(n2), r2;
    });
  }
  strip() {
    this.useExceptionPointer((e29) => {
      R._api._MagickImage_Strip(this._instance, e29);
    });
  }
  transformColorSpace(e29, t3, n2) {
    let r2 = e29, i, a = oe.Quantum;
    t3 !== void 0 && (typeof t3 == "number" ? a = t3 : i = t3), n2 !== void 0 && (a = n2);
    let o = this.hasProfile("icc") || this.hasProfile("icm");
    if (i === void 0) {
      if (!o) return false;
      i = r2;
    } else {
      if (r2.colorSpace !== this.colorSpace) return false;
      o || this.setProfile(r2);
    }
    return a === oe.Quantum ? Re.use(this, (e30) => {
      e30.setArtifact("profile:highres-transform", false), this.setProfile(i);
    }) : this.setProfile(i), true;
  }
  threshold(e29, t3) {
    let n2 = this.valueOrDefault(t3, g.Undefined);
    this.useExceptionPointer((t4) => {
      R._api._MagickImage_Threshold(this._instance, e29._toQuantum(), T(n2), t4);
    });
  }
  thumbnail(e29, t3) {
    let n2 = typeof e29 == "number" ? new E(e29, t3) : e29;
    this.useException((e30) => {
      C(n2.toString(), (t4) => {
        let n3 = R._api._MagickImage_Thumbnail(this._instance, t4, e30.ptr);
        this._setInstance(n3, e30);
      });
    });
  }
  toString = () => `${this.format} ${this.width}x${this.height} ${this.depth}-bit ${te[this.colorSpace]}`;
  transparent(e29) {
    e29._use((e30) => {
      this.useExceptionPointer((t3) => {
        R._api._MagickImage_Transparent(this._instance, e30, 0, t3);
      });
    });
  }
  trim(...e29) {
    if (e29.length > 0) {
      if (e29.length == 1 && e29[0] instanceof I) {
        let t3 = e29[0];
        this.setArtifact("trim:percent-background", t3.toDouble().toString());
      } else {
        let t3 = [...new Set(De(e29))].join(",");
        this.setArtifact("trim:edges", t3);
      }
    }
    this.useException((e30) => {
      let t3 = R._api._MagickImage_Trim(this._instance, e30.ptr);
      this._setInstance(t3, e30), this.removeArtifact("trim:edges"), this.removeArtifact("trim:percent-background");
    });
  }
  wave(e29, t3, n2) {
    let r2 = this.valueOrDefault(e29, this.interpolate), i = this.valueOrDefault(t3, 25), a = this.valueOrDefault(n2, 150);
    this.useException((e30) => {
      let t4 = R._api._MagickImage_Wave(this._instance, T(r2), i, a, e30.ptr);
      this._setInstance(t4, e30);
    });
  }
  vignette(e29, t3, n2, r2) {
    let i = this.valueOrDefault(e29, 0), a = this.valueOrDefault(t3, 1), o = this.valueOrDefault(n2, 0), s = this.valueOrDefault(r2, 0);
    this.useException((e30) => {
      let t4 = R._api._MagickImage_Vignette(this._instance, i, a, T(o), T(s), e30.ptr);
      this._setInstance(t4, e30);
    });
  }
  whiteThreshold(e29, t3) {
    let n2 = this.valueOrDefault(t3, g.Composite);
    this.useException((t4) => {
      C(e29.toString(), (e30) => {
        R._api._MagickImage_WhiteThreshold(this._instance, e30, T(n2), t4.ptr);
      });
    });
  }
  write(e29, t3) {
    let n2 = R._api._NullPointer, r2 = 0;
    t3 === void 0 ? t3 = e29 : this._settings.format = e29, this.useException((e30) => {
      be.use((t4) => {
        this._settings._use((i2) => {
          try {
            n2 = R._api._MagickImage_WriteBlob(this._instance, i2._instance, t4.ptr, e30.ptr), r2 = Number(t4.value);
          } catch (e31) {
            throw n2 !== R._api._NullPointer && (n2 = R._api._MagickMemory_Relinquish(n2)), e31;
          }
        });
      });
    });
    let i = new ve(n2, r2, t3);
    return O._disposeAfterExecution(i, i.func);
  }
  writeToCanvas(e29, t3) {
    e29.width = this.width, e29.height = this.height;
    let n2 = e29.getContext("2d", t3);
    n2 !== null && We._map(this, "RGBA", (e30) => {
      let t4 = n2.createImageData(this.width, this.height), r2 = 0;
      for (let n3 = 0; n3 < this.height; n3++) for (let n4 = 0; n4 < this.width; n4++) t4.data[r2++] = R._api.HEAPU8[e30++], t4.data[r2++] = R._api.HEAPU8[e30++], t4.data[r2++] = R._api.HEAPU8[e30++], t4.data[r2++] = R._api.HEAPU8[e30++];
      n2.putImageData(t4, 0, 0);
    });
  }
  static _createFromImage(e29, n2) {
    return new t2(e29, n2);
  }
  _channelOffset(e29) {
    return R._api._MagickImage_HasChannel(this._instance, T(e29)) ? Number(R._api._MagickImage_ChannelOffset(this._instance, T(e29))) : -1;
  }
  static _clone(e29) {
    return k.usePointer((n2) => new t2(R._api._MagickImage_Clone(e29._instance, n2), e29._settings._clone()));
  }
  _getSettings() {
    return this._settings;
  }
  _instanceNotInitialized() {
    throw new y("no image has been read");
  }
  _setInstance(e29, t3) {
    if (super._setInstance(e29, t3) === true || e29 === R._api._NullPointer && this.onProgress !== void 0) return true;
    throw new y("out of memory");
  }
  _use(e29) {
    return O._disposeAfterExecution(this, e29);
  }
  static _create(e29) {
    return t2.create()._use(e29);
  }
  onDispose() {
    this.disposeProgressDelegate();
  }
  contrastPrivate(e29) {
    this.useExceptionPointer((t3) => {
      R._api._MagickImage_Contrast(this._instance, this.fromBool(e29), t3);
    });
  }
  static createInstance() {
    return k.usePointer((e29) => R._api._MagickImage_Create(R._api._NullPointer, e29));
  }
  disposeProgressDelegate() {
    nt.removeProgressDelegate(this), this._progress = void 0;
  }
  floodFillPrivate(e29, n2, r2, i, a) {
    let o = i;
    o === void 0 && this.getPixels((e30) => {
      let t3 = e30.getColor(n2, r2);
      t3 !== null && (o = t3);
    }), typeof e29 == "number" && o !== void 0 && (o.a = e29), this.settings._drawing._use((i2) => {
      e29 instanceof w ? (i2.setFillColor(e29), i2.setFillPattern()) : e29 instanceof t2 && (i2.setFillColor(), i2.setFillPattern(e29)), this.useExceptionPointer((e30) => {
        o === void 0 ? R._api._MagickImage_FloodFill(this._instance, i2._instance, T(n2), T(r2), R._api._NullPointer, this.fromBool(a), e30) : o._use((t3) => {
          R._api._MagickImage_FloodFill(this._instance, i2._instance, T(n2), T(r2), t3, this.fromBool(a), e30);
        });
      });
    });
  }
  fromBool(e29) {
    return +!!e29;
  }
  getProfilePrivate(e29) {
    return C(e29, (e30) => {
      let t3 = R._api._MagickImage_GetProfile(this._instance, e30), n2 = Xe.toArray(t3);
      return n2 === null ? null : n2;
    });
  }
  levelColorsPrivate(e29, t3, n2, r2) {
    let i = this.valueOrDefault(r2, g.RGB);
    this.useExceptionPointer((r3) => {
      t3._use((t4) => {
        n2._use((n3) => {
          R._api._MagickImage_LevelColors(this._instance, t4, n3, T(i), this.fromBool(e29), r3);
        });
      });
    });
  }
  onSettingsArtifactChanged(e29, t3) {
    t3 === void 0 ? this.removeArtifact(e29) : this.setArtifact(e29, t3);
  }
  opaquePrivate(e29, t3, n2) {
    this.useExceptionPointer((r2) => {
      e29._use((e30) => {
        t3._use((t4) => {
          R._api._MagickImage_Opaque(this._instance, e30, t4, this.fromBool(n2), r2);
        });
      });
    });
  }
  readOrPing(t3, n2, r2, i) {
    this.useException((a) => {
      let o = r2 instanceof N ? r2 : new N(this._settings);
      if (o._ping = t3, this._settings._ping = t3, o.frameCount !== void 0 && o.frameCount > 1) throw new y("The frame count can only be set to 1 when a single image is being read.");
      if (typeof n2 == "string") o._fileName = n2;
      else if (e(n2)) {
        this.readFromArray(n2, o, a);
        return;
      } else o._fileName = "xc:" + n2.toShortString(), o.width = typeof r2 == "number" ? r2 : 0, o.height = typeof i == "number" ? i : 0;
      o._use((e29) => {
        let t4 = R._api._MagickImage_ReadFile(e29._instance, a.ptr);
        this._setInstance(t4, a);
      });
    });
  }
  readFromArray(e29, t3, n2) {
    t3._use((t4) => {
      Ce(e29, (r2) => {
        let i = T(e29.byteLength), a = R._api._MagickImage_ReadBlob(t4._instance, r2, R._api._NullPointer, i, n2.ptr);
        this._setInstance(a, n2);
      });
    });
  }
  sigmoidalContrastPrivate(e29, t3, n2, r2) {
    let i;
    i = n2 === void 0 ? de.max * 0.5 : typeof n2 == "number" ? n2 : n2.multiply(de.max);
    let a = T(this.valueOrDefault(r2, g.Undefined));
    this.useExceptionPointer((n3) => {
      R._api._MagickImage_SigmoidalContrast(this._instance, this.fromBool(e29), t3, i, a, n3);
    });
  }
  toBool(e29) {
    return e29 === 1;
  }
  transparentPrivate(e29, t3) {
    e29._use((e30) => {
      this.useExceptionPointer((n2) => {
        R._api._MagickImage_Transparent(this._instance, e30, this.fromBool(t3), n2);
      });
    });
  }
  valueOrDefault(e29, t3) {
    return e29 === void 0 ? t3 : e29;
  }
  valueOrComputedDefault(e29, t3) {
    return e29 === void 0 ? t3() : e29;
  }
  useException(e29) {
    return k.use(e29, (e30) => {
      this.onWarning !== void 0 && this.onWarning(new Ze(e30));
    });
  }
  useExceptionPointer(e29) {
    return k.usePointer(e29, (e30) => {
      this.onWarning !== void 0 && this.onWarning(new Ze(e30));
    });
  }
};
async function $e(e29 = {}) {
  var t3 = e29, n2 = !!globalThis.window, r2 = !!globalThis.WorkerGlobalScope;
  globalThis.process?.versions?.node && globalThis.process?.type, (!globalThis.crypto || !globalThis.crypto.getRandomValues) && (globalThis.crypto = { getRandomValues: (e30) => {
    for (let t4 = 0; t4 < e30.length; t4++) e30[t4] = Math.random() * 256 | 0;
  } }), t3._CastToSize = (e30) => BigInt(e30), t3._NullPointer = 0n, t3._PointerSize = 8;
  var i = "./this.program", a = (e30, t4) => {
    throw t4;
  }, o = {}.url, s = "";
  function c(e30) {
    return t3.locateFile ? t3.locateFile(e30, s) : s + e30;
  }
  var l, u;
  if (n2 || r2) {
    try {
      s = new URL(".", o).href;
    } catch {
    }
    r2 && (u = (e30) => {
      var t4 = new XMLHttpRequest();
      return t4.open("GET", e30, false), t4.responseType = "arraybuffer", t4.send(null), new Uint8Array(t4.response);
    }), l = async (e30) => {
      if (h2(e30)) return new Promise((t5, n3) => {
        var r3 = new XMLHttpRequest();
        r3.open("GET", e30, true), r3.responseType = "arraybuffer", r3.onload = () => {
          if (r3.status == 200 || r3.status == 0 && r3.response) {
            t5(r3.response);
            return;
          }
          n3(r3.status);
        }, r3.onerror = n3, r3.send(null);
      });
      var t4 = await fetch(e30, { credentials: "same-origin" });
      if (t4.ok) return t4.arrayBuffer();
      throw Error(t4.status + " : " + t4.url);
    };
  }
  var d = console.log.bind(console), f = console.error.bind(console), p2, m2 = false, h2 = (e30) => e30.startsWith("file://");
  class g2 {
  }
  class ee2 extends g2 {
  }
  class _2 extends g2 {
    constructor(e30) {
      super(), this.excPtr = e30;
    }
  }
  function te2() {
    return ki.buffer;
  }
  function ne2() {
    if (!b2?.buffer?.resizable) {
      var e30 = te2();
      b2 = new Int8Array(e30), ot = new Int16Array(e30), t3.HEAPU8 = P2 = new Uint8Array(e30), Nt = new Uint16Array(e30), R2 = new Int32Array(e30), z2 = new Uint32Array(e30), Pn = new Float32Array(e30), Fn = new Float64Array(e30), B = new BigInt64Array(e30), O2 = new BigUint64Array(e30);
    }
  }
  function re2() {
    !t3.noFSInit && !L.initialized && L.init(), N2.init(), io._b(), L.ignorePermissions = false;
  }
  function v2(e30) {
    throw e30 = `Aborted(${e30})`, f(e30), m2 = true, e30 += ". Build with -sASSERTIONS for more info.", new WebAssembly.RuntimeError(e30);
  }
  var ie2;
  function ae2() {
    return t3.locateFile ? c("magick.wasm") : new URL("data:text/plain;base64,").href;
  }
  function oe2(e30) {
    if (e30 == ie2 && p2) return new Uint8Array(p2);
    if (u) return u(e30);
    throw "both async and sync fetching of the wasm failed";
  }
  async function se2(e30) {
    if (!p2) try {
      var t4 = await l(e30);
      return new Uint8Array(t4);
    } catch {
    }
    return oe2(e30);
  }
  async function ce2(e30, t4) {
    try {
      var n3 = await se2(e30);
      return await WebAssembly.instantiate(n3, t4);
    } catch (e31) {
      f(`failed to asynchronously prepare wasm: ${e31}`), v2(e31);
    }
  }
  async function le2(e30, t4, n3) {
    if (!e30 && !h2(t4)) try {
      var r3 = fetch(t4, { credentials: "same-origin" });
      return await WebAssembly.instantiateStreaming(r3, n3);
    } catch (e31) {
      f(`wasm streaming compile failed: ${e31}`), f("falling back to ArrayBuffer instantiation");
    }
    return ce2(t4, n3);
  }
  function ue2() {
    return { a: Mi };
  }
  async function y2() {
    function e30(e31) {
      return io = e31.exports, io = no(io), ji(io), ne2(), io;
    }
    function n3(t4) {
      return e30(t4.instance);
    }
    var r3 = ue2(), i2 = t3.instantiateWasm;
    return i2 ? new Promise((t4) => {
      i2(r3, (n4) => t4(e30(n4)));
    }) : (ie2 ??= ae2(), n3(await le2(p2, ie2, r3)));
  }
  class de2 {
    name = "ExitStatus";
    constructor(e30) {
      this.message = `Program terminated with exit(${e30})`, this.status = e30;
    }
  }
  var b2, x2 = (e30) => Ci(e30), S2 = () => wi(), fe2 = 9007199254740992, C2 = -9007199254740992, w2 = (e30) => e30 < C2 || e30 > fe2 ? NaN : Number(e30), pe2 = [], T2 = (e30) => {
    e30 = Number(e30);
    var t4 = pe2[e30];
    return t4 || (pe2[e30] = t4 = Ai.get(BigInt(e30))), t4;
  };
  function E2(e30, t4) {
    return e30 = w2(e30), T2(e30)(t4);
  }
  var me2 = [], he2 = 0, ge2 = function(e30) {
    e30 = w2(e30);
    var t4 = (() => {
      var t5 = new ve2(e30);
      return t5.get_caught() || (t5.set_caught(true), he2--), t5.set_rethrown(false), me2.push(t5), Oi(e30);
    })();
    return BigInt(t4);
  }, D2 = null, _e2 = () => {
    $(0, 0);
    var e30 = me2.pop();
    Ti(e30.excPtr), D2 = null;
  }, O2;
  class ve2 {
    constructor(e30) {
      this.excPtr = e30, this.ptr = e30 - 48;
    }
    set_type(e30) {
      O2[(this.ptr + 8) / 8] = BigInt(e30);
    }
    get_type() {
      return Number(O2[(this.ptr + 8) / 8]);
    }
    set_destructor(e30) {
      O2[(this.ptr + 16) / 8] = BigInt(e30);
    }
    get_destructor() {
      return Number(O2[(this.ptr + 16) / 8]);
    }
    set_caught(e30) {
      e30 = +!!e30, b2[this.ptr + 24] = e30;
    }
    get_caught() {
      return b2[this.ptr + 24] != 0;
    }
    set_rethrown(e30) {
      e30 = +!!e30, b2[this.ptr + 25] = e30;
    }
    get_rethrown() {
      return b2[this.ptr + 25] != 0;
    }
    init(e30, t4) {
      this.set_adjusted_ptr(0), this.set_type(e30), this.set_destructor(t4);
    }
    set_adjusted_ptr(e30) {
      O2[(this.ptr + 32) / 8] = BigInt(e30);
    }
    get_adjusted_ptr() {
      return Number(O2[(this.ptr + 32) / 8]);
    }
  }
  var ye2 = (e30) => Si(e30), be2 = (e30) => {
    var t4 = D2?.excPtr;
    if (!t4) return ye2(0), 0;
    var n3 = new ve2(t4);
    n3.set_adjusted_ptr(t4);
    var r3 = n3.get_type();
    if (!r3) return ye2(0), t4;
    for (var i2 of e30) {
      if (!i2 || i2 === r3) break;
      var a2 = n3.ptr + 32;
      if (Di(i2, r3, a2)) return ye2(i2), t4;
    }
    return ye2(r3), t4;
  }, k2 = () => BigInt(be2([])), xe2 = (e30) => (e30 = w2(e30), BigInt(be2([e30]))), Se2 = (e30, t4, n3) => (e30 = w2(e30), t4 = w2(t4), n3 = w2(n3), BigInt(be2([
    e30,
    t4,
    n3
  ]))), Ce2 = () => {
    me2.length || v2("no exception to throw");
    var e30 = me2.at(-1), t4 = e30.excPtr;
    throw e30.set_rethrown(true), e30.set_caught(false), he2++, Ei(t4), D2 = new _2(t4), D2;
  };
  function we2(e30, t4, n3) {
    throw e30 = w2(e30), t4 = w2(t4), n3 = w2(n3), new ve2(e30).init(t4, n3), Ei(e30), D2 = new _2(e30), he2++, D2;
  }
  var Te2 = () => he2;
  function Ee2(e30) {
    throw e30 = w2(e30), D2 ||= new _2(e30), D2;
  }
  var A2 = {
    isAbs: (e30) => e30.charAt(0) === "/",
    splitPath: (e30) => /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(e30).slice(1),
    normalizeArray: (e30, t4) => {
      for (var n3 = 0, r3 = e30.length - 1; r3 >= 0; r3--) {
        var i2 = e30[r3];
        i2 === "." ? e30.splice(r3, 1) : i2 === ".." ? (e30.splice(r3, 1), n3++) : n3 && (e30.splice(r3, 1), n3--);
      }
      if (t4) for (; n3; n3--) e30.unshift("..");
      return e30;
    },
    normalize: (e30) => {
      var t4 = A2.isAbs(e30), n3 = e30.slice(-1) === "/";
      return e30 = A2.normalizeArray(e30.split("/").filter((e31) => !!e31), !t4).join("/"), !e30 && !t4 && (e30 = "."), e30 && n3 && (e30 += "/"), (t4 ? "/" : "") + e30;
    },
    dirname: (e30) => {
      var t4 = A2.splitPath(e30), n3 = t4[0], r3 = t4[1];
      return !n3 && !r3 ? "." : (r3 &&= r3.slice(0, -1), n3 + r3);
    },
    basename: (e30) => e30 && e30.match(/([^\/]+|\/)\/*$/)[1],
    join: (...e30) => A2.normalize(e30.join("/")),
    join2: (e30, t4) => A2.normalize(e30 + "/" + t4)
  }, j2 = () => (e30) => (crypto.getRandomValues(e30), 0), De2 = (e30) => (De2 = j2())(e30), Oe2 = {
    resolve: (...e30) => {
      for (var t4 = "", n3 = false, r3 = e30.length - 1; r3 >= -1 && !n3; r3--) {
        var i2 = r3 >= 0 ? e30[r3] : L.cwd();
        if (typeof i2 != "string") throw TypeError("Arguments to path.resolve must be strings");
        if (!i2) return "";
        t4 = i2 + "/" + t4, n3 = A2.isAbs(i2);
      }
      return t4 = A2.normalizeArray(t4.split("/").filter((e31) => !!e31), !n3).join("/"), (n3 ? "/" : "") + t4 || ".";
    },
    relative: (e30, t4) => {
      e30 = Oe2.resolve(e30).slice(1), t4 = Oe2.resolve(t4).slice(1);
      function n3(e31) {
        for (var t5 = 0; t5 < e31.length && e31[t5] === ""; t5++) ;
        for (var n4 = e31.length - 1; n4 >= 0 && e31[n4] === ""; n4--) ;
        return t5 > n4 ? [] : e31.slice(t5, n4 - t5 + 1);
      }
      for (var r3 = n3(e30.split("/")), i2 = n3(t4.split("/")), a2 = Math.min(r3.length, i2.length), o2 = a2, s2 = 0; s2 < a2; s2++) if (r3[s2] !== i2[s2]) {
        o2 = s2;
        break;
      }
      for (var c2 = [], s2 = o2; s2 < r3.length; s2++) c2.push("..");
      return c2 = c2.concat(i2.slice(o2)), c2.join("/");
    }
  }, ke2 = globalThis.TextDecoder && new TextDecoder(), Ae2 = (e30, t4, n3, r3) => {
    var i2 = t4 + n3;
    if (r3) return i2;
    for (; e30[t4] && !(t4 >= i2); ) ++t4;
    return t4;
  }, M2 = (e30, t4 = 0, n3, r3) => {
    var i2 = Ae2(e30, t4, n3, r3);
    if (i2 - t4 > 16 && e30.buffer && ke2) return ke2.decode(e30.subarray(t4, i2));
    for (var a2 = ""; t4 < i2; ) {
      var o2 = e30[t4++];
      if (!(o2 & 128)) {
        a2 += String.fromCharCode(o2);
        continue;
      }
      var s2 = e30[t4++] & 63;
      if ((o2 & 224) == 192) {
        a2 += String.fromCharCode((o2 & 31) << 6 | s2);
        continue;
      }
      var c2 = e30[t4++] & 63;
      if (o2 = (o2 & 240) == 224 ? (o2 & 15) << 12 | s2 << 6 | c2 : (o2 & 7) << 18 | s2 << 12 | c2 << 6 | e30[t4++] & 63, o2 < 65536) a2 += String.fromCharCode(o2);
      else {
        var l2 = o2 - 65536;
        a2 += String.fromCharCode(55296 | l2 >> 10, 56320 | l2 & 1023);
      }
    }
    return a2;
  }, je2 = [], Me2 = (e30) => {
    for (var t4 = 0, n3 = 0; n3 < e30.length; ++n3) {
      var r3 = e30.charCodeAt(n3);
      r3 <= 127 ? t4++ : r3 <= 2047 ? t4 += 2 : r3 >= 55296 && r3 <= 57343 ? (t4 += 4, ++n3) : t4 += 3;
    }
    return t4;
  }, Ne2 = (e30, t4, n3, r3) => {
    if (!(r3 > 0)) return 0;
    for (var i2 = n3, a2 = n3 + r3 - 1, o2 = 0; o2 < e30.length; ++o2) {
      var s2 = e30.codePointAt(o2);
      if (s2 <= 127) {
        if (n3 >= a2) break;
        t4[n3++] = s2;
      } else if (s2 <= 2047) {
        if (n3 + 1 >= a2) break;
        t4[n3++] = 192 | s2 >> 6, t4[n3++] = 128 | s2 & 63;
      } else if (s2 <= 65535) {
        if (n3 + 2 >= a2) break;
        t4[n3++] = 224 | s2 >> 12, t4[n3++] = 128 | s2 >> 6 & 63, t4[n3++] = 128 | s2 & 63;
      } else {
        if (n3 + 3 >= a2) break;
        t4[n3++] = 240 | s2 >> 18, t4[n3++] = 128 | s2 >> 12 & 63, t4[n3++] = 128 | s2 >> 6 & 63, t4[n3++] = 128 | s2 & 63, o2++;
      }
    }
    return t4[n3] = 0, n3 - i2;
  }, Pe2 = (e30, t4, n3) => {
    var r3 = n3 > 0 ? n3 : Me2(e30) + 1, i2 = Array(r3), a2 = Ne2(e30, i2, 0, i2.length);
    return t4 && (i2.length = a2), i2;
  }, Fe2 = () => {
    if (!je2.length) {
      var e30 = null;
      if (globalThis.window?.prompt && (e30 = window.prompt("Input: "), e30 !== null && (e30 += "\n")), !e30) return null;
      je2 = Pe2(e30, true);
    }
    return je2.shift();
  }, N2 = {
    ttys: [],
    init() {
    },
    shutdown() {
    },
    register(e30, t4) {
      N2.ttys[e30] = {
        input: [],
        output: [],
        ops: t4
      }, L.registerDevice(e30, N2.stream_ops);
    },
    stream_ops: {
      open(e30) {
        var t4 = N2.ttys[e30.node.rdev];
        if (!t4) throw new L.ErrnoError(43);
        e30.tty = t4, e30.seekable = false;
      },
      close(e30) {
        e30.tty.ops.fsync(e30.tty);
      },
      fsync(e30) {
        e30.tty.ops.fsync(e30.tty);
      },
      read(e30, t4, n3, r3, i2) {
        if (!e30.tty || !e30.tty.ops.get_char) throw new L.ErrnoError(60);
        for (var a2 = 0, o2 = 0; o2 < r3; o2++) {
          var s2;
          try {
            s2 = e30.tty.ops.get_char(e30.tty);
          } catch {
            throw new L.ErrnoError(29);
          }
          if (s2 === void 0 && !a2) throw new L.ErrnoError(6);
          if (s2 == null) break;
          a2++, t4[n3 + o2] = s2;
        }
        return a2 && (e30.node.atime = Date.now()), a2;
      },
      write(e30, t4, n3, r3, i2) {
        if (!e30.tty || !e30.tty.ops.put_char) throw new L.ErrnoError(60);
        try {
          for (var a2 = 0; a2 < r3; a2++) e30.tty.ops.put_char(e30.tty, t4[n3 + a2]);
        } catch {
          throw new L.ErrnoError(29);
        }
        return r3 && (e30.node.mtime = e30.node.ctime = Date.now()), a2;
      }
    },
    default_tty_ops: {
      get_char(e30) {
        return Fe2();
      },
      put_char(e30, t4) {
        t4 === null || t4 === 10 ? (d(M2(e30.output)), e30.output = []) : t4 != 0 && e30.output.push(t4);
      },
      fsync(e30) {
        e30.output?.length > 0 && (d(M2(e30.output)), e30.output = []);
      },
      ioctl_tcgets(e30) {
        return {
          c_iflag: 25856,
          c_oflag: 5,
          c_cflag: 191,
          c_lflag: 35387,
          c_cc: [
            3,
            28,
            127,
            21,
            4,
            0,
            1,
            0,
            17,
            19,
            26,
            0,
            18,
            15,
            23,
            22,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
          ]
        };
      },
      ioctl_tcsets(e30, t4, n3) {
        return 0;
      },
      ioctl_tiocgwinsz(e30) {
        return [24, 80];
      }
    },
    default_tty1_ops: {
      put_char(e30, t4) {
        t4 === null || t4 === 10 ? (f(M2(e30.output)), e30.output = []) : t4 != 0 && e30.output.push(t4);
      },
      fsync(e30) {
        e30.output?.length > 0 && (f(M2(e30.output)), e30.output = []);
      }
    }
  }, P2, Ie2 = (e30, t4) => P2.fill(0, e30, e30 + t4), Le2 = (e30, t4) => Math.ceil(e30 / t4) * t4, Re2 = (e30) => {
    e30 = Le2(e30, 65536);
    var t4 = xi(65536, e30);
    return t4 && Ie2(t4, e30), t4;
  }, F2 = {
    ops_table: null,
    mount(e30) {
      return F2.createNode(null, "/", 16895, 0);
    },
    createNode(e30, t4, n3, r3) {
      if (L.isBlkdev(n3) || L.isFIFO(n3)) throw new L.ErrnoError(63);
      F2.ops_table ||= {
        dir: {
          node: {
            getattr: F2.node_ops.getattr,
            setattr: F2.node_ops.setattr,
            lookup: F2.node_ops.lookup,
            mknod: F2.node_ops.mknod,
            rename: F2.node_ops.rename,
            unlink: F2.node_ops.unlink,
            rmdir: F2.node_ops.rmdir,
            readdir: F2.node_ops.readdir,
            symlink: F2.node_ops.symlink
          },
          stream: { llseek: F2.stream_ops.llseek }
        },
        file: {
          node: {
            getattr: F2.node_ops.getattr,
            setattr: F2.node_ops.setattr
          },
          stream: {
            llseek: F2.stream_ops.llseek,
            read: F2.stream_ops.read,
            write: F2.stream_ops.write,
            mmap: F2.stream_ops.mmap,
            msync: F2.stream_ops.msync
          }
        },
        link: {
          node: {
            getattr: F2.node_ops.getattr,
            setattr: F2.node_ops.setattr,
            readlink: F2.node_ops.readlink
          },
          stream: {}
        },
        chrdev: {
          node: {
            getattr: F2.node_ops.getattr,
            setattr: F2.node_ops.setattr
          },
          stream: L.chrdev_stream_ops
        }
      };
      var i2 = L.createNode(e30, t4, n3, r3);
      return L.isDir(i2.mode) ? (i2.node_ops = F2.ops_table.dir.node, i2.stream_ops = F2.ops_table.dir.stream, i2.contents = {}) : L.isFile(i2.mode) ? (i2.node_ops = F2.ops_table.file.node, i2.stream_ops = F2.ops_table.file.stream, i2.usedBytes = 0, i2.contents = F2.emptyFileContents ??= /* @__PURE__ */ new Uint8Array()) : L.isLink(i2.mode) ? (i2.node_ops = F2.ops_table.link.node, i2.stream_ops = F2.ops_table.link.stream) : L.isChrdev(i2.mode) && (i2.node_ops = F2.ops_table.chrdev.node, i2.stream_ops = F2.ops_table.chrdev.stream), i2.atime = i2.mtime = i2.ctime = Date.now(), e30 && (e30.contents[t4] = i2, e30.atime = e30.mtime = e30.ctime = i2.atime), i2;
    },
    getFileDataAsTypedArray(e30) {
      return e30.contents.subarray(0, e30.usedBytes);
    },
    expandFileStorage(e30, t4) {
      var n3 = e30.contents.length;
      if (!(n3 >= t4)) {
        t4 = Math.max(t4, n3 * (n3 < 1048576 ? 2 : 1.125) >>> 0), n3 && (t4 = Math.max(t4, 256));
        var r3 = F2.getFileDataAsTypedArray(e30);
        e30.contents = new Uint8Array(t4), e30.contents.set(r3);
      }
    },
    resizeFileStorage(e30, t4) {
      if (e30.usedBytes != t4) {
        var n3 = e30.contents;
        e30.contents = new Uint8Array(t4), e30.contents.set(n3.subarray(0, Math.min(t4, e30.usedBytes))), e30.usedBytes = t4;
      }
    },
    node_ops: {
      getattr(e30) {
        var t4 = {};
        return t4.dev = L.isChrdev(e30.mode) ? e30.id : 1, t4.ino = e30.id, t4.mode = e30.mode, t4.nlink = 1, t4.uid = 0, t4.gid = 0, t4.rdev = e30.rdev, t4.size = L.isDir(e30.mode) ? 4096 : L.isFile(e30.mode) ? e30.usedBytes : L.isLink(e30.mode) ? e30.link.length : 0, t4.atime = new Date(e30.atime), t4.mtime = new Date(e30.mtime), t4.ctime = new Date(e30.ctime), t4.blksize = 4096, t4.blocks = Math.ceil(t4.size / t4.blksize), t4;
      },
      setattr(e30, t4) {
        for (let n3 of [
          "mode",
          "atime",
          "mtime",
          "ctime"
        ]) t4[n3] != null && (e30[n3] = t4[n3]);
        t4.size !== void 0 && F2.resizeFileStorage(e30, t4.size);
      },
      lookup(e30, t4) {
        throw F2.doesNotExistError || (F2.doesNotExistError = new L.ErrnoError(44), F2.doesNotExistError.stack = "<generic error, no stack>"), F2.doesNotExistError;
      },
      mknod(e30, t4, n3, r3) {
        return F2.createNode(e30, t4, n3, r3);
      },
      rename(e30, t4, n3) {
        var r3;
        try {
          r3 = L.lookupNode(t4, n3);
        } catch {
        }
        if (r3) {
          if (L.isDir(e30.mode)) for (var i2 in r3.contents) throw new L.ErrnoError(55);
          L.hashRemoveNode(r3);
        }
        delete e30.parent.contents[e30.name], t4.contents[n3] = e30, e30.name = n3, t4.ctime = t4.mtime = e30.parent.ctime = e30.parent.mtime = Date.now();
      },
      unlink(e30, t4) {
        delete e30.contents[t4], e30.ctime = e30.mtime = Date.now();
      },
      rmdir(e30, t4) {
        for (var n3 in L.lookupNode(e30, t4).contents) throw new L.ErrnoError(55);
        delete e30.contents[t4], e30.ctime = e30.mtime = Date.now();
      },
      readdir(e30) {
        return [
          ".",
          "..",
          ...Object.keys(e30.contents)
        ];
      },
      symlink(e30, t4, n3) {
        var r3 = F2.createNode(e30, t4, 41471, 0);
        return r3.link = n3, r3;
      },
      readlink(e30) {
        if (!L.isLink(e30.mode)) throw new L.ErrnoError(28);
        return e30.link;
      }
    },
    stream_ops: {
      read(e30, t4, n3, r3, i2) {
        var a2 = e30.node.contents;
        if (i2 >= e30.node.usedBytes) return 0;
        var o2 = Math.min(e30.node.usedBytes - i2, r3);
        return t4.set(a2.subarray(i2, i2 + o2), n3), o2;
      },
      write(e30, t4, n3, r3, i2, a2) {
        if (t4.buffer === b2.buffer && (a2 = false), !r3) return 0;
        var o2 = e30.node;
        return o2.mtime = o2.ctime = Date.now(), a2 ? (o2.contents = t4.subarray(n3, n3 + r3), o2.usedBytes = r3) : !o2.usedBytes && !i2 ? (o2.contents = t4.slice(n3, n3 + r3), o2.usedBytes = r3) : (F2.expandFileStorage(o2, i2 + r3), o2.contents.set(t4.subarray(n3, n3 + r3), i2), o2.usedBytes = Math.max(o2.usedBytes, i2 + r3)), r3;
      },
      llseek(e30, t4, n3) {
        var r3 = t4;
        if (n3 === 1 ? r3 += e30.position : n3 === 2 && L.isFile(e30.node.mode) && (r3 += e30.node.usedBytes), r3 < 0) throw new L.ErrnoError(28);
        return r3;
      },
      mmap(e30, t4, n3, r3, i2) {
        if (!L.isFile(e30.node.mode)) throw new L.ErrnoError(43);
        var a2, o2, s2 = e30.node.contents;
        if (!(i2 & 2) && s2.buffer === b2.buffer) o2 = false, a2 = s2.byteOffset;
        else {
          if (o2 = true, a2 = Re2(t4), !a2) throw new L.ErrnoError(48);
          s2 && ((n3 > 0 || n3 + t4 < s2.length) && (s2 = s2.subarray ? s2.subarray(n3, n3 + t4) : Array.prototype.slice.call(s2, n3, n3 + t4)), b2.set(s2, a2));
        }
        return {
          ptr: a2,
          allocated: o2
        };
      },
      msync(e30, t4, n3, r3, i2) {
        return F2.stream_ops.write(e30, t4, 0, r3, n3, false), 0;
      }
    }
  }, I2 = (e30) => {
    if (typeof e30 != "string") return e30;
    var t4 = {
      r: 0,
      "r+": 2,
      w: 577,
      "w+": 578,
      a: 1089,
      "a+": 1090
    }[e30];
    if (t4 === void 0) throw Error(`Unknown file open mode: ${e30}`);
    return t4;
  }, ze2 = (e30) => (typeof e30 == "string" && (e30 = Pe2(e30, true)), e30.subarray || (e30 = new Uint8Array(e30)), e30), Be2 = (e30, t4) => {
    var n3 = 0;
    return e30 && (n3 |= 365), t4 && (n3 |= 146), n3;
  }, Ve2 = async (e30) => {
    var t4 = await l(e30);
    return new Uint8Array(t4);
  }, He2 = (...e30) => L.createDataFile(...e30), Ue2 = (e30) => e30, We2 = null, Ge2 = async () => We2, Ke2 = 0, qe2 = null, Je2 = (e30) => {
    Ke2--, Ke2 || qe2();
  }, Ye2 = (e30) => {
    Ke2 || (We2 = new Promise((e31) => qe2 = e31)), Ke2++;
  }, Xe2 = [], Ze2 = async (e30, t4) => {
    typeof Browser < "u" && Browser.init();
    for (var n3 of Xe2) if (n3.canHandle(t4)) return n3.handle(e30, t4);
    return e30;
  }, Qe2 = async (e30, t4, n3, r3, i2, a2, o2, s2) => {
    var c2 = t4 ? Oe2.resolve(A2.join2(e30, t4)) : e30, l2 = Ue2(`cp ${c2}`);
    Ye2(l2);
    try {
      var u2 = n3;
      typeof n3 == "string" && (u2 = await Ve2(n3)), u2 = await Ze2(u2, c2), s2?.(), a2 || He2(e30, t4, u2, r3, i2, o2);
    } finally {
      Je2(l2);
    }
  }, $e2 = (e30, t4, n3, r3, i2, a2, o2, s2, c2, l2) => {
    Qe2(e30, t4, n3, r3, i2, s2, c2, l2).then(a2).catch(o2);
  }, L = {
    root: null,
    mounts: [],
    devices: {},
    streams: [],
    nextInode: 1,
    nameTable: null,
    currentPath: "/",
    initialized: false,
    ignorePermissions: true,
    filesystems: null,
    syncFSRequests: 0,
    ErrnoError: class {
      name = "ErrnoError";
      constructor(e30) {
        this.errno = e30;
      }
    },
    FSStream: class {
      shared = {};
      get object() {
        return this.node;
      }
      set object(e30) {
        this.node = e30;
      }
      get isRead() {
        return (this.flags & 2097155) != 1;
      }
      get isWrite() {
        return !!(this.flags & 2097155);
      }
      get isAppend() {
        return this.flags & 1024;
      }
      get flags() {
        return this.shared.flags;
      }
      set flags(e30) {
        this.shared.flags = e30;
      }
      get position() {
        return this.shared.position;
      }
      set position(e30) {
        this.shared.position = e30;
      }
    },
    FSNode: class {
      node_ops = {};
      stream_ops = {};
      readMode = 365;
      writeMode = 146;
      mounted = null;
      constructor(e30, t4, n3, r3) {
        e30 ||= this, this.parent = e30, this.mount = e30.mount, this.id = L.nextInode++, this.name = t4, this.mode = n3, this.rdev = r3, this.atime = this.mtime = this.ctime = Date.now();
      }
      get read() {
        return (this.mode & this.readMode) === this.readMode;
      }
      set read(e30) {
        e30 ? this.mode |= this.readMode : this.mode &= ~this.readMode;
      }
      get write() {
        return (this.mode & this.writeMode) === this.writeMode;
      }
      set write(e30) {
        e30 ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
      }
      get isFolder() {
        return L.isDir(this.mode);
      }
      get isDevice() {
        return L.isChrdev(this.mode);
      }
      addListener(e30, t4 = false) {
        var n3 = {
          cb: e30,
          exclusive: t4
        }, r3 = this.listeners ??= /* @__PURE__ */ new Set();
        return r3.add(n3), {
          listeners: r3,
          entry: n3
        };
      }
      notifyListeners(e30) {
        if (this.listeners) {
          var t4;
          for (var n3 of this.listeners) n3.exclusive ? (t4 ||= []).push(n3) : n3.cb(e30);
          if (t4) {
            var r3 = (this.exclTurn || 0) % t4.length;
            this.exclTurn = r3 + 1, t4[r3].cb(e30);
          }
        }
      }
    },
    lookupPath(e30, t4 = {}) {
      if (!e30) throw new L.ErrnoError(44);
      t4.follow_mount ??= true, A2.isAbs(e30) || (e30 = L.cwd() + "/" + e30);
      linkloop: for (var n3 = 0; n3 < 40; n3++) {
        for (var r3 = e30.split("/").filter((e31) => !!e31), i2 = L.root, a2 = "/", o2 = 0; o2 < r3.length; o2++) {
          var s2 = o2 === r3.length - 1;
          if (s2 && t4.parent) break;
          if (r3[o2] !== ".") {
            if (r3[o2] === "..") {
              if (a2 = A2.dirname(a2), L.isRoot(i2)) {
                e30 = a2 + "/" + r3.slice(o2 + 1).join("/"), n3--;
                continue linkloop;
              }
              i2 = i2.parent;
              continue;
            }
            a2 = A2.join2(a2, r3[o2]);
            try {
              i2 = L.lookupNode(i2, r3[o2]);
            } catch (e31) {
              if (e31?.errno === 44 && s2 && t4.noent_okay) return { path: a2 };
              throw e31;
            }
            if (L.isMountpoint(i2) && (!s2 || t4.follow_mount) && (i2 = i2.mounted.root), L.isLink(i2.mode) && (!s2 || t4.follow)) {
              if (!i2.node_ops.readlink) throw new L.ErrnoError(52);
              var c2 = i2.node_ops.readlink(i2);
              A2.isAbs(c2) || (c2 = A2.dirname(a2) + "/" + c2), e30 = c2 + "/" + r3.slice(o2 + 1).join("/");
              continue linkloop;
            }
          }
        }
        return {
          path: a2,
          node: i2
        };
      }
      throw new L.ErrnoError(32);
    },
    getPath(e30) {
      for (var t4; ; ) {
        if (L.isRoot(e30)) {
          var n3 = e30.mount.mountpoint;
          return t4 ? n3[n3.length - 1] === "/" ? n3 + t4 : `${n3}/${t4}` : n3;
        }
        t4 = t4 ? `${e30.name}/${t4}` : e30.name, e30 = e30.parent;
      }
    },
    hashName(e30, t4) {
      for (var n3 = 0, r3 = 0; r3 < t4.length; r3++) n3 = (n3 << 5) - n3 + t4.charCodeAt(r3) | 0;
      return (e30 + n3 >>> 0) % L.nameTable.length;
    },
    hashAddNode(e30) {
      var t4 = L.hashName(e30.parent.id, e30.name);
      e30.name_next = L.nameTable[t4], L.nameTable[t4] = e30;
    },
    hashRemoveNode(e30) {
      var t4 = L.hashName(e30.parent.id, e30.name);
      if (L.nameTable[t4] === e30) L.nameTable[t4] = e30.name_next;
      else for (var n3 = L.nameTable[t4]; n3; ) {
        if (n3.name_next === e30) {
          n3.name_next = e30.name_next;
          break;
        }
        n3 = n3.name_next;
      }
    },
    lookupNode(e30, t4) {
      var n3 = L.mayLookup(e30);
      if (n3) throw new L.ErrnoError(n3);
      for (var r3 = L.hashName(e30.id, t4), i2 = L.nameTable[r3]; i2; i2 = i2.name_next) {
        var a2 = i2.name;
        if (i2.parent.id === e30.id && a2 === t4) return i2;
      }
      return L.lookup(e30, t4);
    },
    createNode(e30, t4, n3, r3) {
      var i2 = new L.FSNode(e30, t4, n3, r3);
      return L.hashAddNode(i2), i2;
    },
    destroyNode(e30) {
      L.hashRemoveNode(e30);
    },
    isRoot(e30) {
      return e30 === e30.parent;
    },
    isMountpoint(e30) {
      return !!e30.mounted;
    },
    isFile(e30) {
      return (e30 & 61440) == 32768;
    },
    isDir(e30) {
      return (e30 & 61440) == 16384;
    },
    isLink(e30) {
      return (e30 & 61440) == 40960;
    },
    isChrdev(e30) {
      return (e30 & 61440) == 8192;
    },
    isBlkdev(e30) {
      return (e30 & 61440) == 24576;
    },
    isFIFO(e30) {
      return (e30 & 61440) == 4096;
    },
    isSocket(e30) {
      return (e30 & 49152) == 49152;
    },
    flagsToPermissionString(e30) {
      var t4 = [
        "r",
        "w",
        "rw"
      ][e30 & 3];
      return e30 & 512 && (t4 += "w"), t4;
    },
    nodePermissions(e30, t4) {
      return L.ignorePermissions ? 0 : t4.includes("r") && !(e30.mode & 292) || t4.includes("w") && !(e30.mode & 146) || t4.includes("x") && !(e30.mode & 73) ? 2 : 0;
    },
    mayLookup(e30) {
      return L.isDir(e30.mode) ? L.nodePermissions(e30, "x") || (e30.node_ops.lookup ? 0 : 2) : 54;
    },
    mayCreate(e30, t4) {
      if (!L.isDir(e30.mode)) return 54;
      try {
        return L.lookupNode(e30, t4), 20;
      } catch {
      }
      return L.nodePermissions(e30, "wx");
    },
    mayDelete(e30, t4, n3) {
      var r3;
      try {
        r3 = L.lookupNode(e30, t4);
      } catch (e31) {
        return e31.errno;
      }
      var i2 = L.nodePermissions(e30, "wx");
      if (i2) return i2;
      if (n3) {
        if (!L.isDir(r3.mode)) return 54;
        if (L.isRoot(r3) || L.getPath(r3) === L.cwd()) return 10;
      } else if (L.isDir(r3.mode)) return 31;
      return 0;
    },
    mayOpen(e30, t4) {
      if (!e30) return 44;
      if (L.isLink(e30.mode)) return 32;
      var n3 = L.flagsToPermissionString(t4);
      return L.isDir(e30.mode) && (n3 !== "r" || t4 & 576) ? 31 : L.nodePermissions(e30, n3);
    },
    checkOpExists(e30, t4) {
      if (!e30) throw new L.ErrnoError(t4);
      return e30;
    },
    MAX_OPEN_FDS: 4096,
    nextfd() {
      for (var e30 = 0; e30 <= L.MAX_OPEN_FDS; e30++) if (!L.streams[e30]) return e30;
      throw new L.ErrnoError(33);
    },
    getStreamChecked(e30) {
      var t4 = L.getStream(e30);
      if (!t4) throw new L.ErrnoError(8);
      return t4;
    },
    getStream: (e30) => L.streams[e30],
    createStream(e30, t4 = -1) {
      return e30 = Object.assign(new L.FSStream(), e30), t4 == -1 && (t4 = L.nextfd()), e30.fd = t4, L.streams[t4] = e30, e30;
    },
    closeStream(e30) {
      L.streams[e30] = null;
    },
    dupStream(e30, t4 = -1) {
      var n3 = L.createStream(e30, t4);
      return n3.stream_ops?.dup?.(n3), n3;
    },
    doSetAttr(e30, t4, n3) {
      var r3 = e30?.stream_ops.setattr, i2 = r3 ? e30 : t4;
      r3 ??= t4.node_ops.setattr, L.checkOpExists(r3, 63);
      try {
        r3(i2, n3);
      } catch (e31) {
        throw e31 instanceof RangeError ? new L.ErrnoError(22) : e31;
      }
    },
    chrdev_stream_ops: {
      open(e30) {
        e30.stream_ops = L.getDevice(e30.node.rdev).stream_ops, e30.stream_ops.open?.(e30);
      },
      llseek() {
        throw new L.ErrnoError(70);
      }
    },
    major: (e30) => e30 >> 8,
    minor: (e30) => e30 & 255,
    makedev: (e30, t4) => e30 << 8 | t4,
    registerDevice(e30, t4) {
      L.devices[e30] = { stream_ops: t4 };
    },
    getDevice: (e30) => L.devices[e30],
    getMounts(e30) {
      for (var t4 = [], n3 = [e30]; n3.length; ) {
        var r3 = n3.pop();
        t4.push(r3), n3.push(...r3.mounts);
      }
      return t4;
    },
    syncfs(e30, t4) {
      typeof e30 == "function" && (t4 = e30, e30 = false), L.syncFSRequests++, L.syncFSRequests > 1 && f(`warning: ${L.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
      var n3 = L.getMounts(L.root.mount), r3 = 0;
      function i2(e31) {
        return L.syncFSRequests--, t4(e31);
      }
      function a2(e31) {
        if (e31) return a2.errored ? void 0 : (a2.errored = true, i2(e31));
        ++r3 >= n3.length && i2(null);
      }
      for (var o2 of n3) o2.type.syncfs ? o2.type.syncfs(o2, e30, a2) : a2(null);
    },
    mount(e30, t4, n3) {
      var r3 = n3 === "/", i2 = !n3, a2;
      if (r3 && L.root) throw new L.ErrnoError(10);
      if (!r3 && !i2) {
        var o2 = L.lookupPath(n3, { follow_mount: false });
        if (n3 = o2.path, a2 = o2.node, L.isMountpoint(a2)) throw new L.ErrnoError(10);
        if (!L.isDir(a2.mode)) throw new L.ErrnoError(54);
      }
      var s2 = {
        type: e30,
        opts: t4,
        mountpoint: n3,
        mounts: []
      }, c2 = e30.mount(s2);
      return c2.mount = s2, s2.root = c2, r3 ? L.root = c2 : a2 && (a2.mounted = s2, a2.mount && a2.mount.mounts.push(s2)), c2;
    },
    unmount(e30) {
      var t4 = L.lookupPath(e30, { follow_mount: false });
      if (!L.isMountpoint(t4.node)) throw new L.ErrnoError(28);
      var n3 = t4.node, r3 = n3.mounted, i2 = L.getMounts(r3);
      for (var [a2, o2] of Object.entries(L.nameTable)) for (; o2; ) {
        var s2 = o2.name_next;
        i2.includes(o2.mount) && L.destroyNode(o2), o2 = s2;
      }
      n3.mounted = null;
      var c2 = n3.mount.mounts.indexOf(r3);
      n3.mount.mounts.splice(c2, 1);
    },
    lookup(e30, t4) {
      return e30.node_ops.lookup(e30, t4);
    },
    mknod(e30, t4, n3) {
      var r3 = L.lookupPath(e30, { parent: true }).node, i2 = A2.basename(e30);
      if (!i2) throw new L.ErrnoError(28);
      if (i2 === "." || i2 === "..") throw new L.ErrnoError(20);
      var a2 = L.mayCreate(r3, i2);
      if (a2) throw new L.ErrnoError(a2);
      if (!r3.node_ops.mknod) throw new L.ErrnoError(63);
      return r3.node_ops.mknod(r3, i2, t4, n3);
    },
    statfs(e30) {
      return L.statfsNode(L.lookupPath(e30, { follow: true }).node);
    },
    statfsStream(e30) {
      return L.statfsNode(e30.node);
    },
    statfsNode(e30) {
      var t4 = {
        bsize: 4096,
        frsize: 4096,
        blocks: 1e6,
        bfree: 5e5,
        bavail: 5e5,
        files: L.nextInode,
        ffree: L.nextInode - 1,
        fsid: 42,
        flags: 2,
        namelen: 255
      };
      return e30.node_ops.statfs && Object.assign(t4, e30.node_ops.statfs(e30.mount.opts.root)), t4;
    },
    create(e30, t4 = 438) {
      return t4 &= 4095, t4 |= 32768, L.mknod(e30, t4, 0);
    },
    mkdir(e30, t4 = 511) {
      return t4 &= 1023, t4 |= 16384, L.mknod(e30, t4, 0);
    },
    mkdirTree(e30, t4) {
      var n3 = e30.split("/"), r3 = "";
      for (var i2 of n3) if (i2) {
        (r3 || A2.isAbs(e30)) && (r3 += "/"), r3 += i2;
        try {
          L.mkdir(r3, t4);
        } catch (e31) {
          if (e31.errno != 20) throw e31;
        }
      }
    },
    mkdev(e30, t4, n3) {
      return n3 === void 0 && (n3 = t4, t4 = 438), t4 |= 8192, L.mknod(e30, t4, n3);
    },
    symlink(e30, t4) {
      if (!Oe2.resolve(e30)) throw new L.ErrnoError(44);
      var n3 = L.lookupPath(t4, { parent: true }).node;
      if (!n3) throw new L.ErrnoError(44);
      var r3 = A2.basename(t4), i2 = L.mayCreate(n3, r3);
      if (i2) throw new L.ErrnoError(i2);
      if (!n3.node_ops.symlink) throw new L.ErrnoError(63);
      return n3.node_ops.symlink(n3, r3, e30);
    },
    link(e30, t4, n3) {
      var r3 = L.lookupPath(t4, { parent: true }).node;
      if (!r3) throw new L.ErrnoError(44);
      var i2 = A2.basename(t4), a2 = L.mayCreate(r3, i2);
      if (a2) throw new L.ErrnoError(a2);
      if (!r3.node_ops.link) throw new L.ErrnoError(34);
      return r3.node_ops.link(r3, i2, e30, n3);
    },
    rename(e30, t4) {
      var n3 = A2.dirname(e30), r3 = A2.dirname(t4), i2 = A2.basename(e30), a2 = A2.basename(t4), o2 = L.lookupPath(e30, { parent: true }), s2 = o2.node, c2;
      if (o2 = L.lookupPath(t4, { parent: true }), c2 = o2.node, !s2 || !c2) throw new L.ErrnoError(44);
      if (s2.mount !== c2.mount) throw new L.ErrnoError(75);
      var l2 = L.lookupNode(s2, i2), u2 = Oe2.relative(e30, r3);
      if (u2.charAt(0) !== ".") throw new L.ErrnoError(28);
      if (u2 = Oe2.relative(t4, n3), u2.charAt(0) !== ".") throw new L.ErrnoError(55);
      var d2;
      try {
        d2 = L.lookupNode(c2, a2);
      } catch {
      }
      if (l2 !== d2) {
        var f2 = L.isDir(l2.mode), p3 = L.mayDelete(s2, i2, f2);
        if (p3 || (p3 = d2 ? L.mayDelete(c2, a2, f2) : L.mayCreate(c2, a2), p3)) throw new L.ErrnoError(p3);
        if (!s2.node_ops.rename) throw new L.ErrnoError(63);
        if (L.isMountpoint(l2) || d2 && L.isMountpoint(d2)) throw new L.ErrnoError(10);
        if (c2 !== s2 && (p3 = L.nodePermissions(s2, "w"), p3)) throw new L.ErrnoError(p3);
        L.hashRemoveNode(l2);
        try {
          s2.node_ops.rename(l2, c2, a2), l2.parent = c2;
        } catch (e31) {
          throw e31;
        } finally {
          L.hashAddNode(l2);
        }
      }
    },
    rmdir(e30) {
      var t4 = L.lookupPath(e30, { parent: true }).node, n3 = A2.basename(e30), r3 = L.lookupNode(t4, n3), i2 = L.mayDelete(t4, n3, true);
      if (i2) throw new L.ErrnoError(i2);
      if (!t4.node_ops.rmdir) throw new L.ErrnoError(63);
      if (L.isMountpoint(r3)) throw new L.ErrnoError(10);
      t4.node_ops.rmdir(t4, n3), L.destroyNode(r3);
    },
    readdir(e30) {
      var t4 = L.lookupPath(e30, { follow: true }).node;
      return L.checkOpExists(t4.node_ops.readdir, 54)(t4);
    },
    unlink(e30) {
      var t4 = L.lookupPath(e30, { parent: true }).node;
      if (!t4) throw new L.ErrnoError(44);
      var n3 = A2.basename(e30), r3 = L.lookupNode(t4, n3), i2 = L.mayDelete(t4, n3, false);
      if (i2) throw new L.ErrnoError(i2);
      if (!t4.node_ops.unlink) throw new L.ErrnoError(63);
      if (L.isMountpoint(r3)) throw new L.ErrnoError(10);
      t4.node_ops.unlink(t4, n3), L.destroyNode(r3);
    },
    readlink(e30) {
      var t4 = L.lookupPath(e30).node;
      if (!t4) throw new L.ErrnoError(44);
      if (!t4.node_ops.readlink) throw new L.ErrnoError(28);
      return t4.node_ops.readlink(t4);
    },
    stat(e30, t4) {
      var n3 = L.lookupPath(e30, { follow: !t4 }).node;
      return L.checkOpExists(n3.node_ops.getattr, 63)(n3);
    },
    fstat(e30) {
      var t4 = L.getStreamChecked(e30), n3 = t4.node, r3 = t4.stream_ops.getattr, i2 = r3 ? t4 : n3;
      return r3 ??= n3.node_ops.getattr, L.checkOpExists(r3, 63), r3(i2);
    },
    lstat(e30) {
      return L.stat(e30, true);
    },
    doChmod(e30, t4, n3, r3) {
      L.doSetAttr(e30, t4, {
        mode: n3 & 4095 | t4.mode & -4096,
        ctime: Date.now(),
        dontFollow: r3
      });
    },
    chmod(e30, t4, n3) {
      var r3 = typeof e30 == "string" ? L.lookupPath(e30, { follow: !n3 }).node : e30;
      L.doChmod(null, r3, t4, n3);
    },
    lchmod(e30, t4) {
      L.chmod(e30, t4, true);
    },
    fchmod(e30, t4) {
      var n3 = L.getStreamChecked(e30);
      L.doChmod(n3, n3.node, t4, false);
    },
    doChown(e30, t4, n3) {
      L.doSetAttr(e30, t4, {
        timestamp: Date.now(),
        dontFollow: n3
      });
    },
    chown(e30, t4, n3, r3) {
      var i2 = typeof e30 == "string" ? L.lookupPath(e30, { follow: !r3 }).node : e30;
      L.doChown(null, i2, r3);
    },
    lchown(e30, t4, n3) {
      L.chown(e30, t4, n3, true);
    },
    fchown(e30, t4, n3) {
      var r3 = L.getStreamChecked(e30);
      L.doChown(r3, r3.node, false);
    },
    doTruncate(e30, t4, n3) {
      if (L.isDir(t4.mode)) throw new L.ErrnoError(31);
      if (!L.isFile(t4.mode)) throw new L.ErrnoError(28);
      var r3 = L.nodePermissions(t4, "w");
      if (r3) throw new L.ErrnoError(r3);
      L.doSetAttr(e30, t4, {
        size: n3,
        timestamp: Date.now()
      });
    },
    truncate(e30, t4) {
      if (t4 < 0) throw new L.ErrnoError(28);
      var n3 = typeof e30 == "string" ? L.lookupPath(e30, { follow: true }).node : e30;
      L.doTruncate(null, n3, t4);
    },
    ftruncate(e30, t4) {
      var n3 = L.getStreamChecked(e30);
      if (t4 < 0 || !(n3.flags & 2097155)) throw new L.ErrnoError(28);
      L.doTruncate(n3, n3.node, t4);
    },
    utime(e30, t4, n3, r3) {
      var i2 = L.lookupPath(e30, { follow: !r3 });
      L.doSetAttr(null, i2.node, {
        atime: t4,
        mtime: n3,
        dontFollow: r3
      });
    },
    open(e30, t4, n3 = 438) {
      if (e30 === "") throw new L.ErrnoError(44);
      t4 = I2(t4), n3 = t4 & 64 ? n3 & 4095 | 32768 : 0;
      var r3, i2;
      if (typeof e30 == "object") r3 = e30;
      else {
        i2 = e30.endsWith("/");
        var a2 = L.lookupPath(e30, {
          follow: !(t4 & 131072),
          noent_okay: true
        });
        r3 = a2.node, e30 = a2.path;
      }
      var o2 = false;
      if (t4 & 64) {
        if (r3) {
          if (t4 & 128) throw new L.ErrnoError(20);
        } else if (i2) throw new L.ErrnoError(31);
        else r3 = L.mknod(e30, n3 | 511, 0), o2 = true;
      }
      if (!r3) throw new L.ErrnoError(44);
      if (L.isChrdev(r3.mode) && (t4 &= -513), t4 & 65536 && !L.isDir(r3.mode)) throw new L.ErrnoError(54);
      if (!o2) {
        var s2 = L.mayOpen(r3, t4);
        if (s2) throw new L.ErrnoError(s2);
      }
      t4 & 512 && !o2 && L.truncate(r3, 0), t4 &= -131713;
      var c2 = L.createStream({
        node: r3,
        path: L.getPath(r3),
        flags: t4,
        seekable: true,
        position: 0,
        stream_ops: r3.stream_ops,
        ungotten: [],
        error: false
      });
      return c2.stream_ops.open && c2.stream_ops.open(c2), o2 && L.chmod(r3, n3 & 511), c2;
    },
    close(e30) {
      if (L.isClosed(e30)) throw new L.ErrnoError(8);
      e30.getdents &&= null, e30.node?.notifyListeners(32);
      try {
        e30.stream_ops.close && e30.stream_ops.close(e30);
      } catch (e31) {
        throw e31;
      } finally {
        L.closeStream(e30.fd);
      }
      e30.fd = null;
    },
    isClosed(e30) {
      return e30.fd === null;
    },
    llseek(e30, t4, n3) {
      if (L.isClosed(e30)) throw new L.ErrnoError(8);
      if (!e30.seekable || !e30.stream_ops.llseek) throw new L.ErrnoError(70);
      if (n3 != 0 && n3 != 1 && n3 != 2) throw new L.ErrnoError(28);
      return e30.position = e30.stream_ops.llseek(e30, t4, n3), e30.ungotten = [], e30.position;
    },
    read(e30, t4, n3, r3, i2) {
      if (r3 < 0 || i2 < 0) throw new L.ErrnoError(28);
      if (L.isClosed(e30) || (e30.flags & 2097155) == 1) throw new L.ErrnoError(8);
      if (L.isDir(e30.node.mode)) throw new L.ErrnoError(31);
      if (!e30.stream_ops.read) throw new L.ErrnoError(28);
      var a2 = i2 !== void 0;
      if (!a2) i2 = e30.position;
      else if (!e30.seekable) throw new L.ErrnoError(70);
      var o2 = e30.stream_ops.read(e30, t4, n3, r3, i2);
      return a2 || (e30.position += o2), o2;
    },
    write(e30, t4, n3, r3, i2, a2) {
      if (r3 < 0 || i2 < 0) throw new L.ErrnoError(28);
      if (L.isClosed(e30) || !(e30.flags & 2097155)) throw new L.ErrnoError(8);
      if (L.isDir(e30.node.mode)) throw new L.ErrnoError(31);
      if (!e30.stream_ops.write) throw new L.ErrnoError(28);
      e30.seekable && e30.flags & 1024 && L.llseek(e30, 0, 2);
      var o2 = i2 !== void 0;
      if (!o2) i2 = e30.position;
      else if (!e30.seekable) throw new L.ErrnoError(70);
      var s2 = e30.stream_ops.write(e30, t4, n3, r3, i2, a2);
      return o2 || (e30.position += s2), s2;
    },
    mmap(e30, t4, n3, r3, i2) {
      if (r3 & 2 && !(i2 & 2) && (e30.flags & 2097155) != 2 || (e30.flags & 2097155) == 1) throw new L.ErrnoError(2);
      if (!e30.stream_ops.mmap) throw new L.ErrnoError(43);
      if (!t4) throw new L.ErrnoError(28);
      return e30.stream_ops.mmap(e30, t4, n3, r3, i2);
    },
    msync(e30, t4, n3, r3, i2) {
      return e30.stream_ops.msync ? e30.stream_ops.msync(e30, t4, n3, r3, i2) : 0;
    },
    ioctl(e30, t4, n3) {
      if (!e30.stream_ops.ioctl) throw new L.ErrnoError(59);
      return e30.stream_ops.ioctl(e30, t4, n3);
    },
    readFile(e30, t4 = {}) {
      t4.flags = t4.flags ?? 0, t4.encoding = t4.encoding ?? "binary", t4.encoding !== "utf8" && t4.encoding !== "binary" && v2(`Invalid encoding type "${t4.encoding}"`);
      var n3 = L.open(e30, t4.flags), r3 = L.stat(e30).size, i2 = new Uint8Array(r3);
      return L.read(n3, i2, 0, r3, 0), t4.encoding === "utf8" && (i2 = M2(i2)), L.close(n3), i2;
    },
    writeFile(e30, t4, n3 = {}) {
      n3.flags = n3.flags ?? 577;
      var r3 = L.open(e30, n3.flags, n3.mode);
      t4 = ze2(t4), L.write(r3, t4, 0, t4.byteLength, void 0, n3.canOwn), L.close(r3);
    },
    cwd: () => L.currentPath,
    chdir(e30) {
      var t4 = L.lookupPath(e30, { follow: true });
      if (t4.node === null) throw new L.ErrnoError(44);
      if (!L.isDir(t4.node.mode)) throw new L.ErrnoError(54);
      var n3 = L.nodePermissions(t4.node, "x");
      if (n3) throw new L.ErrnoError(n3);
      L.currentPath = t4.path;
    },
    createDefaultDirectories() {
      L.mkdir("/tmp"), L.mkdir("/home"), L.mkdir("/home/web_user");
    },
    createDefaultDevices() {
      L.mkdir("/dev"), L.registerDevice(L.makedev(1, 3), {
        read: () => 0,
        write: (e31, t5, n4, r3, i2) => r3,
        llseek: () => 0
      }), L.mkdev("/dev/null", L.makedev(1, 3)), N2.register(L.makedev(5, 0), N2.default_tty_ops), N2.register(L.makedev(6, 0), N2.default_tty1_ops), L.mkdev("/dev/tty", L.makedev(5, 0)), L.mkdev("/dev/tty1", L.makedev(6, 0));
      var e30 = /* @__PURE__ */ new Uint8Array(1024), t4 = 0, n3 = () => (t4 ||= (De2(e30), e30.byteLength), e30[--t4]);
      L.createDevice("/dev", "random", n3), L.createDevice("/dev", "urandom", n3), L.mkdir("/dev/shm"), L.mkdir("/dev/shm/tmp");
    },
    createSpecialDirectories() {
      L.mkdir("/proc");
      var e30 = L.mkdir("/proc/self");
      L.mkdir("/proc/self/fd"), L.mount({ mount() {
        var t4 = L.createNode(e30, "fd", 16895, 73);
        return t4.stream_ops = { llseek: F2.stream_ops.llseek }, t4.node_ops = {
          lookup(e31, t5) {
            var n3 = +t5, r3 = L.getStreamChecked(n3), i2 = {
              parent: null,
              mount: { mountpoint: "fake" },
              node_ops: { readlink: () => r3.path },
              id: n3 + 1
            };
            return i2.parent = i2, i2;
          },
          readdir() {
            return Array.from(L.streams.entries()).filter(([e31, t5]) => t5).map(([e31, t5]) => e31.toString());
          }
        }, t4;
      } }, {}, "/proc/self/fd");
    },
    createStandardStreams(e30, t4, n3) {
      e30 ? L.createDevice("/dev", "stdin", e30) : L.symlink("/dev/tty", "/dev/stdin"), t4 ? L.createDevice("/dev", "stdout", null, t4) : L.symlink("/dev/tty", "/dev/stdout"), n3 ? L.createDevice("/dev", "stderr", null, n3) : L.symlink("/dev/tty1", "/dev/stderr"), L.open("/dev/stdin", 0), L.open("/dev/stdout", 1), L.open("/dev/stderr", 1);
    },
    staticInit() {
      L.nameTable = Array(4096), L.mount(F2, {}, "/"), L.createDefaultDirectories(), L.createDefaultDevices(), L.createSpecialDirectories(), L.filesystems = { MEMFS: F2 };
    },
    init(e30, t4, n3) {
      L.initialized = true, L.createStandardStreams(e30, t4, n3);
    },
    quit() {
      L.initialized = false;
      for (var e30 of L.streams) e30 && L.close(e30);
    },
    findObject(e30, t4) {
      var n3 = L.analyzePath(e30, t4);
      return n3.exists ? n3.object : null;
    },
    analyzePath(e30, t4) {
      try {
        var n3 = L.lookupPath(e30, { follow: !t4 });
        e30 = n3.path;
      } catch {
      }
      var r3 = {
        isRoot: false,
        exists: false,
        error: 0,
        name: null,
        path: null,
        object: null,
        parentExists: false,
        parentPath: null,
        parentObject: null
      };
      try {
        var n3 = L.lookupPath(e30, { parent: true });
        r3.parentExists = true, r3.parentPath = n3.path, r3.parentObject = n3.node, r3.name = A2.basename(e30), n3 = L.lookupPath(e30, { follow: !t4 }), r3.exists = true, r3.path = n3.path, r3.object = n3.node, r3.name = n3.node.name, r3.isRoot = n3.path === "/";
      } catch (e31) {
        r3.error = e31.errno;
      }
      return r3;
    },
    createPath(e30, t4, n3, r3) {
      e30 = typeof e30 == "string" ? e30 : L.getPath(e30);
      for (var i2 = t4.split("/").reverse(); i2.length; ) {
        var a2 = i2.pop();
        if (a2) {
          var o2 = A2.join2(e30, a2);
          try {
            L.mkdir(o2);
          } catch (e31) {
            if (e31.errno != 20) throw e31;
          }
          e30 = o2;
        }
      }
      return o2;
    },
    createFile(e30, t4, n3, r3, i2) {
      var a2 = A2.join2(typeof e30 == "string" ? e30 : L.getPath(e30), t4), o2 = Be2(r3, i2);
      return L.create(a2, o2);
    },
    createDataFile(e30, t4, n3, r3, i2, a2) {
      var o2 = t4;
      e30 && (e30 = typeof e30 == "string" ? e30 : L.getPath(e30), o2 = t4 ? A2.join2(e30, t4) : e30);
      var s2 = Be2(r3, i2), c2 = L.create(o2, s2);
      if (n3) {
        n3 = ze2(n3), L.chmod(c2, s2 | 146);
        var l2 = L.open(c2, 577);
        L.write(l2, n3, 0, n3.length, 0, a2), L.close(l2), L.chmod(c2, s2);
      }
    },
    createDevice(e30, t4, n3, r3) {
      var i2 = A2.join2(typeof e30 == "string" ? e30 : L.getPath(e30), t4), a2 = Be2(!!n3, !!r3);
      L.createDevice.major ??= 64;
      var o2 = L.makedev(L.createDevice.major++, 0);
      return L.registerDevice(o2, {
        open(e31) {
          e31.seekable = false;
        },
        close(e31) {
          r3?.buffer?.length && r3(10);
        },
        read(e31, t5, r4, i3, a3) {
          for (var o3 = 0, s2 = 0; s2 < i3; s2++) {
            var c2;
            try {
              c2 = n3();
            } catch {
              throw new L.ErrnoError(29);
            }
            if (c2 === void 0 && !o3) throw new L.ErrnoError(6);
            if (c2 == null) break;
            o3++, t5[r4 + s2] = c2;
          }
          return o3 && (e31.node.atime = Date.now()), o3;
        },
        write(e31, t5, n4, i3, a3) {
          for (var o3 = 0; o3 < i3; o3++) try {
            r3(t5[n4 + o3]);
          } catch {
            throw new L.ErrnoError(29);
          }
          return i3 && (e31.node.mtime = e31.node.ctime = Date.now()), o3;
        }
      }), L.mkdev(i2, a2, o2);
    },
    forceLoadFile(e30) {
      if (e30.isDevice || e30.isFolder || e30.link || e30.contents) return true;
      if (globalThis.XMLHttpRequest) v2("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
      else try {
        e30.contents = u(e30.url);
      } catch {
        throw new L.ErrnoError(29);
      }
    },
    createLazyFile(e30, t4, n3, i2, a2) {
      class o2 {
        lengthKnown = false;
        chunks = [];
        get(e31) {
          if (!(e31 > this.length - 1 || e31 < 0)) {
            var t5 = e31 % this.chunkSize, n4 = e31 / this.chunkSize | 0;
            return this.getter(n4)[t5];
          }
        }
        setDataGetter(e31) {
          this.getter = e31;
        }
        cacheLength() {
          var e31 = new XMLHttpRequest();
          e31.open("HEAD", n3, false), e31.send(null), e31.status >= 200 && e31.status < 300 || e31.status === 304 || v2(`Couldn't load ${n3}. Status: ${e31.status}`);
          var t5 = Number(e31.getResponseHeader("Content-length")), r3, i3 = (r3 = e31.getResponseHeader("Accept-Ranges")) && r3 === "bytes", a3 = (r3 = e31.getResponseHeader("Content-Encoding")) && r3 === "gzip", o3 = 1048576;
          i3 || (o3 = t5);
          var s3 = (e32, r4) => {
            e32 > r4 && v2(`invalid range (${e32}, ${r4}) or no bytes requested!`), r4 > t5 - 1 && v2(`only ${t5} bytes available! programmer error!`);
            var i4 = new XMLHttpRequest();
            return i4.open("GET", n3, false), t5 !== o3 && i4.setRequestHeader("Range", `bytes=${e32}-${r4}`), i4.responseType = "arraybuffer", i4.overrideMimeType && i4.overrideMimeType("text/plain; charset=x-user-defined"), i4.send(null), i4.status >= 200 && i4.status < 300 || i4.status === 304 || v2(`Couldn't load ${n3}. Status: ${i4.status}`), i4.response === void 0 ? Pe2(i4.responseText ?? "", true) : new Uint8Array(i4.response || []);
          }, c3 = this;
          c3.setDataGetter((e32) => {
            var n4 = e32 * o3, r4 = (e32 + 1) * o3 - 1;
            return r4 = Math.min(r4, t5 - 1), c3.chunks[e32] === void 0 && (c3.chunks[e32] = s3(n4, r4)), c3.chunks[e32] === void 0 && v2("doXHR failed!"), c3.chunks[e32];
          }), (a3 || !t5) && (o3 = t5 = 1, t5 = this.getter(0).length, o3 = t5, d("LazyFiles on gzip forces download of the whole file when length is accessed")), this._length = t5, this._chunkSize = o3, this.lengthKnown = true;
        }
        get length() {
          return this.lengthKnown || this.cacheLength(), this._length;
        }
        get chunkSize() {
          return this.lengthKnown || this.cacheLength(), this._chunkSize;
        }
      }
      if (globalThis.XMLHttpRequest) {
        r2 || v2("Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");
        var s2 = {
          isDevice: false,
          contents: new o2()
        };
      } else var s2 = {
        isDevice: false,
        url: n3
      };
      var c2 = L.createFile(e30, t4, s2, i2, a2);
      s2.contents ? c2.contents = s2.contents : s2.url && (c2.contents = null, c2.url = s2.url), Object.defineProperties(c2, { usedBytes: { get: function() {
        return this.contents.length;
      } } });
      var l2 = {};
      for (let [e31, t5] of Object.entries(c2.stream_ops)) l2[e31] = (...e32) => (L.forceLoadFile(c2), t5(...e32));
      function u2(e31, t5, n4, r3, i3) {
        var a3 = e31.node.contents;
        if (i3 >= a3.length) return 0;
        var o3 = Math.min(a3.length - i3, r3);
        if (a3.slice) for (var s3 = 0; s3 < o3; s3++) t5[n4 + s3] = a3[i3 + s3];
        else for (var s3 = 0; s3 < o3; s3++) t5[n4 + s3] = a3.get(i3 + s3);
        return o3;
      }
      return l2.read = (e31, t5, n4, r3, i3) => (L.forceLoadFile(c2), u2(e31, t5, n4, r3, i3)), l2.mmap = (e31, t5, n4, r3, i3) => {
        L.forceLoadFile(c2);
        var a3 = Re2(t5);
        if (!a3) throw new L.ErrnoError(48);
        return u2(e31, b2, a3, t5, n4), {
          ptr: a3,
          allocated: true
        };
      }, c2.stream_ops = l2, c2;
    }
  }, et2 = (e30, t4, n3) => e30 ? M2(P2, e30, t4, n3) : "", R2, z2, B, V2 = {
    currentUmask: 18,
    calculateAt(e30, t4, n3) {
      if (A2.isAbs(t4)) return t4;
      var r3 = e30 === -100 ? L.cwd() : V2.getStreamFromFD(e30).path;
      if (t4.length == 0) {
        if (!n3) throw new L.ErrnoError(44);
        return r3;
      }
      return r3 + "/" + t4;
    },
    writeStat(e30, t4) {
      z2[e30 / 4] = t4.dev, z2[(e30 + 4) / 4] = t4.mode, O2[(e30 + 8) / 8] = BigInt(t4.nlink), z2[(e30 + 16) / 4] = t4.uid, z2[(e30 + 20) / 4] = t4.gid, z2[(e30 + 24) / 4] = t4.rdev, B[(e30 + 32) / 8] = BigInt(t4.size), R2[(e30 + 40) / 4] = 4096, R2[(e30 + 44) / 4] = t4.blocks;
      var n3 = t4.atime.getTime(), r3 = t4.mtime.getTime(), i2 = t4.ctime.getTime();
      return B[(e30 + 48) / 8] = BigInt(Math.floor(n3 / 1e3)), O2[(e30 + 56) / 8] = BigInt(n3 % 1e3 * 1e3 * 1e3), B[(e30 + 64) / 8] = BigInt(Math.floor(r3 / 1e3)), O2[(e30 + 72) / 8] = BigInt(r3 % 1e3 * 1e3 * 1e3), B[(e30 + 80) / 8] = BigInt(Math.floor(i2 / 1e3)), O2[(e30 + 88) / 8] = BigInt(i2 % 1e3 * 1e3 * 1e3), B[(e30 + 96) / 8] = BigInt(t4.ino), 0;
    },
    writeStatFs(e30, t4) {
      z2[(e30 + 8) / 4] = t4.bsize, z2[(e30 + 72) / 4] = t4.bsize, B[(e30 + 16) / 8] = BigInt(t4.blocks), B[(e30 + 24) / 8] = BigInt(t4.bfree), B[(e30 + 32) / 8] = BigInt(t4.bavail), B[(e30 + 40) / 8] = BigInt(t4.files), B[(e30 + 48) / 8] = BigInt(t4.ffree), z2[(e30 + 56) / 4] = t4.fsid, z2[(e30 + 80) / 4] = t4.flags, z2[(e30 + 64) / 4] = t4.namelen;
    },
    doMsync(e30, t4, n3, r3, i2) {
      if (!L.isFile(t4.node.mode)) throw new L.ErrnoError(43);
      if (r3 & 2) return 0;
      var a2 = P2.subarray(e30, e30 + n3);
      L.msync(t4, a2, i2, n3, r3);
    },
    getStreamFromFD(e30) {
      return L.getStreamChecked(e30);
    },
    varargs: void 0,
    getStr(e30) {
      return et2(e30);
    }
  };
  function tt2(e30, t4) {
    e30 = w2(e30);
    try {
      return e30 = V2.getStr(e30), L.chmod(e30, t4), 0;
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return -e31.errno;
    }
  }
  function nt2(e30) {
    try {
      var t4 = V2.getStreamFromFD(e30);
      return L.dupStream(t4).fd;
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return -e31.errno;
    }
  }
  function rt2(e30, t4, n3, r3) {
    t4 = w2(t4);
    try {
      if (t4 = V2.getStr(t4), t4 = V2.calculateAt(e30, t4), n3 & -8) return -28;
      var i2 = L.lookupPath(t4, { follow: true }).node;
      if (!i2) return -44;
      var a2 = "";
      return n3 & 4 && (a2 += "r"), n3 & 2 && (a2 += "w"), n3 & 1 && (a2 += "x"), a2 && L.nodePermissions(i2, a2) ? -2 : 0;
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return -e31.errno;
    }
  }
  function H2(e30, t4, n3, r3) {
    n3 = w2(n3), r3 = w2(r3);
    try {
      if (isNaN(n3) || isNaN(r3)) return -22;
      if (t4 != 0) return -138;
      if (n3 < 0 || r3 < 0) return -28;
      if (!V2.getStreamFromFD(e30).seekable) return -70;
      var i2 = L.fstat(e30).size, a2 = n3 + r3;
      return a2 > i2 && L.ftruncate(e30, a2), 0;
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return -e31.errno;
    }
  }
  function it2(e30, t4) {
    try {
      return L.fchmod(e30, t4), 0;
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return -e31.errno;
    }
  }
  var at = () => {
    var e30 = Number(O2[V2.varargs / 8]);
    return V2.varargs += 8, e30;
  }, U = () => {
    var e30 = R2[V2.varargs / 4];
    return V2.varargs += 4, e30;
  }, ot;
  function st(e30, t4, n3) {
    n3 = w2(n3), V2.varargs = n3;
    try {
      var r3 = V2.getStreamFromFD(e30);
      switch (t4) {
        case 0:
          var i2 = U();
          if (i2 < 0) return -28;
          for (; L.streams[i2]; ) i2++;
          return L.dupStream(r3, i2).fd;
        case 1:
        case 2:
          return 0;
        case 3:
          return r3.flags;
        case 4:
          var i2 = U(), a2 = 289792;
          return r3.flags = r3.flags & ~a2 | i2 & a2, 0;
        case 5:
          var i2 = at(), o2 = 0;
          return ot[(i2 + o2) / 2] = 2, 0;
        case 6:
        case 7:
          return 0;
      }
      return -28;
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return -e31.errno;
    }
  }
  function ct(e30, t4) {
    t4 = w2(t4);
    try {
      return V2.writeStat(t4, L.fstat(e30));
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return -e31.errno;
    }
  }
  var lt = (e30, t4, n3) => Ne2(e30, P2, t4, n3);
  function ut(e30, t4) {
    e30 = w2(e30), t4 = w2(t4);
    try {
      if (!t4) return -28;
      var n3 = L.cwd(), r3 = Me2(n3) + 1;
      return t4 < r3 ? -68 : (lt(n3, e30, t4), r3);
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return -e31.errno;
    }
  }
  function dt(e30, t4, n3) {
    t4 = w2(t4), n3 = w2(n3);
    try {
      var r3 = V2.getStreamFromFD(e30);
      r3.getdents ||= L.readdir(r3.path);
      for (var i2 = 280, a2 = 0, o2 = L.llseek(r3, 0, 1), s2 = Math.floor(o2 / i2), c2 = Math.min(r3.getdents.length, s2 + Math.floor(n3 / i2)), l2 = s2; l2 < c2; l2++) {
        var u2, d2, f2 = r3.getdents[l2];
        if (f2 === ".") u2 = r3.node.id, d2 = 4;
        else if (f2 === "..") u2 = L.lookupPath(r3.path, { parent: true }).node.id, d2 = 4;
        else {
          var p3;
          try {
            p3 = L.lookupNode(r3.node, f2);
          } catch (e31) {
            if (e31?.errno === 28) continue;
            throw e31;
          }
          u2 = p3.id, d2 = L.isChrdev(p3.mode) ? 2 : L.isDir(p3.mode) ? 4 : L.isLink(p3.mode) ? 10 : 8;
        }
        B[(t4 + a2) / 8] = BigInt(u2), B[(t4 + a2 + 8) / 8] = BigInt((l2 + 1) * i2), ot[(t4 + a2 + 16) / 2] = 280, b2[t4 + a2 + 18] = d2, lt(f2, t4 + a2 + 19, 256), a2 += i2;
      }
      return L.llseek(r3, l2 * i2, 0), a2;
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return -e31.errno;
    }
  }
  function ft(e30, t4, n3) {
    n3 = w2(n3), V2.varargs = n3;
    try {
      var r3 = V2.getStreamFromFD(e30);
      switch (t4) {
        case 21509:
          return r3.tty ? 0 : -59;
        case 21505:
          if (!r3.tty) return -59;
          if (r3.tty.ops.ioctl_tcgets) {
            var i2 = r3.tty.ops.ioctl_tcgets(r3), a2 = at();
            R2[a2 / 4] = i2.c_iflag || 0, R2[(a2 + 4) / 4] = i2.c_oflag || 0, R2[(a2 + 8) / 4] = i2.c_cflag || 0, R2[(a2 + 12) / 4] = i2.c_lflag || 0;
            for (var o2 = 0; o2 < 32; o2++) b2[a2 + o2 + 17] = i2.c_cc[o2] || 0;
            return 0;
          }
          return 0;
        case 21510:
        case 21511:
        case 21512:
          return r3.tty ? 0 : -59;
        case 21506:
        case 21507:
        case 21508:
          if (!r3.tty) return -59;
          if (r3.tty.ops.ioctl_tcsets) {
            for (var a2 = at(), s2 = R2[a2 / 4], c2 = R2[(a2 + 4) / 4], l2 = R2[(a2 + 8) / 4], u2 = R2[(a2 + 12) / 4], d2 = [], o2 = 0; o2 < 32; o2++) d2.push(b2[a2 + o2 + 17]);
            return r3.tty.ops.ioctl_tcsets(r3.tty, t4, {
              c_iflag: s2,
              c_oflag: c2,
              c_cflag: l2,
              c_lflag: u2,
              c_cc: d2
            });
          }
          return 0;
        case 21519:
          if (!r3.tty) return -59;
          var a2 = at();
          return R2[a2 / 4] = 0, 0;
        case 21520:
          return r3.tty ? -28 : -59;
        case 21537:
        case 21531:
          var a2 = at();
          return L.ioctl(r3, t4, a2);
        case 21523:
          if (!r3.tty) return -59;
          if (r3.tty.ops.ioctl_tiocgwinsz) {
            var f2 = r3.tty.ops.ioctl_tiocgwinsz(r3.tty), a2 = at();
            ot[a2 / 2] = f2[0], ot[(a2 + 2) / 2] = f2[1];
          }
          return 0;
        case 21524:
          return r3.tty ? 0 : -59;
        case 21515:
          return r3.tty ? 0 : -59;
        default:
          return -28;
      }
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return -e31.errno;
    }
  }
  function pt(e30, t4) {
    e30 = w2(e30), t4 = w2(t4);
    try {
      return e30 = V2.getStr(e30), V2.writeStat(t4, L.lstat(e30));
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return -e31.errno;
    }
  }
  function mt(e30, t4, n3, r3) {
    t4 = w2(t4), n3 = w2(n3);
    try {
      t4 = V2.getStr(t4);
      var i2 = r3 & 256, a2 = r3 & 4096;
      return r3 &= -6401, t4 = V2.calculateAt(e30, t4, a2), V2.writeStat(n3, i2 ? L.lstat(t4) : L.stat(t4));
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return -e31.errno;
    }
  }
  function ht(e30, t4, n3, r3) {
    t4 = w2(t4), r3 = w2(r3), V2.varargs = r3;
    try {
      t4 = V2.getStr(t4), t4 = V2.calculateAt(e30, t4);
      var i2 = r3 ? U() : 0;
      return n3 & 64 && (i2 &= ~V2.currentUmask), L.open(t4, n3, i2).fd;
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return -e31.errno;
    }
  }
  function gt(e30, t4, n3, r3) {
    t4 = w2(t4), n3 = w2(n3), r3 = w2(r3);
    try {
      if (t4 = V2.getStr(t4), t4 = V2.calculateAt(e30, t4), r3 <= 0) return -28;
      var i2 = L.readlink(t4), a2 = Math.min(r3, Me2(i2)), o2 = b2[n3 + a2];
      return lt(i2, n3, r3 + 1), b2[n3 + a2] = o2, a2;
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return -e31.errno;
    }
  }
  function _t(e30, t4, n3, r3) {
    t4 = w2(t4), r3 = w2(r3);
    try {
      return t4 = V2.getStr(t4), r3 = V2.getStr(r3), t4 = V2.calculateAt(e30, t4), r3 = V2.calculateAt(n3, r3), L.rename(t4, r3), 0;
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return -e31.errno;
    }
  }
  function vt(e30) {
    e30 = w2(e30);
    try {
      return e30 = V2.getStr(e30), L.rmdir(e30), 0;
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return -e31.errno;
    }
  }
  function yt(e30, t4) {
    e30 = w2(e30), t4 = w2(t4);
    try {
      return e30 = V2.getStr(e30), V2.writeStat(t4, L.stat(e30));
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return -e31.errno;
    }
  }
  function bt(e30, t4, n3) {
    e30 = w2(e30), n3 = w2(n3);
    try {
      return e30 = V2.getStr(e30), n3 = V2.getStr(n3), n3 = V2.calculateAt(t4, n3), L.symlink(e30, n3), 0;
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return -e31.errno;
    }
  }
  function xt(e30, t4, n3) {
    t4 = w2(t4);
    try {
      if (t4 = V2.getStr(t4), t4 = V2.calculateAt(e30, t4), !n3) L.unlink(t4);
      else if (n3 === 512) L.rmdir(t4);
      else return -28;
      return 0;
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return -e31.errno;
    }
  }
  var St = () => v2(""), Ct = {}, wt = (e30) => {
    for (; e30.length; ) {
      var t4 = e30.pop();
      e30.pop()(t4);
    }
  };
  function Tt(e30) {
    return this.fromWireType(Number(O2[e30 / 8]));
  }
  var Et = {}, Dt = {}, Ot = {};
  class kt extends Error {
    constructor(e30) {
      super(e30), this.name = "InternalError";
    }
  }
  var At = (e30) => {
    throw new kt(e30);
  }, jt = (e30, t4, n3) => {
    e30.forEach((e31) => Ot[e31] = t4);
    function r3(t5) {
      var r4 = n3(t5);
      r4.length !== e30.length && At("Mismatched type converter count");
      for (var i3 = 0; i3 < e30.length; ++i3) J(e30[i3], r4[i3]);
    }
    var i2 = Array(t4.length), a2 = [], o2 = 0;
    for (let [e31, n4] of t4.entries()) Dt.hasOwnProperty(n4) ? i2[e31] = Dt[n4] : (a2.push(n4), Et.hasOwnProperty(n4) || (Et[n4] = []), Et[n4].push(() => {
      i2[e31] = Dt[n4], ++o2, o2 === a2.length && r3(i2);
    }));
    a2.length === 0 && r3(i2);
  }, W = function(e30) {
    e30 = w2(e30);
    var t4 = Ct[e30];
    delete Ct[e30];
    var n3 = t4.rawConstructor, r3 = t4.rawDestructor, i2 = t4.fields, a2 = i2.map((e31) => e31.getterReturnType).concat(i2.map((e31) => e31.setterArgumentType));
    jt([e30], a2, (e31) => {
      var a3 = {};
      for (var [o2, s2] of i2.entries()) {
        let t5 = e31[o2], n4 = s2.getter, r4 = s2.getterContext, c2 = e31[o2 + i2.length], l2 = s2.setter, u2 = s2.setterContext;
        a3[s2.fieldName] = {
          read: (e32) => t5.fromWireType(n4(r4, e32)),
          write: (e32, t6) => {
            var n5 = [];
            l2(u2, e32, c2.toWireType(n5, t6)), wt(n5);
          },
          optional: t5.optional
        };
      }
      return [{
        name: t4.name,
        fromWireType: (e32) => {
          var t5 = {};
          for (var n4 in a3) t5[n4] = a3[n4].read(e32);
          return r3(e32), t5;
        },
        toWireType: (e32, t5) => {
          for (var i3 in a3) if (!(i3 in t5) && !a3[i3].optional) throw TypeError(`Missing field: "${i3}"`);
          var o3 = n3();
          for (i3 in a3) a3[i3].write(o3, t5[i3]);
          return e32 !== null && e32.push(r3, o3), o3;
        },
        readValueFromPointer: Tt,
        destructorFunction: r3
      }];
    });
  }, G = (e30) => {
    for (var t4 = ""; ; ) {
      var n3 = P2[e30++];
      if (!n3) return t4;
      t4 += String.fromCharCode(n3);
    }
  };
  class K extends Error {
    constructor(e30) {
      super(e30), this.name = "BindingError";
    }
  }
  var q = (e30) => {
    throw new K(e30);
  };
  function Mt(e30, t4, n3 = {}) {
    var r3 = t4.name;
    if (e30 || q(`type "${r3}" must have a positive integer typeid pointer`), Dt.hasOwnProperty(e30)) {
      if (n3.ignoreDuplicateRegistrations) return;
      q(`Cannot register type '${r3}' twice`);
    }
    if (Dt[e30] = t4, delete Ot[e30], Et.hasOwnProperty(e30)) {
      var i2 = Et[e30];
      delete Et[e30], i2.forEach((e31) => e31());
    }
  }
  function J(e30, t4, n3 = {}) {
    return Mt(e30, t4, n3);
  }
  var Nt, Pt = (e30, t4, n3) => {
    switch (t4) {
      case 1:
        return n3 ? (e31) => b2[e31] : (e31) => P2[e31];
      case 2:
        return n3 ? (e31) => ot[e31 / 2] : (e31) => Nt[e31 / 2];
      case 4:
        return n3 ? (e31) => R2[e31 / 4] : (e31) => z2[e31 / 4];
      case 8:
        return n3 ? (e31) => B[e31 / 8] : (e31) => O2[e31 / 8];
      default:
        throw TypeError(`invalid integer width (${t4}): ${e30}`);
    }
  }, Ft = function(e30, t4, n3, r3, i2) {
    e30 = w2(e30), t4 = w2(t4), n3 = w2(n3), t4 = G(t4);
    let a2 = r3 === 0n, o2 = (e31) => e31;
    if (a2) {
      let e31 = n3 * 8;
      o2 = (t5) => typeof t5 == "number" ? t5 >>> 0 : BigInt.asUintN(e31, t5), i2 = o2(i2);
    }
    J(e30, {
      name: t4,
      fromWireType: o2,
      toWireType: (e31, t5) => (typeof t5 == "number" && (t5 = BigInt(t5)), t5),
      readValueFromPointer: Pt(t4, n3, !a2),
      destructorFunction: null
    });
  };
  function It(e30, t4, n3, r3) {
    e30 = w2(e30), t4 = w2(t4), t4 = G(t4), J(e30, {
      name: t4,
      fromWireType: function(e31) {
        return !!e31;
      },
      toWireType: function(e31, t5) {
        return t5 ? n3 : r3;
      },
      readValueFromPointer: function(e31) {
        return this.fromWireType(P2[e31]);
      },
      destructorFunction: null
    });
  }
  var Lt = (e30) => ({
    count: e30.count,
    deleteScheduled: e30.deleteScheduled,
    preservePointerOnDelete: e30.preservePointerOnDelete,
    ptr: e30.ptr,
    ptrType: e30.ptrType,
    smartPtr: e30.smartPtr,
    smartPtrType: e30.smartPtrType
  }), Rt = (e30) => {
    function t4(e31) {
      return e31.$$.ptrType.registeredClass.name;
    }
    q(t4(e30) + " instance already deleted");
  }, zt2 = false, Bt = (e30) => {
  }, Vt = (e30) => {
    e30.smartPtr ? e30.smartPtrType.rawDestructor(e30.smartPtr) : e30.ptrType.registeredClass.rawDestructor(e30.ptr);
  }, Ht = (e30) => {
    --e30.count.value, e30.count.value === 0 && Vt(e30);
  }, Ut = (e30) => globalThis.FinalizationRegistry ? (zt2 = new FinalizationRegistry((e31) => {
    Ht(e31.$$);
  }), Ut = (e31) => {
    var t4 = e31.$$;
    if (t4.smartPtr) {
      var n3 = { $$: t4 };
      zt2.register(e31, n3, e31);
    }
    return e31;
  }, Bt = (e31) => zt2.unregister(e31), Ut(e30)) : (Ut = (e31) => e31, e30), Wt = [], Gt = () => {
    for (; Wt.length; ) {
      var e30 = Wt.pop();
      e30.$$.deleteScheduled = false, e30.delete();
    }
  }, Kt, qt = () => {
    let e30 = Jt.prototype;
    Object.assign(e30, {
      isAliasOf(e31) {
        if (!(this instanceof Jt) || !(e31 instanceof Jt)) return false;
        var t5 = this.$$.ptrType.registeredClass, n3 = this.$$.ptr;
        e31.$$ = e31.$$;
        for (var r3 = e31.$$.ptrType.registeredClass, i2 = e31.$$.ptr; t5.baseClass; ) n3 = t5.upcast(n3), t5 = t5.baseClass;
        for (; r3.baseClass; ) i2 = r3.upcast(i2), r3 = r3.baseClass;
        return t5 === r3 && n3 === i2;
      },
      clone() {
        if (this.$$.ptr || Rt(this), this.$$.preservePointerOnDelete) return this.$$.count.value += 1, this;
        var e31 = Ut(Object.create(Object.getPrototypeOf(this), { $$: { value: Lt(this.$$) } }));
        return e31.$$.count.value += 1, e31.$$.deleteScheduled = false, e31;
      },
      delete() {
        this.$$.ptr || Rt(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && q("Object already scheduled for deletion"), Bt(this), Ht(this.$$), this.$$.preservePointerOnDelete || (this.$$.smartPtr = void 0, this.$$.ptr = void 0);
      },
      isDeleted() {
        return !this.$$.ptr;
      },
      deleteLater() {
        return this.$$.ptr || Rt(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && q("Object already scheduled for deletion"), Wt.push(this), Wt.length === 1 && Kt && Kt(Gt), this.$$.deleteScheduled = true, this;
      }
    });
    let t4 = Symbol.dispose;
    t4 && (e30[t4] = e30.delete);
  };
  function Jt() {
  }
  var Yt = (e30, t4) => Object.defineProperty(t4, "name", { value: e30 }), Xt = {}, Zt = (e30, t4, n3) => {
    if (e30[t4].overloadTable === void 0) {
      var r3 = e30[t4];
      e30[t4] = function(...r4) {
        return e30[t4].overloadTable.hasOwnProperty(r4.length) || q(`Function '${n3}' called with an invalid number of arguments (${r4.length}) - expects one of (${e30[t4].overloadTable})!`), e30[t4].overloadTable[r4.length].apply(this, r4);
      }, e30[t4].overloadTable = [], e30[t4].overloadTable[r3.argCount] = r3;
    }
  }, Qt = (e30, n3, r3) => {
    t3.hasOwnProperty(e30) ? ((r3 === void 0 || t3[e30].overloadTable !== void 0 && t3[e30].overloadTable[r3] !== void 0) && q(`Cannot register public name '${e30}' twice`), Zt(t3, e30, e30), t3[e30].overloadTable.hasOwnProperty(r3) && q(`Cannot register multiple overloads of a function with the same number of arguments (${r3})!`), t3[e30].overloadTable[r3] = n3) : (t3[e30] = n3, t3[e30].argCount = r3);
  }, $t = 48, en = 57, tn = (e30) => {
    e30 = e30.replace(/[^a-zA-Z0-9_]/g, "$");
    var t4 = e30.charCodeAt(0);
    return t4 >= $t && t4 <= en ? `_${e30}` : e30;
  };
  function nn(e30, t4, n3, r3, i2, a2, o2, s2) {
    this.name = e30, this.constructor = t4, this.instancePrototype = n3, this.rawDestructor = r3, this.baseClass = i2, this.getActualType = a2, this.upcast = o2, this.downcast = s2, this.pureVirtualFunctions = [];
  }
  var rn = (e30, t4, n3) => {
    for (; t4 !== n3; ) t4.upcast || q(`Expected null or instance of ${n3.name}, got an instance of ${t4.name}`), e30 = t4.upcast(e30), t4 = t4.baseClass;
    return e30;
  }, an = (e30) => {
    if (e30 === null) return "null";
    var t4 = typeof e30;
    return t4 === "object" || t4 === "array" || t4 === "function" ? e30.toString() : "" + e30;
  };
  function on(e30, t4) {
    if (t4 === null) return this.isReference && q(`null is not a valid ${this.name}`), 0;
    t4.$$ || q(`Cannot pass "${an(t4)}" as a ${this.name}`), t4.$$.ptr || q(`Cannot pass deleted object as a pointer of type ${this.name}`);
    var n3 = t4.$$.ptrType.registeredClass;
    return rn(t4.$$.ptr, n3, this.registeredClass);
  }
  function sn(e30, t4) {
    var n3;
    if (t4 === null) return this.isReference && q(`null is not a valid ${this.name}`), this.isSmartPointer ? (n3 = this.rawConstructor(), e30 !== null && e30.push(this.rawDestructor, n3), n3) : 0;
    (!t4 || !t4.$$) && q(`Cannot pass "${an(t4)}" as a ${this.name}`), t4.$$.ptr || q(`Cannot pass deleted object as a pointer of type ${this.name}`), !this.isConst && t4.$$.ptrType.isConst && q(`Cannot convert argument of type ${t4.$$.smartPtrType ? t4.$$.smartPtrType.name : t4.$$.ptrType.name} to parameter type ${this.name}`);
    var r3 = t4.$$.ptrType.registeredClass;
    if (n3 = rn(t4.$$.ptr, r3, this.registeredClass), this.isSmartPointer) switch (t4.$$.smartPtr === void 0 && q("Passing raw pointer to smart pointer is illegal"), this.sharingPolicy) {
      case 0:
        t4.$$.smartPtrType === this ? n3 = t4.$$.smartPtr : q(`Cannot convert argument of type ${t4.$$.smartPtrType ? t4.$$.smartPtrType.name : t4.$$.ptrType.name} to parameter type ${this.name}`);
        break;
      case 1:
        n3 = t4.$$.smartPtr;
        break;
      case 2:
        if (t4.$$.smartPtrType === this) n3 = t4.$$.smartPtr;
        else {
          var i2 = t4.clone();
          n3 = this.rawShare(n3, Z.toHandle(() => i2.delete())), e30 !== null && e30.push(this.rawDestructor, n3);
        }
        break;
      default:
        q("Unsupported sharing policy");
    }
    return n3;
  }
  function cn(e30, t4) {
    if (t4 === null) return this.isReference && q(`null is not a valid ${this.name}`), 0;
    t4.$$ || q(`Cannot pass "${an(t4)}" as a ${this.name}`), t4.$$.ptr || q(`Cannot pass deleted object as a pointer of type ${this.name}`), t4.$$.ptrType.isConst && q(`Cannot convert argument of type ${t4.$$.ptrType.name} to parameter type ${this.name}`);
    var n3 = t4.$$.ptrType.registeredClass;
    return rn(t4.$$.ptr, n3, this.registeredClass);
  }
  var ln = (e30, t4, n3) => {
    if (t4 === n3) return e30;
    if (n3.baseClass === void 0) return null;
    var r3 = ln(e30, t4, n3.baseClass);
    return r3 === null ? null : n3.downcast(r3);
  }, un = {}, dn = (e30, t4) => {
    for (t4 === void 0 && q("ptr should not be undefined"); e30.baseClass; ) t4 = e30.upcast(t4), e30 = e30.baseClass;
    return t4;
  }, fn = (e30, t4) => (t4 = dn(e30, t4), un[t4]), pn = (e30, t4) => ((!t4.ptrType || !t4.ptr) && At("makeClassHandle requires ptr and ptrType"), !!t4.smartPtrType != !!t4.smartPtr && At("Both smartPtrType and smartPtr must be specified"), t4.count = { value: 1 }, Ut(Object.create(e30, { $$: {
    value: t4,
    writable: true
  } })));
  function mn(e30) {
    e30 = w2(e30);
    var t4 = this.getPointee(e30);
    if (!t4) return this.destructor(e30), null;
    var n3 = fn(this.registeredClass, t4);
    if (n3 !== void 0) {
      if (n3.$$.count.value === 0) return n3.$$.ptr = t4, n3.$$.smartPtr = e30, n3.clone();
      var r3 = n3.clone();
      return this.destructor(e30), r3;
    }
    function i2() {
      return this.isSmartPointer ? pn(this.registeredClass.instancePrototype, {
        ptrType: this.pointeeType,
        ptr: t4,
        smartPtrType: this,
        smartPtr: e30
      }) : pn(this.registeredClass.instancePrototype, {
        ptrType: this,
        ptr: e30
      });
    }
    var a2 = Xt[this.registeredClass.getActualType(t4)];
    if (!a2) return i2.call(this);
    var o2 = this.isConst ? a2.constPointerType : a2.pointerType, s2 = ln(t4, this.registeredClass, o2.registeredClass);
    return s2 === null ? i2.call(this) : this.isSmartPointer ? pn(o2.registeredClass.instancePrototype, {
      ptrType: o2,
      ptr: s2,
      smartPtrType: this,
      smartPtr: e30
    }) : pn(o2.registeredClass.instancePrototype, {
      ptrType: o2,
      ptr: s2
    });
  }
  var hn = () => {
    Object.assign(gn.prototype, {
      getPointee(e30) {
        return this.rawGetPointee && (e30 = this.rawGetPointee(e30)), e30;
      },
      destructor(e30) {
        this.rawDestructor?.(e30);
      },
      readValueFromPointer: Tt,
      fromWireType: mn
    });
  };
  function gn(e30, t4, n3, r3, i2, a2, o2, s2, c2, l2, u2) {
    this.name = e30, this.registeredClass = t4, this.isReference = n3, this.isConst = r3, this.isSmartPointer = i2, this.pointeeType = a2, this.sharingPolicy = o2, this.rawGetPointee = s2, this.rawConstructor = c2, this.rawShare = l2, this.rawDestructor = u2, !i2 && t4.baseClass === void 0 ? r3 ? (this.toWireType = on, this.destructorFunction = null) : (this.toWireType = cn, this.destructorFunction = null) : this.toWireType = sn;
  }
  var _n = (e30, n3, r3) => {
    t3.hasOwnProperty(e30) || At("Replacing nonexistent public symbol"), t3[e30].overloadTable !== void 0 && r3 !== void 0 ? t3[e30].overloadTable[r3] = n3 : (t3[e30] = n3, t3[e30].argCount = r3);
  }, vn = (e30, t4, n3 = [], r3 = false) => {
    for (var i2 = 1; i2 < e30.length; ++i2) e30[i2] == "p" && (n3[i2 - 1] = BigInt(n3[i2 - 1]));
    var a2 = T2(t4)(...n3);
    function o2(t5) {
      return e30[0] == "p" ? Number(t5) : t5;
    }
    return o2(a2);
  }, yn = (e30, t4, n3 = false) => (...r3) => vn(e30, t4, r3, n3), Y = (e30, t4, n3 = false) => {
    e30 = G(e30);
    function r3() {
      return e30.includes("p") ? yn(e30, t4, n3) : T2(t4);
    }
    var i2 = r3();
    return typeof i2 != "function" && q(`unknown function pointer with signature ${e30}: ${t4}`), i2;
  };
  class bn extends Error {
  }
  var xn = (e30) => {
    var t4 = yi(e30), n3 = G(t4);
    return Q(t4), n3;
  }, Sn = (e30, t4) => {
    var n3 = [], r3 = {};
    function i2(e31) {
      if (!r3[e31] && !Dt[e31]) {
        if (Ot[e31]) {
          Ot[e31].forEach(i2);
          return;
        }
        n3.push(e31), r3[e31] = true;
      }
    }
    throw t4.forEach(i2), new bn(`${e30}: ` + n3.map(xn).join([", "]));
  };
  function Cn(e30, t4, n3, r3, i2, a2, o2, s2, c2, l2, u2, d2, f2) {
    e30 = w2(e30), t4 = w2(t4), n3 = w2(n3), r3 = w2(r3), i2 = w2(i2), a2 = w2(a2), o2 = w2(o2), s2 = w2(s2), c2 = w2(c2), l2 = w2(l2), u2 = w2(u2), d2 = w2(d2), f2 = w2(f2), u2 = G(u2), a2 = Y(i2, a2), s2 &&= Y(o2, s2), l2 &&= Y(c2, l2), f2 = Y(d2, f2);
    var p3 = tn(u2);
    Qt(p3, function() {
      Sn(`Cannot construct ${u2} due to unbound types`, [r3]);
    }), jt([
      e30,
      t4,
      n3
    ], r3 ? [r3] : [], (t5) => {
      t5 = t5[0];
      var n4, i3;
      r3 ? (n4 = t5.registeredClass, i3 = n4.instancePrototype) : i3 = Jt.prototype;
      var o3 = Yt(u2, function(...e31) {
        if (Object.getPrototypeOf(this) !== c3) throw new K(`Use 'new' to construct ${u2}`);
        if (d3.constructor_body === void 0) throw new K(`${u2} has no accessible constructor`);
        var t6 = d3.constructor_body[e31.length];
        if (t6 === void 0) throw new K(`Tried to invoke ctor of ${u2} with invalid number of parameters (${e31.length}) - expected (${Object.keys(d3.constructor_body).toString()}) parameters instead!`);
        return t6.apply(this, e31);
      }), c3 = Object.create(i3, { constructor: { value: o3 } });
      o3.prototype = c3;
      var d3 = new nn(u2, o3, c3, f2, n4, a2, s2, l2);
      d3.baseClass && (d3.baseClass.__derivedClasses ??= [], d3.baseClass.__derivedClasses.push(d3));
      var m3 = new gn(u2, d3, true, false, false), h3 = new gn(u2 + "*", d3, false, false, false), g3 = new gn(u2 + " const*", d3, false, true, false);
      return Xt[e30] = {
        pointerType: h3,
        constPointerType: g3
      }, _n(p3, o3), [
        m3,
        h3,
        g3
      ];
    });
  }
  var wn = [], X = [
    0,
    1,
    ,
    1,
    null,
    1,
    true,
    1,
    false,
    1
  ], Tn = [];
  function En(e30) {
    if (e30 = w2(e30), e30 > 9 && --X[e30 + 1] === 0) {
      var t4 = X[e30];
      X[e30] = void 0;
      var n3 = Tn[e30];
      n3 && (Tn[e30] = void 0, n3(t4)), wn.push(e30);
    }
  }
  var Z = {
    toValue: (e30) => (e30 || q(`Cannot use deleted val. handle = ${e30}`), X[e30]),
    toHandle: (e30) => {
      switch (e30) {
        case void 0:
          return 2;
        case null:
          return 4;
        case true:
          return 6;
        case false:
          return 8;
        default: {
          let t4 = wn.pop() || X.length;
          return X[t4] = e30, X[t4 + 1] = 1, t4;
        }
      }
    }
  }, Dn = {
    name: "emscripten::val",
    fromWireType: (e30) => {
      var t4 = Z.toValue(e30);
      return En(e30), t4;
    },
    toWireType: (e30, t4) => Z.toHandle(t4),
    readValueFromPointer: Tt,
    destructorFunction: null
  };
  function On(e30) {
    return e30 = w2(e30), J(e30, Dn);
  }
  var kn = (e30, t4, n3) => {
    switch (t4) {
      case 1:
        return n3 ? function(e31) {
          return this.fromWireType(b2[e31]);
        } : function(e31) {
          return this.fromWireType(P2[e31]);
        };
      case 2:
        return n3 ? function(e31) {
          return this.fromWireType(ot[e31 / 2]);
        } : function(e31) {
          return this.fromWireType(Nt[e31 / 2]);
        };
      case 4:
        return n3 ? function(e31) {
          return this.fromWireType(R2[e31 / 4]);
        } : function(e31) {
          return this.fromWireType(z2[e31 / 4]);
        };
      default:
        throw TypeError(`invalid integer width (${t4}): ${e30}`);
    }
  };
  function An(e30) {
    return e30 ? e30 === 1 ? "number" : "string" : "object";
  }
  function jn(e30, n3, r3, i2, a2) {
    e30 = w2(e30), n3 = w2(n3), r3 = w2(r3), n3 = G(n3);
    let o2 = An(a2);
    switch (o2) {
      case "object": {
        let t4 = function() {
        };
        t4.values = {}, J(e30, {
          name: n3,
          constructor: t4,
          valueType: o2,
          fromWireType: function(e31) {
            return this.constructor.values[e31];
          },
          toWireType: (e31, t5) => t5.value,
          readValueFromPointer: kn(n3, r3, i2),
          destructorFunction: null
        }), Qt(n3, t4);
        break;
      }
      case "number":
        var s2 = {};
        J(e30, {
          name: n3,
          keysMap: s2,
          valueType: o2,
          fromWireType: (e31) => e31,
          toWireType: (e31, t4) => t4,
          readValueFromPointer: kn(n3, r3, i2),
          destructorFunction: null
        }), Qt(n3, s2), delete t3[n3].argCount;
        break;
      case "string":
        var c2 = {}, l2 = {}, s2 = {};
        J(e30, {
          name: n3,
          valuesMap: c2,
          reverseMap: l2,
          keysMap: s2,
          valueType: o2,
          fromWireType: function(e31) {
            return this.reverseMap[e31];
          },
          toWireType: function(e31, t4) {
            return this.valuesMap[t4];
          },
          readValueFromPointer: kn(n3, r3, i2),
          destructorFunction: null
        }), Qt(n3, s2), delete t3[n3].argCount;
    }
  }
  var Mn = (e30, t4) => {
    var n3 = Dt[e30];
    return n3 === void 0 && q(`${t4} has unknown type ${xn(e30)}`), n3;
  };
  function Nn(e30, t4, n3) {
    e30 = w2(e30), t4 = w2(t4);
    var r3 = Mn(e30, "enum");
    switch (t4 = G(t4), r3.valueType) {
      case "object":
        var i2 = r3.constructor, a2 = Object.create(r3.constructor.prototype, {
          value: { value: n3 },
          constructor: { value: Yt(`${r3.name}_${t4}`, function() {
          }) }
        });
        i2.values[n3] = a2, i2[t4] = a2;
        break;
      case "number":
        r3.keysMap[t4] = n3;
        break;
      case "string":
        r3.valuesMap[t4] = n3, r3.reverseMap[n3] = t4, r3.keysMap[t4] = t4;
    }
  }
  var Pn, Fn, In = (e30, t4) => {
    switch (t4) {
      case 4:
        return function(e31) {
          return this.fromWireType(Pn[e31 / 4]);
        };
      case 8:
        return function(e31) {
          return this.fromWireType(Fn[e31 / 8]);
        };
      default:
        throw TypeError(`invalid float width (${t4}): ${e30}`);
    }
  }, Ln = function(e30, t4, n3) {
    e30 = w2(e30), t4 = w2(t4), n3 = w2(n3), t4 = G(t4), J(e30, {
      name: t4,
      fromWireType: (e31) => e31,
      toWireType: (e31, t5) => t5,
      readValueFromPointer: In(t4, n3),
      destructorFunction: null
    });
  };
  function Rn(e30) {
    for (var t4 = 1; t4 < e30.length; ++t4) if (e30[t4] !== null && e30[t4].destructorFunction === void 0) return true;
    return false;
  }
  var zn = {
    ftf: function(e30, t4, n3, r3, i2, a2, o2) {
      return function() {
        return a2(n3(r3));
      };
    },
    ftft: function(e30, t4, n3, r3, i2, a2, o2, s2, c2) {
      return function(e31) {
        var t5 = s2(null, e31), i3 = n3(r3, t5);
        return c2(t5), a2(i3);
      };
    },
    ftfn: function(e30, t4, n3, r3, i2, a2, o2, s2) {
      return function(e31) {
        return a2(n3(r3, s2(null, e31)));
      };
    },
    ftfnn: function(e30, t4, n3, r3, i2, a2, o2, s2, c2) {
      return function(e31, t5) {
        return a2(n3(r3, s2(null, e31), c2(null, t5)));
      };
    },
    fffn: function(e30, t4, n3, r3, i2, a2, o2, s2) {
      return function(e31) {
        n3(r3, s2(null, e31));
      };
    },
    ftfnnn: function(e30, t4, n3, r3, i2, a2, o2, s2, c2, l2) {
      return function(e31, t5, i3) {
        return a2(n3(r3, s2(null, e31), c2(null, t5), l2(null, i3)));
      };
    },
    ftfnt: function(e30, t4, n3, r3, i2, a2, o2, s2, c2, l2) {
      return function(e31, t5) {
        var i3 = s2(null, e31), o3 = c2(null, t5), u2 = n3(r3, i3, o3);
        return l2(o3), a2(u2);
      };
    }
  };
  function Bn(e30, t4, n3, r3) {
    let i2 = [
      t4 ? "t" : "f",
      n3 ? "t" : "f",
      r3 ? "t" : "f"
    ];
    for (let n4 = t4 ? 1 : 2; n4 < e30.length; ++n4) {
      let t5 = e30[n4], r4 = "";
      r4 = t5.destructorFunction === void 0 ? "u" : t5.destructorFunction === null ? "n" : "t", i2.push(r4);
    }
    return i2.join("");
  }
  function Vn(e30, t4, n3, r3, i2, a2) {
    var o2 = t4.length;
    o2 < 2 && q("argTypes array size mismatch! Must at least get return value and receiver (this) types!");
    for (var s2 = t4[1] !== null && n3 !== null, c2 = Rn(t4), l2 = !t4[0].isVoid, u2 = t4[0], d2 = t4[1], f2 = [
      e30,
      q,
      r3,
      i2,
      wt,
      u2.fromWireType.bind(u2),
      d2?.toWireType.bind(d2)
    ], p3 = 2; p3 < o2; ++p3) {
      var m3 = t4[p3];
      f2.push(m3.toWireType.bind(m3));
    }
    if (!c2) for (var p3 = s2 ? 1 : 2; p3 < t4.length; ++p3) t4[p3].destructorFunction !== null && f2.push(t4[p3].destructorFunction);
    return Yt(e30, zn[Bn(t4, s2, l2, a2)](...f2));
  }
  var Hn = (e30, t4) => {
    for (var n3 = [], r3 = 0; r3 < e30; r3++) n3.push(Number(O2[(t4 + r3 * 8) / 8]));
    return n3;
  }, Un = (e30) => {
    e30 = e30.trim();
    let t4 = e30.indexOf("(");
    return t4 === -1 ? e30 : e30.slice(0, t4);
  };
  function Wn(e30, t4, n3, r3, i2, a2, o2, s2) {
    e30 = w2(e30), n3 = w2(n3), r3 = w2(r3), i2 = w2(i2), a2 = w2(a2);
    var c2 = Hn(t4, n3);
    e30 = G(e30), e30 = Un(e30), i2 = Y(r3, i2, o2), Qt(e30, function() {
      Sn(`Cannot call ${e30} due to unbound types`, c2);
    }, t4 - 1), jt([], c2, (n4) => {
      var r4 = [n4[0], null].concat(n4.slice(1));
      return _n(e30, Vn(e30, r4, null, i2, a2, o2), t4 - 1), [];
    });
  }
  var Gn = function(e30, t4, n3, r3, i2) {
    e30 = w2(e30), t4 = w2(t4), n3 = w2(n3), t4 = G(t4);
    let a2 = r3 === 0, o2 = (e31) => e31;
    if (a2) {
      var s2 = 32 - 8 * n3;
      o2 = (e31) => e31 << s2 >>> s2, i2 = o2(i2);
    }
    J(e30, {
      name: t4,
      fromWireType: o2,
      toWireType: (e31, t5) => t5,
      readValueFromPointer: Pt(t4, n3, r3 !== 0),
      destructorFunction: null
    });
  };
  function Kn(e30, t4, n3) {
    e30 = w2(e30), n3 = w2(n3);
    var r3 = [
      Int8Array,
      Uint8Array,
      Int16Array,
      Uint16Array,
      Int32Array,
      Uint32Array,
      Float32Array,
      Float64Array,
      BigInt64Array,
      BigUint64Array
    ][t4];
    function i2(e31) {
      var t5 = Number(O2[e31 / 8]), n4 = Number(O2[(e31 + 8) / 8]);
      return new r3(b2.buffer, n4, t5);
    }
    n3 = G(n3), J(e30, {
      name: n3,
      fromWireType: i2,
      readValueFromPointer: i2
    }, { ignoreDuplicateRegistrations: true });
  }
  function qn(e30, t4) {
    e30 = w2(e30), t4 = w2(t4), t4 = G(t4);
    var n3 = true;
    J(e30, {
      name: t4,
      fromWireType(e31) {
        var t5 = Number(O2[e31 / 8]), r3 = e31 + 8, i2;
        if (n3) i2 = et2(r3, t5, true);
        else {
          i2 = "";
          for (var a2 = 0; a2 < t5; ++a2) i2 += String.fromCharCode(P2[r3 + a2]);
        }
        return Q(e31), i2;
      },
      toWireType(e31, t5) {
        t5 instanceof ArrayBuffer && (t5 = new Uint8Array(t5));
        var r3, i2 = typeof t5 == "string";
        i2 || ArrayBuffer.isView(t5) && t5.BYTES_PER_ELEMENT == 1 || q("Cannot pass non-string to std::string"), r3 = n3 && i2 ? Me2(t5) : t5.length;
        var a2 = bi(8 + r3 + 1), o2 = a2 + 8;
        if (O2[a2 / 8] = BigInt(r3), i2) {
          if (n3) lt(t5, o2, r3 + 1);
          else for (var s2 = 0; s2 < r3; ++s2) {
            var c2 = t5.charCodeAt(s2);
            c2 > 255 && (Q(a2), q("String has UTF-16 code units that do not fit in 8 bits")), P2[o2 + s2] = c2;
          }
        } else P2.set(t5, o2);
        return e31 !== null && e31.push(Q, a2), a2;
      },
      readValueFromPointer: Tt,
      destructorFunction(e31) {
        Q(e31);
      }
    });
  }
  var Jn = globalThis.TextDecoder ? new TextDecoder("utf-16le") : void 0, Yn = (e30, t4, n3) => {
    var r3 = e30 / 2, i2 = Ae2(Nt, r3, t4 / 2, n3);
    if (i2 - r3 > 16 && Jn) return Jn.decode(Nt.subarray(r3, i2));
    for (var a2 = "", o2 = r3; o2 < i2; ++o2) {
      var s2 = Nt[o2];
      a2 += String.fromCharCode(s2);
    }
    return a2;
  }, Xn = (e30, t4, n3 = 2147483647) => {
    if (n3 < 2) return 0;
    n3 -= 2;
    for (var r3 = t4, i2 = n3 < e30.length * 2 ? n3 / 2 : e30.length, a2 = 0; a2 < i2; ++a2) {
      var o2 = e30.charCodeAt(a2);
      ot[t4 / 2] = o2, t4 += 2;
    }
    return ot[t4 / 2] = 0, t4 - r3;
  }, Zn = (e30) => e30.length * 2, Qn = (e30, t4, n3) => {
    for (var r3 = "", i2 = e30 / 4, a2 = 0; !(a2 >= t4 / 4); a2++) {
      var o2 = z2[i2 + a2];
      if (!o2 && !n3) break;
      r3 += String.fromCodePoint(o2);
    }
    return r3;
  }, $n = (e30, t4, n3 = 2147483647) => {
    if (n3 < 4) return 0;
    for (var r3 = t4, i2 = r3 + n3 - 4, a2 = 0; a2 < e30.length; ++a2) {
      var o2 = e30.codePointAt(a2);
      if (o2 > 65535 && a2++, R2[t4 / 4] = o2, t4 += 4, t4 + 4 > i2) break;
    }
    return R2[t4 / 4] = 0, t4 - r3;
  }, er = (e30) => {
    for (var t4 = 0, n3 = 0; n3 < e30.length; ++n3) e30.codePointAt(n3) > 65535 && n3++, t4 += 4;
    return t4;
  };
  function tr(e30, t4, n3) {
    e30 = w2(e30), t4 = w2(t4), n3 = w2(n3), n3 = G(n3);
    var r3, i2, a2;
    t4 === 2 ? (r3 = Yn, i2 = Xn, a2 = Zn) : (r3 = Qn, i2 = $n, a2 = er), J(e30, {
      name: n3,
      fromWireType: (e31) => {
        var n4 = Number(O2[e31 / 8]), i3 = r3(e31 + 8, n4 * t4, true);
        return Q(e31), i3;
      },
      toWireType: (e31, r4) => {
        typeof r4 != "string" && q(`Cannot pass non-string to C++ string type ${n3}`);
        var o2 = a2(r4), s2 = bi(8 + o2 + t4);
        return O2[s2 / 8] = BigInt(o2 / t4), i2(r4, s2 + 8, o2 + t4), e31 !== null && e31.push(Q, s2), s2;
      },
      readValueFromPointer: Tt,
      destructorFunction(e31) {
        Q(e31);
      }
    });
  }
  function nr(e30, t4, n3, r3, i2, a2) {
    e30 = w2(e30), t4 = w2(t4), n3 = w2(n3), r3 = w2(r3), i2 = w2(i2), a2 = w2(a2), Ct[e30] = {
      name: G(t4),
      rawConstructor: Y(n3, r3),
      rawDestructor: Y(i2, a2),
      fields: []
    };
  }
  function rr(e30, t4, n3, r3, i2, a2, o2, s2, c2, l2) {
    e30 = w2(e30), t4 = w2(t4), n3 = w2(n3), r3 = w2(r3), i2 = w2(i2), a2 = w2(a2), o2 = w2(o2), s2 = w2(s2), c2 = w2(c2), l2 = w2(l2), Ct[e30].fields.push({
      fieldName: G(t4),
      getterReturnType: n3,
      getter: Y(r3, i2),
      getterContext: a2,
      setterArgumentType: o2,
      setter: Y(s2, c2),
      setterContext: l2
    });
  }
  var ir = function(e30, t4) {
    e30 = w2(e30), t4 = w2(t4), t4 = G(t4), J(e30, {
      isVoid: true,
      name: t4,
      fromWireType: () => void 0,
      toWireType: (e31, t5) => void 0
    });
  }, ar = () => {
  };
  function or(e30) {
    return e30 = w2(e30), e30 ? -52 : 0;
  }
  var sr = () => {
    throw new ee2();
  }, cr = [], lr = (e30) => {
    var t4 = cr.length;
    return cr.push(e30), t4;
  }, ur = (e30, t4) => {
    for (var n3 = Array(e30), r3 = 0; r3 < e30; ++r3) n3[r3] = Mn(Number(O2[(t4 + r3 * 8) / 8]), `parameter ${r3}`);
    return n3;
  }, dr = (e30, t4, n3) => {
    var r3 = [], i2 = e30(r3, n3);
    return r3.length && (O2[t4 / 8] = BigInt(Z.toHandle(r3))), i2;
  }, fr = {}, pr = (e30) => {
    var t4 = fr[e30];
    return t4 === void 0 ? G(e30) : t4;
  }, mr = function(e30, t4, n3) {
    t4 = w2(t4);
    var r3 = (() => {
      var [r4, ...i2] = ur(e30, t4), a2 = r4.toWireType.bind(r4), o2 = i2.map((e31) => e31.readValueFromPointer.bind(e31));
      e30--;
      var s2 = Array(e30);
      return lr(Yt(`methodCaller<(${i2.map((e31) => e31.name)}) => ${r4.name}>`, (t5, r5, i3, c2) => {
        for (var l2 = 0, u2 = 0; u2 < e30; ++u2) s2[u2] = o2[u2](c2 + l2), l2 += 16;
        var d2;
        switch (n3) {
          case 0:
            d2 = Z.toValue(t5).apply(null, s2);
            break;
          case 2:
            d2 = Reflect.construct(Z.toValue(t5), s2);
            break;
          case 3:
            d2 = s2[0];
            break;
          case 1:
            d2 = Z.toValue(t5)[pr(r5)](...s2);
        }
        return dr(a2, i3, d2);
      }));
    })();
    return BigInt(r3);
  };
  function hr(e30) {
    e30 = w2(e30), e30 > 9 && (X[e30 + 1] += 1);
  }
  function gr(e30, t4, n3, r3, i2) {
    return e30 = w2(e30), t4 = w2(t4), n3 = w2(n3), r3 = w2(r3), i2 = w2(i2), cr[e30](t4, n3, r3, i2);
  }
  var _r = () => BigInt(Z.toHandle([])), vr = (e30) => (e30 = w2(e30), BigInt(Z.toHandle(pr(e30)))), yr = () => BigInt(Z.toHandle({}));
  function br(e30) {
    e30 = w2(e30), wt(Z.toValue(e30)), En(e30);
  }
  function xr(e30, t4, n3) {
    e30 = w2(e30), t4 = w2(t4), n3 = w2(n3), e30 = Z.toValue(e30), t4 = Z.toValue(t4), n3 = Z.toValue(n3), e30[t4] = n3;
  }
  function Sr(e30, t4) {
    e30 = w2(e30), t4 = w2(t4);
    var n3 = /* @__PURE__ */ new Date(e30 * 1e3);
    if (isNaN(n3.getTime())) return 1;
    R2[t4 / 4] = n3.getUTCSeconds(), R2[(t4 + 4) / 4] = n3.getUTCMinutes(), R2[(t4 + 8) / 4] = n3.getUTCHours(), R2[(t4 + 12) / 4] = n3.getUTCDate(), R2[(t4 + 16) / 4] = n3.getUTCMonth(), R2[(t4 + 20) / 4] = n3.getUTCFullYear() - 1900, R2[(t4 + 24) / 4] = n3.getUTCDay();
    var r3 = Date.UTC(n3.getUTCFullYear(), 0, 1, 0, 0, 0, 0), i2 = (n3.getTime() - r3) / 864e5 | 0;
    return R2[(t4 + 28) / 4] = i2, 0;
  }
  var Cr = (e30) => e30 % 4 == 0 && (e30 % 100 != 0 || e30 % 400 == 0), wr = [
    0,
    31,
    60,
    91,
    121,
    152,
    182,
    213,
    244,
    274,
    305,
    335
  ], Tr = [
    0,
    31,
    59,
    90,
    120,
    151,
    181,
    212,
    243,
    273,
    304,
    334
  ], Er = (e30) => (Cr(e30.getFullYear()) ? wr : Tr)[e30.getMonth()] + e30.getDate() - 1;
  function Dr(e30, t4) {
    e30 = w2(e30), t4 = w2(t4);
    var n3 = /* @__PURE__ */ new Date(e30 * 1e3);
    if (isNaN(n3.getTime())) return 1;
    R2[t4 / 4] = n3.getSeconds(), R2[(t4 + 4) / 4] = n3.getMinutes(), R2[(t4 + 8) / 4] = n3.getHours(), R2[(t4 + 12) / 4] = n3.getDate(), R2[(t4 + 16) / 4] = n3.getMonth(), R2[(t4 + 20) / 4] = n3.getFullYear() - 1900, R2[(t4 + 24) / 4] = n3.getDay();
    var r3 = Er(n3) | 0;
    R2[(t4 + 28) / 4] = r3, B[(t4 + 40) / 8] = BigInt(-(n3.getTimezoneOffset() * 60));
    var i2 = new Date(n3.getFullYear(), 0, 1), a2 = new Date(n3.getFullYear(), 6, 1).getTimezoneOffset(), o2 = i2.getTimezoneOffset(), s2 = (a2 != o2 && n3.getTimezoneOffset() == Math.min(o2, a2)) | 0;
    return R2[(t4 + 32) / 4] = s2, 0;
  }
  var Or = function(e30) {
    e30 = w2(e30);
    var t4 = (() => {
      var t5 = new Date(R2[(e30 + 20) / 4] + 1900, R2[(e30 + 16) / 4], R2[(e30 + 12) / 4], R2[(e30 + 8) / 4], R2[(e30 + 4) / 4], R2[e30 / 4], 0);
      if (isNaN(t5.getTime())) return -1;
      var n3 = R2[(e30 + 32) / 4], r3 = t5.getTimezoneOffset(), i2 = new Date(t5.getFullYear(), 0, 1), a2 = new Date(t5.getFullYear(), 6, 1).getTimezoneOffset(), o2 = i2.getTimezoneOffset(), s2 = Math.min(o2, a2);
      if (n3 < 0) n3 = Number(a2 != o2 && s2 == r3);
      else if (n3 > 0 != (s2 == r3)) {
        var c2 = n3 > 0 ? s2 : Math.max(o2, a2);
        if (t5.setTime(t5.getTime() + (c2 - r3) * 6e4), isNaN(t5.getTime())) return -1;
      }
      R2[(e30 + 32) / 4] = n3, R2[(e30 + 24) / 4] = t5.getDay();
      var l2 = Er(t5) | 0;
      return R2[(e30 + 28) / 4] = l2, R2[e30 / 4] = t5.getSeconds(), R2[(e30 + 4) / 4] = t5.getMinutes(), R2[(e30 + 8) / 4] = t5.getHours(), R2[(e30 + 12) / 4] = t5.getDate(), R2[(e30 + 16) / 4] = t5.getMonth(), R2[(e30 + 20) / 4] = t5.getYear(), t5.getTime() / 1e3;
    })();
    return BigInt(t4);
  };
  function kr(e30, t4, n3, r3, i2, a2, o2) {
    e30 = w2(e30), i2 = w2(i2), a2 = w2(a2), o2 = w2(o2);
    try {
      var s2 = V2.getStreamFromFD(r3), c2 = L.mmap(s2, e30, i2, t4, n3), l2 = c2.ptr;
      return R2[a2 / 4] = c2.allocated, O2[o2 / 8] = BigInt(l2), 0;
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return -e31.errno;
    }
  }
  function Ar(e30, t4, n3, r3, i2, a2) {
    e30 = w2(e30), t4 = w2(t4), a2 = w2(a2);
    try {
      var o2 = V2.getStreamFromFD(i2);
      n3 & 2 && V2.doMsync(e30, o2, t4, r3, a2);
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return -e31.errno;
    }
  }
  var jr = function(e30, t4, n3, r3) {
    e30 = w2(e30), t4 = w2(t4), n3 = w2(n3), r3 = w2(r3);
    var i2 = (/* @__PURE__ */ new Date()).getFullYear(), a2 = new Date(i2, 0, 1), o2 = new Date(i2, 6, 1), s2 = a2.getTimezoneOffset(), c2 = o2.getTimezoneOffset(), l2 = Math.max(s2, c2);
    O2[e30 / 8] = BigInt(l2 * 60), R2[t4 / 4] = Number(s2 != c2);
    var u2 = (e31) => {
      var t5 = e31 >= 0 ? "-" : "+", n4 = Math.abs(e31);
      return `UTC${t5}${String(Math.floor(n4 / 60)).padStart(2, "0")}${String(n4 % 60).padStart(2, "0")}`;
    }, d2 = u2(s2), f2 = u2(c2);
    c2 < s2 ? (lt(d2, n3, 17), lt(f2, r3, 17)) : (lt(d2, r3, 17), lt(f2, n3, 17));
  }, Mr = () => performance.now(), Nr = () => Date.now(), Pr = 1, Fr = (e30) => e30 >= 0 && e30 <= 3;
  function Ir(e30, t4, n3) {
    if (t4 = w2(t4), n3 = w2(n3), !Fr(e30)) return 28;
    var r3;
    if (e30 === 0) r3 = Nr();
    else if (Pr) r3 = Mr();
    else return 52;
    var i2 = Math.round(r3 * 1e3 * 1e3);
    return B[n3 / 8] = BigInt(i2), 0;
  }
  var Lr = () => 17179869184, Rr = () => BigInt(Lr()), zr = (e30) => {
    var t4 = (e30 - ki.buffer.byteLength + 65535) / 65536 | 0;
    try {
      return ki.grow(BigInt(t4)), ne2(), 1;
    } catch {
    }
  };
  function Br(e30) {
    e30 = w2(e30);
    var t4 = P2.length, n3 = Lr();
    if (e30 > n3) return false;
    for (var r3 = 1; r3 <= 4; r3 *= 2) {
      var i2 = t4 * (1 + 0.2 / r3);
      if (i2 = Math.min(i2, e30 + 100663296), zr(Math.min(n3, Le2(Math.max(e30, i2), 65536)))) return true;
    }
    return false;
  }
  var Vr = {}, Hr = () => i, Ur = () => {
    if (!Ur.strings) {
      var e30 = {
        USER: "web_user",
        LOGNAME: "web_user",
        PATH: "/",
        PWD: "/",
        HOME: "/home/web_user",
        LANG: (globalThis.navigator?.language ?? "C").replace("-", "_") + ".UTF-8",
        _: Hr()
      };
      for (var t4 in Vr) Vr[t4] === void 0 ? delete e30[t4] : e30[t4] = Vr[t4];
      var n3 = [];
      for (var t4 in e30) n3.push(`${t4}=${e30[t4]}`);
      Ur.strings = n3;
    }
    return Ur.strings;
  };
  function Wr(e30, t4) {
    e30 = w2(e30), t4 = w2(t4);
    var n3 = 0, r3 = 0;
    for (var i2 of Ur()) {
      var a2 = t4 + n3;
      O2[(e30 + r3) / 8] = BigInt(a2), n3 += lt(i2, a2, Infinity) + 1, r3 += 8;
    }
    return 0;
  }
  function Gr(e30, t4) {
    e30 = w2(e30), t4 = w2(t4);
    var n3 = Ur();
    O2[e30 / 8] = BigInt(n3.length);
    var r3 = 0;
    for (var i2 of n3) r3 += Me2(i2) + 1;
    return O2[t4 / 8] = BigInt(r3), 0;
  }
  var Kr = () => true, qr = (e30) => {
    Kr() || (m2 = true), a(e30, new de2(e30));
  }, Jr = (e30, t4) => {
    qr(e30);
  };
  function Yr(e30) {
    try {
      var t4 = V2.getStreamFromFD(e30);
      return L.close(t4), 0;
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return e31.errno;
    }
  }
  function Xr(e30, t4) {
    t4 = w2(t4);
    try {
      var n3 = 0, r3 = 0, i2 = 0, a2 = V2.getStreamFromFD(e30), o2 = a2.tty ? 2 : L.isDir(a2.mode) ? 3 : L.isLink(a2.mode) ? 7 : 4;
      return b2[t4] = o2, ot[(t4 + 2) / 2] = i2, B[(t4 + 8) / 8] = BigInt(n3), B[(t4 + 16) / 8] = BigInt(r3), 0;
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return e31.errno;
    }
  }
  var Zr = (e30, t4, n3, r3) => {
    for (var i2 = 0, a2 = 0; a2 < n3; a2++) {
      var o2 = Number(O2[t4 / 8]), s2 = Number(O2[(t4 + 8) / 8]);
      t4 += 16;
      try {
        var c2 = L.read(e30, b2, o2, s2, r3);
      } catch (e31) {
        if (i2 > 0 && e31 instanceof L.ErrnoError && (e31.errno == 6 || e31.errno == 6)) break;
        throw e31;
      }
      if (c2 < 0) return -1;
      if (i2 += c2, c2 < s2) break;
      r3 !== void 0 && (r3 += c2);
    }
    return i2;
  };
  function Qr(e30, t4, n3, r3, i2) {
    t4 = w2(t4), n3 = w2(n3), r3 = w2(r3), i2 = w2(i2);
    try {
      if (isNaN(r3)) return 22;
      var a2 = Zr(V2.getStreamFromFD(e30), t4, n3, r3);
      return O2[i2 / 8] = BigInt(a2), 0;
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return e31.errno;
    }
  }
  function $r(e30, t4, n3, r3) {
    t4 = w2(t4), n3 = w2(n3), r3 = w2(r3);
    try {
      var i2 = Zr(V2.getStreamFromFD(e30), t4, n3);
      return O2[r3 / 8] = BigInt(i2), 0;
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return e31.errno;
    }
  }
  function ei(e30, t4, n3, r3) {
    t4 = w2(t4), r3 = w2(r3);
    try {
      if (isNaN(t4)) return 22;
      var i2 = V2.getStreamFromFD(e30);
      return L.llseek(i2, t4, n3), B[r3 / 8] = BigInt(i2.position), i2.getdents && !t4 && n3 === 0 && (i2.getdents = null), 0;
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return e31.errno;
    }
  }
  function ti(e30) {
    try {
      var t4 = V2.getStreamFromFD(e30);
      return t4.stream_ops?.fsync?.(t4);
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return e31.errno;
    }
  }
  var ni = (e30, t4, n3, r3) => {
    if (n3 == 1) return L.write(e30, b2, Number(O2[t4 / 8]), Number(O2[(t4 + 8) / 8]), r3);
    for (var i2 = 0, a2 = 0, o2 = t4; a2 < n3; a2++, o2 += 16) i2 += Number(O2[(o2 + 8) / 8]);
    for (var s2 = new Uint8Array(i2), c2 = 0, a2 = 0; a2 < n3; a2++, t4 += 16) {
      var l2 = Number(O2[t4 / 8]), u2 = Number(O2[(t4 + 8) / 8]);
      s2.set(P2.subarray(l2, l2 + u2), c2), c2 += u2;
    }
    return L.write(e30, s2, 0, i2, r3);
  };
  function ri(e30, t4, n3, r3) {
    t4 = w2(t4), n3 = w2(n3), r3 = w2(r3);
    try {
      var i2 = ni(V2.getStreamFromFD(e30), t4, n3);
      return O2[r3 / 8] = BigInt(i2), 0;
    } catch (e31) {
      if (L === void 0 || e31.name !== "ErrnoError") throw e31;
      return e31.errno;
    }
  }
  function ii(e30) {
    return e30 = w2(e30), e30;
  }
  function ai(e30, t4) {
    return e30 = w2(e30), t4 = w2(t4), De2(P2.subarray(e30, e30 + t4));
  }
  var oi = (e30, t4) => {
    if (si) for (var n3 = e30; n3 < e30 + t4; n3++) {
      var r3 = T2(n3);
      r3 && si.set(r3, n3);
    }
  }, si, ci = (e30) => (si || (si = /* @__PURE__ */ new WeakMap(), oi(0, Number(Ai.length))), si.get(e30) || 0), li = [], ui = () => li.length ? li.pop() : Ai.grow(1n), di = (e30, t4) => {
    Ai.set(BigInt(e30), t4), pe2[e30] = Ai.get(BigInt(e30));
  }, fi = (e30) => {
    let t4 = e30.length;
    return [
      t4 % 128 | 128,
      t4 >> 7,
      ...e30
    ];
  }, pi = {
    i: 127,
    p: 126,
    j: 126,
    f: 125,
    d: 124,
    e: 111
  }, mi = (e30) => fi(Array.from(e30, (e31) => pi[e31])), hi = (e30, t4) => {
    var n3 = Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0, 1, ...fi([
      1,
      96,
      ...mi(t4.slice(1)),
      ...mi(t4[0] === "v" ? "" : t4[0])
    ]), 2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0), r3 = new WebAssembly.Module(n3);
    return new WebAssembly.Instance(r3, { e: { f: e30 } }).exports.f;
  }, gi = (e30, t4) => {
    var n3 = ci(e30);
    if (n3) return n3;
    var r3 = ui();
    try {
      di(r3, e30);
    } catch (n4) {
      if (!(n4 instanceof TypeError)) throw n4;
      di(r3, hi(e30, t4));
    }
    return si.set(e30, r3), r3;
  };
  function _i(e30, t4 = "i8") {
    switch (t4.endsWith("*") && (t4 = "*"), t4) {
      case "i1":
        return b2[e30];
      case "i8":
        return b2[e30];
      case "i16":
        return ot[e30 / 2];
      case "i32":
        return R2[e30 / 4];
      case "i64":
        return B[e30 / 8];
      case "float":
        return Pn[e30 / 4];
      case "double":
        return Fn[e30 / 8];
      case "*":
        return Number(O2[e30 / 8]);
      default:
        v2(`invalid type for getValue: ${t4}`);
    }
  }
  function vi(e30, t4, n3 = "i8") {
    switch (n3.endsWith("*") && (n3 = "*"), n3) {
      case "i1":
        b2[e30] = t4;
        break;
      case "i8":
        b2[e30] = t4;
        break;
      case "i16":
        ot[e30 / 2] = t4;
        break;
      case "i32":
        R2[e30 / 4] = t4;
        break;
      case "i64":
        B[e30 / 8] = BigInt(t4);
        break;
      case "float":
        Pn[e30 / 4] = t4;
        break;
      case "double":
        Fn[e30 / 8] = t4;
        break;
      case "*":
        O2[e30 / 8] = BigInt(t4);
        break;
      default:
        v2(`invalid type for setValue: ${n3}`);
    }
  }
  L.createPreloadedFile = $e2, L.preloadFile = Qe2, L.staticInit(), qt(), hn(), t3.wasmBinary && (p2 = t3.wasmBinary), t3.addFunction = gi, t3.setValue = vi, t3.getValue = _i, t3.UTF8ToString = et2, t3.stringToUTF8 = lt, t3.lengthBytesUTF8 = Me2, t3.FS = L;
  var yi, bi, Q, xi, $, Si, Ci, wi, Ti, Ei, Di, Oi, ki, Ai;
  function ji(e30) {
    yi = e30.$b, t3._MagickColor_Create = e30.ac, t3._MagickColor_Dispose = e30.bc, t3._MagickColor_Count_Get = e30.cc, t3._MagickColor_Red_Get = e30.dc, t3._MagickColor_Red_Set = e30.ec, t3._MagickColor_Green_Get = e30.fc, t3._MagickColor_Green_Set = e30.gc, t3._MagickColor_Blue_Get = e30.hc, t3._MagickColor_Blue_Set = e30.ic, t3._MagickColor_Alpha_Get = e30.jc, t3._MagickColor_Alpha_Set = e30.kc, t3._MagickColor_Black_Get = e30.lc, t3._MagickColor_Black_Set = e30.mc, t3._MagickColor_IsCMYK_Get = e30.nc, t3._MagickColor_IsCMYK_Set = e30.oc, t3._MagickColor_Clone = e30.pc, t3._MagickColor_FuzzyEquals = e30.qc, t3._MagickColor_Initialize = e30.rc, t3._MagickColorCollection_Create = e30.tc, t3._MagickColorCollection_Dispose = e30.uc, t3._MagickColorCollection_Get = e30.vc, t3._MagickColorCollection_Set = e30.wc, t3._DrawingWand_Create = e30.xc, t3._DrawingWand_Dispose = e30.yc, t3._DrawingWand_Affine = e30.zc, t3._DrawingWand_Alpha = e30.Ac, t3._DrawingWand_Arc = e30.Bc, t3._DrawingWand_Bezier = e30.Cc, t3._DrawingWand_BorderColor = e30.Dc, t3._DrawingWand_Circle = e30.Ec, t3._DrawingWand_ClipPath = e30.Fc, t3._DrawingWand_ClipRule = e30.Gc, t3._DrawingWand_ClipUnits = e30.Hc, t3._DrawingWand_Color = e30.Ic, t3._DrawingWand_Composite = e30.Jc, t3._DrawingWand_Density = e30.Kc, t3._DrawingWand_Ellipse = e30.Lc, t3._DrawingWand_FillColor = e30.Mc, t3._DrawingWand_FillOpacity = e30.Nc, t3._DrawingWand_FillPatternUrl = e30.Oc, t3._DrawingWand_FillRule = e30.Pc, t3._DrawingWand_Font = e30.Qc, t3._DrawingWand_FontFamily = e30.Rc, t3._DrawingWand_FontPointSize = e30.Sc, t3._DrawingWand_FontTypeMetrics = e30.Tc, t3._TypeMetric_Create = e30.Uc, t3._DrawingWand_Gravity = e30.Vc, t3._DrawingWand_Line = e30.Wc, t3._DrawingWand_PathArcAbs = e30.Xc, t3._DrawingWand_PathArcRel = e30.Yc, t3._DrawingWand_PathClose = e30.Zc, t3._DrawingWand_PathCurveToAbs = e30._c, t3._DrawingWand_PathCurveToRel = e30.$c, t3._DrawingWand_PathFinish = e30.ad, t3._DrawingWand_PathLineToAbs = e30.bd, t3._DrawingWand_PathLineToHorizontalAbs = e30.cd, t3._DrawingWand_PathLineToHorizontalRel = e30.dd, t3._DrawingWand_PathLineToRel = e30.ed, t3._DrawingWand_PathLineToVerticalAbs = e30.fd, t3._DrawingWand_PathLineToVerticalRel = e30.gd, t3._DrawingWand_PathMoveToAbs = e30.hd, t3._DrawingWand_PathMoveToRel = e30.id, t3._DrawingWand_PathQuadraticCurveToAbs = e30.jd, t3._DrawingWand_PathQuadraticCurveToRel = e30.kd, t3._DrawingWand_PathSmoothCurveToAbs = e30.ld, t3._DrawingWand_PathSmoothCurveToRel = e30.md, t3._DrawingWand_PathSmoothQuadraticCurveToAbs = e30.nd, t3._DrawingWand_PathSmoothQuadraticCurveToRel = e30.od, t3._DrawingWand_PathStart = e30.pd, t3._DrawingWand_Point = e30.qd, t3._DrawingWand_Polygon = e30.rd, t3._DrawingWand_Polyline = e30.sd, t3._DrawingWand_PopClipPath = e30.td, t3._DrawingWand_PopGraphicContext = e30.ud, t3._DrawingWand_PopPattern = e30.vd, t3._DrawingWand_PushClipPath = e30.wd, t3._DrawingWand_PushGraphicContext = e30.xd, t3._DrawingWand_PushPattern = e30.yd, t3._DrawingWand_Rectangle = e30.zd, t3._DrawingWand_Render = e30.Ad, t3._DrawingWand_Rotation = e30.Bd, t3._DrawingWand_RoundRectangle = e30.Cd, t3._DrawingWand_Scaling = e30.Dd, t3._DrawingWand_SkewX = e30.Ed, t3._DrawingWand_SkewY = e30.Fd, t3._DrawingWand_StrokeAntialias = e30.Gd, t3._DrawingWand_StrokeColor = e30.Hd, t3._DrawingWand_StrokeDashArray = e30.Id, t3._DrawingWand_StrokeDashOffset = e30.Jd, t3._DrawingWand_StrokeLineCap = e30.Kd, t3._DrawingWand_StrokeLineJoin = e30.Ld, t3._DrawingWand_StrokeMiterLimit = e30.Md, t3._DrawingWand_StrokeOpacity = e30.Nd, t3._DrawingWand_StrokePatternUrl = e30.Od, t3._DrawingWand_StrokeWidth = e30.Pd, t3._DrawingWand_Text = e30.Qd, t3._DrawingWand_TextAlignment = e30.Rd, t3._DrawingWand_TextAntialias = e30.Sd, t3._DrawingWand_TextDecoration = e30.Td, t3._DrawingWand_TextDirection = e30.Ud, t3._DrawingWand_TextEncoding = e30.Vd, t3._DrawingWand_TextInterlineSpacing = e30.Wd, t3._DrawingWand_TextInterwordSpacing = e30.Xd, t3._DrawingWand_TextKerning = e30.Yd, t3._DrawingWand_TextUnderColor = e30.Zd, t3._DrawingWand_Translation = e30._d, t3._DrawingWand_Viewbox = e30.$d, t3._MagickExceptionHelper_Description = e30.ae, t3._MagickExceptionHelper_Dispose = e30.be, t3._MagickExceptionHelper_Related = e30.ce, t3._MagickExceptionHelper_RelatedCount = e30.de, t3._MagickExceptionHelper_Message = e30.ee, t3._MagickExceptionHelper_Severity = e30.fe, t3._PdfInfo_PageCount = e30.ge, t3._Environment_Initialize = e30.he, t3._Environment_GetEnv = e30.ie, t3._Environment_SetEnv = e30.je, t3._MagickMemory_Relinquish = e30.ke, t3._Magick_Delegates_Get = e30.le, t3._Magick_Features_Get = e30.me, t3._Magick_ImageMagickVersion_Get = e30.ne, t3._Magick_GetFonts = e30.oe, t3._Magick_GetFontFamily = e30.pe, t3._Magick_GetFontName = e30.qe, t3._Magick_GetWindowsResource = e30.re, t3._Magick_DisposeFonts = e30.se, t3._Magick_ResetRandomSeed = e30.te, t3._Magick_SetDefaultFontFile = e30.ue, t3._Magick_SetRandomSeed = e30.ve, t3._Magick_SetLogDelegate = e30.we, t3._Magick_SetLogEvents = e30.xe, t3._MagickFormatInfo_CreateList = e30.ye, t3._MagickFormatInfo_DisposeList = e30.ze, t3._MagickFormatInfo_CanReadMultithreaded_Get = e30.Ae, t3._MagickFormatInfo_CanWriteMultithreaded_Get = e30.Be, t3._MagickFormatInfo_Description_Get = e30.Ce, t3._MagickFormatInfo_Format_Get = e30.De, t3._MagickFormatInfo_MimeType_Get = e30.Ee, t3._MagickFormatInfo_Module_Get = e30.Fe, t3._MagickFormatInfo_SupportsMultipleFrames_Get = e30.Ge, t3._MagickFormatInfo_SupportsReading_Get = e30.He, t3._MagickFormatInfo_SupportsWriting_Get = e30.Ie, t3._MagickFormatInfo_Version_Get = e30.Je, t3._MagickFormatInfo_GetInfo = e30.Ke, t3._MagickFormatInfo_GetInfoByName = e30.Le, t3._MagickFormatInfo_GetInfoWithBlob = e30.Me, t3._MagickFormatInfo_Unregister = e30.Ne, t3._MagickImage_Create = e30.Oe, t3._MagickImage_Dispose = e30.Pe, t3._MagickImage_AnimationDelay_Get = e30.Qe, t3._MagickImage_AnimationDelay_Set = e30.Re, t3._MagickImage_AnimationIterations_Get = e30.Se, t3._MagickImage_AnimationIterations_Set = e30.Te, t3._MagickImage_AnimationTicksPerSecond_Get = e30.Ue, t3._MagickImage_AnimationTicksPerSecond_Set = e30.Ve, t3._MagickImage_BackgroundColor_Get = e30.We, t3._MagickImage_BackgroundColor_Set = e30.Xe, t3._MagickImage_BaseHeight_Get = e30.Ye, t3._MagickImage_BaseWidth_Get = e30.Ze, t3._MagickImage_BlackPointCompensation_Get = e30._e, t3._MagickImage_BlackPointCompensation_Set = e30.$e, t3._MagickImage_BorderColor_Get = e30.af, t3._MagickImage_BorderColor_Set = e30.bf, t3._MagickImage_BoundingBox_Get = e30.cf, t3._MagickRectangle_Create = e30.df, t3._MagickImage_ChannelCount_Get = e30.ef, t3._MagickImage_ChromaBlue_Get = e30.ff, t3._PrimaryInfo_Create = e30.gf, t3._MagickImage_ChromaBlue_Set = e30.hf, t3._MagickImage_ChromaGreen_Get = e30.jf, t3._MagickImage_ChromaGreen_Set = e30.kf, t3._MagickImage_ChromaRed_Get = e30.lf, t3._MagickImage_ChromaRed_Set = e30.mf, t3._MagickImage_ChromaWhite_Get = e30.nf, t3._MagickImage_ChromaWhite_Set = e30.of, t3._MagickImage_ClassType_Get = e30.pf, t3._MagickImage_ClassType_Set = e30.qf, t3._QuantizeSettings_Create = e30.rf, t3._QuantizeSettings_Dispose = e30.sf, t3._MagickImage_ColorFuzz_Get = e30.tf, t3._MagickImage_ColorFuzz_Set = e30.uf, t3._MagickImage_ColormapSize_Get = e30.vf, t3._MagickImage_ColormapSize_Set = e30.wf, t3._MagickImage_ColorSpace_Get = e30.xf, t3._MagickImage_ColorSpace_Set = e30.yf, t3._MagickImage_ColorType_Get = e30.zf, t3._MagickImage_ColorType_Set = e30.Af, t3._MagickImage_Compose_Get = e30.Bf, t3._MagickImage_Compose_Set = e30.Cf, t3._MagickImage_Compression_Get = e30.Df, t3._MagickImage_Compression_Set = e30.Ef, t3._MagickImage_Depth_Get = e30.Ff, t3._MagickImage_Depth_Set = e30.Gf, t3._MagickImage_EncodingGeometry_Get = e30.Hf, t3._MagickImage_Endian_Get = e30.If, t3._MagickImage_Endian_Set = e30.Jf, t3._MagickImage_FileName_Get = e30.Kf, t3._MagickImage_FileName_Set = e30.Lf, t3._MagickImage_FilterType_Get = e30.Mf, t3._MagickImage_FilterType_Set = e30.Nf, t3._MagickImage_Format_Get = e30.Of, t3._MagickImage_Format_Set = e30.Pf, t3._MagickImage_Gamma_Get = e30.Qf, t3._MagickImage_GifDisposeMethod_Get = e30.Rf, t3._MagickImage_GifDisposeMethod_Set = e30.Sf, t3._MagickImage_HasAlpha_Get = e30.Tf, t3._MagickImage_HasAlpha_Set = e30.Uf, t3._MagickImage_Height_Get = e30.Vf, t3._MagickImage_Interlace_Get = e30.Wf, t3._MagickImage_Interlace_Set = e30.Xf, t3._MagickImage_Interpolate_Get = e30.Yf, t3._MagickImage_Interpolate_Set = e30.Zf, t3._MagickImage_IsOpaque_Get = e30._f, t3._MagickImage_MatteColor_Get = e30.$f, t3._MagickImage_MatteColor_Set = e30.ag, t3._MagickImage_MeanErrorPerPixel_Get = e30.bg, t3._MagickImage_MetaChannelCount_Get = e30.cg, t3._MagickImage_MetaChannelCount_Set = e30.dg, t3._MagickImage_NormalizedMaximumError_Get = e30.eg, t3._MagickImage_NormalizedMeanError_Get = e30.fg, t3._MagickImage_Orientation_Get = e30.gg, t3._MagickImage_Orientation_Set = e30.hg, t3._MagickImage_Page_Get = e30.ig, t3._MagickImage_Page_Set = e30.jg, t3._MagickImage_Quality_Get = e30.kg, t3._MagickImage_Quality_Set = e30.lg, t3._MagickImage_RenderingIntent_Get = e30.mg, t3._MagickImage_RenderingIntent_Set = e30.ng, t3._MagickImage_ResolutionUnits_Get = e30.og, t3._MagickImage_ResolutionUnits_Set = e30.pg, t3._MagickImage_ResolutionX_Get = e30.qg, t3._MagickImage_ResolutionX_Set = e30.rg, t3._MagickImage_ResolutionY_Get = e30.sg, t3._MagickImage_ResolutionY_Set = e30.tg, t3._MagickImage_Signature_Get = e30.ug, t3._MagickImage_TotalColors_Get = e30.vg, t3._MagickImage_VirtualPixelMethod_Get = e30.wg, t3._MagickImage_VirtualPixelMethod_Set = e30.xg, t3._MagickImage_Width_Get = e30.yg, t3._MagickImage_AdaptiveBlur = e30.zg, t3._MagickImage_AdaptiveResize = e30.Ag, t3._MagickImage_AdaptiveSharpen = e30.Bg, t3._MagickImage_AdaptiveThreshold = e30.Cg, t3._MagickImage_AddNoise = e30.Dg, t3._MagickImage_AffineTransform = e30.Eg, t3._MagickImage_Annotate = e30.Fg, t3._MagickImage_AutoGamma = e30.Gg, t3._MagickImage_AutoLevel = e30.Hg, t3._MagickImage_AutoOrient = e30.Ig, t3._MagickImage_AutoThreshold = e30.Jg, t3._MagickImage_BilateralBlur = e30.Kg, t3._MagickImage_BlackThreshold = e30.Lg, t3._MagickImage_BlueShift = e30.Mg, t3._MagickImage_Blur = e30.Ng, t3._MagickImage_Border = e30.Og, t3._MagickImage_BrightnessContrast = e30.Pg, t3._MagickImage_CannyEdge = e30.Qg, t3._MagickImage_ChannelOffset = e30.Rg, t3._MagickImage_Charcoal = e30.Sg, t3._MagickImage_Chop = e30.Tg, t3._MagickImage_Clahe = e30.Ug, t3._MagickImage_Clamp = e30.Vg, t3._MagickImage_ClipPath = e30.Wg, t3._MagickImage_Clone = e30.Xg, t3._MagickImage_CloneArea = e30.Yg, t3._MagickImage_Clut = e30.Zg, t3._MagickImage_ColorDecisionList = e30._g, t3._MagickImage_Colorize = e30.$g, t3._MagickImage_ColorMatrix = e30.ah, t3._MagickImage_ColorThreshold = e30.bh, t3._MagickImage_Compare = e30.ch, t3._MagickImage_CompareDistortion = e30.dh, t3._MagickImage_Composite = e30.eh, t3._MagickImage_CompositeGravity = e30.fh, t3._MagickImage_ConnectedComponents = e30.gh, t3._MagickImage_Contrast = e30.hh, t3._MagickImage_ContrastStretch = e30.ih, t3._MagickImage_ConvexHull = e30.jh, t3._MagickImage_Convolve = e30.kh, t3._MagickImage_CopyPixels = e30.lh, t3._MagickImage_Crop = e30.mh, t3._MagickImage_CropToTiles = e30.nh, t3._MagickImage_CycleColormap = e30.oh, t3._MagickImage_Decipher = e30.ph, t3._MagickImage_Deskew = e30.qh, t3._MagickImage_Despeckle = e30.rh, t3._MagickImage_DetermineBitDepth = e30.sh, t3._MagickImage_DetermineColorType = e30.th, t3._MagickImage_Distort = e30.uh, t3._MagickImage_Edge = e30.vh, t3._MagickImage_Emboss = e30.wh, t3._MagickImage_Encipher = e30.xh, t3._MagickImage_Enhance = e30.yh, t3._MagickImage_Equalize = e30.zh, t3._MagickImage_Equals = e30.Ah, t3._MagickImage_EvaluateFunction = e30.Bh, t3._MagickImage_EvaluateGeometry = e30.Ch, t3._MagickImage_EvaluateOperator = e30.Dh, t3._MagickImage_Extent = e30.Eh, t3._MagickImage_Flip = e30.Fh, t3._MagickImage_FloodFill = e30.Gh, t3._MagickImage_Flop = e30.Hh, t3._MagickImage_FontTypeMetrics = e30.Ih, t3._MagickImage_FormatExpression = e30.Jh, t3._MagickImage_Frame = e30.Kh, t3._MagickImage_Fx = e30.Lh, t3._MagickImage_GammaCorrect = e30.Mh, t3._MagickImage_GaussianBlur = e30.Nh, t3._MagickImage_GetArtifact = e30.Oh, t3._MagickImage_GetAttribute = e30.Ph, t3._MagickImage_GetColormapColor = e30.Qh, t3._MagickImage_GetNext = e30.Rh, t3._MagickImage_GetNextArtifactName = e30.Sh, t3._MagickImage_GetNextAttributeName = e30.Th, t3._MagickImage_GetNextProfileName = e30.Uh, t3._MagickImage_GetProfile = e30.Vh, t3._MagickImage_GetReadMask = e30.Wh, t3._MagickImage_GetWriteMask = e30.Xh, t3._MagickImage_Grayscale = e30.Yh, t3._MagickImage_HaldClut = e30.Zh, t3._MagickImage_HasChannel = e30._h, t3._MagickImage_HasProfile = e30.$h, t3._MagickImage_Histogram = e30.ai, t3._MagickImage_HoughLine = e30.bi, t3._MagickImage_Implode = e30.ci, t3._MagickImage_ImportIndexedPixels = e30.di, t3._MagickImage_ImportPixels = e30.ei, t3._MagickImage_Integral = e30.fi, t3._MagickImage_InterpolativeResize = e30.gi, t3._MagickImage_InverseLevel = e30.hi, t3._MagickImage_Kmeans = e30.ii, t3._MagickImage_Kuwahara = e30.ji, t3._MagickImage_Level = e30.ki, t3._MagickImage_LevelColors = e30.li, t3._MagickImage_LinearStretch = e30.mi, t3._MagickImage_LiquidRescale = e30.ni, t3._MagickImage_LocalContrast = e30.oi, t3._MagickImage_Magnify = e30.pi, t3._MagickImage_MeanShift = e30.qi, t3._MagickImage_Minify = e30.ri, t3._MagickImage_MinimumBoundingBox = e30.si, t3._MagickImage_Modulate = e30.ti, t3._MagickImage_Moments = e30.ui, t3._MagickImage_Morphology = e30.vi, t3._MagickImage_MotionBlur = e30.wi, t3._MagickImage_Negate = e30.xi, t3._MagickImage_Normalize = e30.yi, t3._MagickImage_OilPaint = e30.zi, t3._MagickImage_Opaque = e30.Ai, t3._MagickImage_OrderedDither = e30.Bi, t3._MagickImage_Perceptible = e30.Ci, t3._MagickImage_PerceptualHash = e30.Di, t3._MagickImage_Quantize = e30.Ei, t3._MagickImage_Polaroid = e30.Fi, t3._MagickImage_Posterize = e30.Gi, t3._MagickImage_RaiseOrLower = e30.Hi, t3._MagickImage_RandomThreshold = e30.Ii, t3._MagickImage_RangeThreshold = e30.Ji, t3._MagickImage_ReadBlob = e30.Ki, t3._MagickImage_ReadFile = e30.Li, t3._MagickImage_ReadPixels = e30.Mi, t3._MagickImage_ReadStream = e30.Ni, t3._MagickImage_RegionMask = e30.Oi, t3._MagickImage_Remap = e30.Pi, t3._MagickImage_RemoveArtifact = e30.Qi, t3._MagickImage_RemoveAttribute = e30.Ri, t3._MagickImage_RemoveProfile = e30.Si, t3._MagickImage_ResetArtifactIterator = e30.Ti, t3._MagickImage_ResetAttributeIterator = e30.Ui, t3._MagickImage_ResetProfileIterator = e30.Vi, t3._MagickImage_Resample = e30.Wi, t3._MagickImage_Resize = e30.Xi, t3._MagickImage_Roll = e30.Yi, t3._MagickImage_Rotate = e30.Zi, t3._MagickImage_RotationalBlur = e30._i, t3._MagickImage_Sample = e30.$i, t3._MagickImage_Scale = e30.aj, t3._MagickImage_Segment = e30.bj, t3._MagickImage_SelectiveBlur = e30.cj, t3._MagickImage_Separate = e30.dj, t3._MagickImage_SepiaTone = e30.ej, t3._MagickImage_SetAlpha = e30.fj, t3._MagickImage_SetArtifact = e30.gj, t3._MagickImage_SetAttribute = e30.hj, t3._MagickImage_SetBitDepth = e30.ij, t3._MagickImage_SetClientData = e30.jj, t3._MagickImage_SetColormapColor = e30.kj, t3._MagickImage_SetColorMetric = e30.lj, t3._MagickImage_SetNext = e30.mj, t3._MagickImage_SetProfile = e30.nj, t3._MagickImage_SetProgressDelegate = e30.oj, t3._MagickImage_SetReadMask = e30.pj, t3._MagickImage_SetWriteMask = e30.qj, t3._MagickImage_Shade = e30.rj, t3._MagickImage_Shadow = e30.sj, t3._MagickImage_Sharpen = e30.tj, t3._MagickImage_Shave = e30.uj, t3._MagickImage_Shear = e30.vj, t3._MagickImage_SigmoidalContrast = e30.wj, t3._MagickImage_SparseColor = e30.xj, t3._MagickImage_Spread = e30.yj, t3._MagickImage_Sketch = e30.zj, t3._MagickImage_Solarize = e30.Aj, t3._MagickImage_SortPixels = e30.Bj, t3._MagickImage_Splice = e30.Cj, t3._MagickImage_Statistic = e30.Dj, t3._MagickImage_Statistics = e30.Ej, t3._MagickImage_Stegano = e30.Fj, t3._MagickImage_Stereo = e30.Gj, t3._MagickImage_Strip = e30.Hj, t3._MagickImage_SubImageSearch = e30.Ij, t3._MagickImage_Swirl = e30.Jj, t3._MagickImage_Texture = e30.Kj, t3._MagickImage_Threshold = e30.Lj, t3._MagickImage_Thumbnail = e30.Mj, t3._MagickImage_Tint = e30.Nj, t3._MagickImage_Transparent = e30.Oj, t3._MagickImage_TransparentChroma = e30.Pj, t3._MagickImage_Transpose = e30.Qj, t3._MagickImage_Transverse = e30.Rj, t3._MagickImage_Trim = e30.Sj, t3._MagickImage_UniqueColors = e30.Tj, t3._MagickImage_UnsharpMask = e30.Uj, t3._MagickImage_Vignette = e30.Vj, t3._MagickImage_Wave = e30.Wj, t3._MagickImage_WaveletDenoise = e30.Xj, t3._MagickImage_WhiteBalance = e30.Yj, t3._MagickImage_WhiteThreshold = e30.Zj, t3._MagickImage_WriteBlob = e30._j, t3._MagickImage_WriteFile = e30.$j, t3._MagickImage_WriteStream = e30.ak, t3._MagickImageCollection_Append = e30.bk, t3._MagickImageCollection_Coalesce = e30.ck, t3._MagickImageCollection_Combine = e30.dk, t3._MagickImageCollection_Complex = e30.ek, t3._MagickImageCollection_Deconstruct = e30.fk, t3._MagickImageCollection_Dispose = e30.gk, t3._MagickImageCollection_Evaluate = e30.hk, t3._MagickImageCollection_Fx = e30.ik, t3._MagickImageCollection_Merge = e30.jk, t3._MagickImageCollection_Montage = e30.kk, t3._MagickImageCollection_Morph = e30.lk, t3._MagickImageCollection_Optimize = e30.mk, t3._MagickImageCollection_OptimizePlus = e30.nk, t3._MagickImageCollection_OptimizeTransparency = e30.ok, t3._MagickImageCollection_Polynomial = e30.pk, t3._MagickImageCollection_Quantize = e30.qk, t3._MagickImageCollection_ReadBlob = e30.rk, t3._MagickImageCollection_ReadFile = e30.sk, t3._MagickImageCollection_ReadStream = e30.tk, t3._MagickImageCollection_Remap = e30.uk, t3._MagickImageCollection_Smush = e30.vk, t3._MagickImageCollection_WriteFile = e30.wk, t3._MagickImageCollection_WriteStream = e30.xk, t3._DoubleMatrix_Create = e30.yk, t3._DoubleMatrix_Dispose = e30.zk, t3._OpenCL_GetDevices = e30.Ak, t3._OpenCL_GetDevice = e30.Bk, t3._OpenCL_GetEnabled = e30.Ck, t3._OpenCL_SetEnabled = e30.Dk, t3._OpenCLDevice_DeviceType_Get = e30.Ek, t3._OpenCLDevice_BenchmarkScore_Get = e30.Fk, t3._OpenCLDevice_IsEnabled_Get = e30.Gk, t3._OpenCLDevice_IsEnabled_Set = e30.Hk, t3._OpenCLDevice_Name_Get = e30.Ik, t3._OpenCLDevice_Version_Get = e30.Jk, t3._OpenCLDevice_GetKernelProfileRecords = e30.Kk, t3._OpenCLDevice_GetKernelProfileRecord = e30.Lk, t3._OpenCLDevice_SetProfileKernels = e30.Mk, t3._OpenCLKernelProfileRecord_Count_Get = e30.Nk, t3._OpenCLKernelProfileRecord_Name_Get = e30.Ok, t3._OpenCLKernelProfileRecord_MaximumDuration_Get = e30.Pk, t3._OpenCLKernelProfileRecord_MinimumDuration_Get = e30.Qk, t3._OpenCLKernelProfileRecord_TotalDuration_Get = e30.Rk, t3._JpegOptimizer_CompressFile = e30.Sk, t3._JpegOptimizer_CompressStream = e30.Tk, bi = t3._malloc = e30.Uk, Q = t3._free = e30.Vk, t3._PixelCollection_Create = e30.Wk, t3._PixelCollection_Dispose = e30.Xk, t3._PixelCollection_GetArea = e30.Yk, t3._PixelCollection_GetReadOnlyArea = e30.Zk, t3._PixelCollection_SetArea = e30._k, t3._PixelCollection_ToByteArray = e30.$k, t3._PixelCollection_ToShortArray = e30.al, t3._Quantum_Depth_Get = e30.bl, t3._Quantum_Max_Get = e30.cl, t3._ResourceLimits_Area_Get = e30.dl, t3._ResourceLimits_Area_Set = e30.el, t3._ResourceLimits_Disk_Get = e30.fl, t3._ResourceLimits_Disk_Set = e30.gl, t3._ResourceLimits_Height_Get = e30.hl, t3._ResourceLimits_Height_Set = e30.il, t3._ResourceLimits_ListLength_Get = e30.jl, t3._ResourceLimits_ListLength_Set = e30.kl, t3._ResourceLimits_MaxMemoryRequest_Get = e30.ll, t3._ResourceLimits_MaxMemoryRequest_Set = e30.ml, t3._ResourceLimits_MaxProfileSize_Get = e30.nl, t3._ResourceLimits_MaxProfileSize_Set = e30.ol, t3._ResourceLimits_Memory_Get = e30.pl, t3._ResourceLimits_Memory_Set = e30.ql, t3._ResourceLimits_Thread_Get = e30.rl, t3._ResourceLimits_Thread_Set = e30.sl, t3._ResourceLimits_Throttle_Get = e30.tl, t3._ResourceLimits_Throttle_Set = e30.ul, t3._ResourceLimits_Time_Get = e30.vl, t3._ResourceLimits_Time_Set = e30.wl, t3._ResourceLimits_Width_Get = e30.xl, t3._ResourceLimits_Width_Set = e30.yl, t3._ResourceLimits_LimitMemory = e30.zl, t3._ResourceLimits_TrimMemory = e30.Al, t3._DrawingSettings_Create = e30.Bl, t3._DrawingSettings_Dispose = e30.Cl, t3._DrawingSettings_BorderColor_Get = e30.Dl, t3._DrawingSettings_BorderColor_Set = e30.El, t3._DrawingSettings_FillColor_Get = e30.Fl, t3._DrawingSettings_FillColor_Set = e30.Gl, t3._DrawingSettings_FillRule_Get = e30.Hl, t3._DrawingSettings_FillRule_Set = e30.Il, t3._DrawingSettings_Font_Get = e30.Jl, t3._DrawingSettings_Font_Set = e30.Kl, t3._DrawingSettings_FontFamily_Get = e30.Ll, t3._DrawingSettings_FontFamily_Set = e30.Ml, t3._DrawingSettings_FontPointsize_Get = e30.Nl, t3._DrawingSettings_FontPointsize_Set = e30.Ol, t3._DrawingSettings_FontStyle_Get = e30.Pl, t3._DrawingSettings_FontStyle_Set = e30.Ql, t3._DrawingSettings_FontWeight_Get = e30.Rl, t3._DrawingSettings_FontWeight_Set = e30.Sl, t3._DrawingSettings_StrokeAntiAlias_Get = e30.Tl, t3._DrawingSettings_StrokeAntiAlias_Set = e30.Ul, t3._DrawingSettings_StrokeColor_Get = e30.Vl, t3._DrawingSettings_StrokeColor_Set = e30.Wl, t3._DrawingSettings_StrokeDashOffset_Get = e30.Xl, t3._DrawingSettings_StrokeDashOffset_Set = e30.Yl, t3._DrawingSettings_StrokeLineCap_Get = e30.Zl, t3._DrawingSettings_StrokeLineCap_Set = e30._l, t3._DrawingSettings_StrokeLineJoin_Get = e30.$l, t3._DrawingSettings_StrokeLineJoin_Set = e30.am, t3._DrawingSettings_StrokeMiterLimit_Get = e30.bm, t3._DrawingSettings_StrokeMiterLimit_Set = e30.cm, t3._DrawingSettings_StrokeWidth_Get = e30.dm, t3._DrawingSettings_StrokeWidth_Set = e30.em, t3._DrawingSettings_TextAntiAlias_Get = e30.fm, t3._DrawingSettings_TextAntiAlias_Set = e30.gm, t3._DrawingSettings_TextDirection_Get = e30.hm, t3._DrawingSettings_TextDirection_Set = e30.im, t3._DrawingSettings_TextEncoding_Get = e30.jm, t3._DrawingSettings_TextEncoding_Set = e30.km, t3._DrawingSettings_TextGravity_Get = e30.lm, t3._DrawingSettings_TextGravity_Set = e30.mm, t3._DrawingSettings_TextInterlineSpacing_Get = e30.nm, t3._DrawingSettings_TextInterlineSpacing_Set = e30.om, t3._DrawingSettings_TextInterwordSpacing_Get = e30.pm, t3._DrawingSettings_TextInterwordSpacing_Set = e30.qm, t3._DrawingSettings_TextKerning_Get = e30.rm, t3._DrawingSettings_TextKerning_Set = e30.sm, t3._DrawingSettings_TextUnderColor_Get = e30.tm, t3._DrawingSettings_TextUnderColor_Set = e30.um, t3._DrawingSettings_SetAffine = e30.vm, t3._DrawingSettings_SetFillPattern = e30.wm, t3._DrawingSettings_SetStrokeDashArray = e30.xm, t3._DrawingSettings_SetStrokePattern = e30.ym, t3._DrawingSettings_SetText = e30.zm, t3._MagickSettings_Create = e30.Am, t3._MagickSettings_Dispose = e30.Bm, t3._MagickSettings_AntiAlias_Get = e30.Cm, t3._MagickSettings_AntiAlias_Set = e30.Dm, t3._MagickSettings_BackgroundColor_Get = e30.Em, t3._MagickSettings_BackgroundColor_Set = e30.Fm, t3._MagickSettings_ColorSpace_Get = e30.Gm, t3._MagickSettings_ColorSpace_Set = e30.Hm, t3._MagickSettings_ColorType_Get = e30.Im, t3._MagickSettings_ColorType_Set = e30.Jm, t3._MagickSettings_Compression_Get = e30.Km, t3._MagickSettings_Compression_Set = e30.Lm, t3._MagickSettings_Debug_Get = e30.Mm, t3._MagickSettings_Debug_Set = e30.Nm, t3._MagickSettings_Density_Get = e30.Om, t3._MagickSettings_Density_Set = e30.Pm, t3._MagickSettings_Depth_Get = e30.Qm, t3._MagickSettings_Depth_Set = e30.Rm, t3._MagickSettings_Endian_Get = e30.Sm, t3._MagickSettings_Endian_Set = e30.Tm, t3._MagickSettings_Extract_Get = e30.Um, t3._MagickSettings_Extract_Set = e30.Vm, t3._MagickSettings_Format_Get = e30.Wm, t3._MagickSettings_Format_Set = e30.Xm, t3._MagickSettings_FontPointsize_Get = e30.Ym, t3._MagickSettings_FontPointsize_Set = e30.Zm, t3._MagickSettings_Interlace_Get = e30._m, t3._MagickSettings_Interlace_Set = e30.$m, t3._MagickSettings_Monochrome_Get = e30.an, t3._MagickSettings_Monochrome_Set = e30.bn, t3._MagickSettings_Verbose_Get = e30.cn, t3._MagickSettings_Verbose_Set = e30.dn, t3._MagickSettings_SetColorFuzz = e30.en, t3._MagickSettings_SetFileName = e30.fn, t3._MagickSettings_SetFont = e30.gn, t3._MagickSettings_SetNumberScenes = e30.hn, t3._MagickSettings_SetOption = e30.jn, t3._MagickSettings_SetPage = e30.kn, t3._MagickSettings_SetPing = e30.ln, t3._MagickSettings_SetQuality = e30.mn, t3._MagickSettings_SetScenes = e30.nn, t3._MagickSettings_SetScene = e30.on, t3._MagickSettings_SetSize = e30.pn, t3._MontageSettings_Create = e30.qn, t3._MontageSettings_Dispose = e30.rn, t3._MontageSettings_SetBackgroundColor = e30.sn, t3._MontageSettings_SetBorderColor = e30.tn, t3._MontageSettings_SetBorderWidth = e30.un, t3._MontageSettings_SetFillColor = e30.vn, t3._MontageSettings_SetFont = e30.wn, t3._MontageSettings_SetFontPointsize = e30.xn, t3._MontageSettings_SetFrameGeometry = e30.yn, t3._MontageSettings_SetGeometry = e30.zn, t3._MontageSettings_SetGravity = e30.An, t3._MontageSettings_SetShadow = e30.Bn, t3._MontageSettings_SetStrokeColor = e30.Cn, t3._MontageSettings_SetTextureFileName = e30.Dn, t3._MontageSettings_SetTileGeometry = e30.En, t3._MontageSettings_SetTitle = e30.Fn, t3._QuantizeSettings_SetColors = e30.Gn, t3._QuantizeSettings_SetColorSpace = e30.Hn, t3._QuantizeSettings_SetDitherMethod = e30.In, t3._QuantizeSettings_SetMeasureErrors = e30.Jn, t3._QuantizeSettings_SetTreeDepth = e30.Kn, t3._ChannelMoments_Centroid_Get = e30.Ln, t3._ChannelMoments_EllipseAngle_Get = e30.Mn, t3._ChannelMoments_EllipseAxis_Get = e30.Nn, t3._ChannelMoments_EllipseEccentricity_Get = e30.On, t3._ChannelMoments_EllipseIntensity_Get = e30.Pn, t3._ChannelMoments_GetHuInvariants = e30.Qn, t3._ChannelPerceptualHash_GetHuPhash = e30.Rn, t3._ChannelStatistics_Depth_Get = e30.Sn, t3._ChannelStatistics_Entropy_Get = e30.Tn, t3._ChannelStatistics_Kurtosis_Get = e30.Un, t3._ChannelStatistics_Maximum_Get = e30.Vn, t3._ChannelStatistics_Mean_Get = e30.Wn, t3._ChannelStatistics_Minimum_Get = e30.Xn, t3._ChannelStatistics_Skewness_Get = e30.Yn, t3._ChannelStatistics_StandardDeviation_Get = e30.Zn, t3._Moments_DisposeList = e30._n, t3._Moments_GetInstance = e30.$n, t3._PerceptualHash_DisposeList = e30.ao, t3._PerceptualHash_GetInstance = e30.bo, t3._Statistics_DisposeList = e30.co, t3._Statistics_GetInstance = e30.eo, t3._ConnectedComponent_DisposeList = e30.fo, t3._ConnectedComponent_GetArea = e30.go, t3._ConnectedComponent_GetCentroid = e30.ho, t3._ConnectedComponent_GetColor = e30.io, t3._ConnectedComponent_GetHeight = e30.jo, t3._ConnectedComponent_GetId = e30.ko, t3._ConnectedComponent_GetWidth = e30.lo, t3._ConnectedComponent_GetX = e30.mo, t3._ConnectedComponent_GetY = e30.no, t3._ConnectedComponent_GetInstance = e30.oo, t3._MagickGeometry_Create = e30.po, t3._MagickGeometry_Dispose = e30.qo, t3._MagickGeometry_X_Get = e30.ro, t3._MagickGeometry_Y_Get = e30.so, t3._MagickGeometry_Width_Get = e30.to, t3._MagickGeometry_Height_Get = e30.uo, t3._MagickGeometry_Initialize = e30.vo, t3._MagickRectangle_Dispose = e30.wo, t3._MagickRectangle_X_Get = e30.xo, t3._MagickRectangle_X_Set = e30.yo, t3._MagickRectangle_Y_Get = e30.zo, t3._MagickRectangle_Y_Set = e30.Ao, t3._MagickRectangle_Width_Get = e30.Bo, t3._MagickRectangle_Width_Set = e30.Co, t3._MagickRectangle_Height_Get = e30.Do, t3._MagickRectangle_Height_Set = e30.Eo, t3._MagickRectangle_FromPageSize = e30.Fo, t3._OffsetInfo_Create = e30.Go, t3._OffsetInfo_Dispose = e30.Ho, t3._OffsetInfo_SetX = e30.Io, t3._OffsetInfo_SetY = e30.Jo, t3._PointInfo_X_Get = e30.Ko, t3._PointInfo_Y_Get = e30.Lo, t3._PointInfoCollection_Create = e30.Mo, t3._PointInfoCollection_Dispose = e30.No, t3._PointInfoCollection_GetX = e30.Oo, t3._PointInfoCollection_GetY = e30.Po, t3._PointInfoCollection_Set = e30.Qo, t3._PrimaryInfo_Dispose = e30.Ro, t3._PrimaryInfo_X_Get = e30.So, t3._PrimaryInfo_X_Set = e30.To, t3._PrimaryInfo_Y_Get = e30.Uo, t3._PrimaryInfo_Y_Set = e30.Vo, t3._PrimaryInfo_Z_Get = e30.Wo, t3._PrimaryInfo_Z_Set = e30.Xo, t3._StringInfo_Length_Get = e30.Yo, t3._StringInfo_Datum_Get = e30.Zo, t3._TypeMetric_Dispose = e30._o, t3._TypeMetric_Ascent_Get = e30.$o, t3._TypeMetric_Descent_Get = e30.ap, t3._TypeMetric_MaxHorizontalAdvance_Get = e30.bp, t3._TypeMetric_TextHeight_Get = e30.cp, t3._TypeMetric_TextWidth_Get = e30.dp, t3._TypeMetric_UnderlinePosition_Get = e30.ep, t3._TypeMetric_UnderlineThickness_Get = e30.fp, xi = e30.gp, $ = e30.hp, Si = e30.ip, Ci = e30.jp, wi = e30.kp, Ti = e30.lp, Ei = e30.mp, Di = e30.np, Oi = e30.op, ki = e30.Zb, Ai = e30.sc;
  }
  var Mi = {
    wb: E2,
    z: ge2,
    E: _e2,
    e: k2,
    k: xe2,
    La: Se2,
    va: Ce2,
    a: we2,
    mb: Te2,
    i: Ee2,
    Rb: tt2,
    Pb: nt2,
    Sb: rt2,
    zb: H2,
    Ob: it2,
    ua: st,
    Nb: ct,
    Ib: ut,
    vb: dt,
    Vb: ft,
    Kb: pt,
    Lb: mt,
    sa: ht,
    ub: gt,
    sb: _t,
    tb: vt,
    Mb: yt,
    rb: bt,
    Ha: xt,
    Tb: St,
    $a: W,
    aa: Ft,
    Ya: It,
    na: Cn,
    Wa: On,
    O: jn,
    h: Nn,
    xa: Ln,
    w: Wn,
    V: Gn,
    D: Kn,
    Xa: qn,
    ka: tr,
    ab: nr,
    ma: rr,
    Za: ir,
    xb: ar,
    pb: or,
    nb: sr,
    H: mr,
    C: En,
    _a: hr,
    G: gr,
    la: _r,
    Q: vr,
    ba: yr,
    F: br,
    N: xr,
    Cb: Sr,
    Db: Dr,
    Eb: Or,
    Ab: kr,
    Bb: Ar,
    Fb: jr,
    Qb: Ir,
    Ja: Nr,
    qb: Rr,
    ra: Mr,
    ob: Br,
    Wb: Wr,
    Xb: Gr,
    X: Jr,
    _: Yr,
    Ia: Xr,
    yb: Qr,
    Ka: $r,
    Gb: ei,
    Jb: ti,
    ta: ri,
    ib: aa,
    Ea: Ya,
    Fa: Ja,
    hb: sa,
    Ca: na,
    b: Qi,
    c: Ri,
    p: Fi,
    ja: Na,
    Ua: ka,
    J: $i,
    g: Ii,
    v: Wi,
    Ra: Fa,
    qa: Ki,
    ga: Qa,
    t: ea,
    n: Xi,
    y: Ji,
    fb: pa,
    gb: fa,
    Qa: La,
    A: Zi,
    M: da,
    Sa: Pa,
    d: Li,
    Yb: Wa,
    W: Pi,
    j: Gi,
    jb: qi,
    r: oa,
    kb: Ka,
    lb: Ga,
    S: ia,
    K: Sa,
    q: ta,
    T: Za,
    B: Yi,
    Ga: qa,
    Aa: la,
    o: Ma,
    fa: eo,
    Ba: ra,
    oa: Ea,
    Da: $a,
    l: zi,
    s: Ui,
    L: Hi,
    Y: Oa,
    ia: Ia,
    x: Ni,
    I: Vi,
    da: ca,
    ha: Ua,
    m: ja,
    f: Bi,
    za: ma,
    ya: ha,
    P: ba,
    ca: ya,
    eb: ga,
    Ma: Ha,
    db: Ca,
    Ta: Aa,
    u: ua,
    Z: _a,
    $: Ra,
    pa: va,
    cb: wa,
    Oa: Ba,
    ea: to,
    Na: Va,
    R: xa,
    Pa: za,
    bb: Ta,
    Va: Da,
    U: Xa,
    wa: ii,
    Ub: qr,
    Hb: ai
  };
  function Ni(e30, t4, n3, r3) {
    var i2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3);
    } catch (e31) {
      if (x2(i2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Pi(e30, t4, n3, r3) {
    var i2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3);
    } catch (e31) {
      if (x2(i2), !(e31 instanceof g2)) throw e31;
      return $(1, 0), 0n;
    }
  }
  function Fi(e30, t4, n3) {
    var r3 = S2();
    try {
      return T2(Number(e30))(t4, n3);
    } catch (e31) {
      if (x2(r3), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Ii(e30, t4, n3) {
    var r3 = S2();
    try {
      return T2(Number(e30))(t4, n3);
    } catch (e31) {
      if (x2(r3), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Li(e30, t4) {
    var n3 = S2();
    try {
      return T2(Number(e30))(t4);
    } catch (e31) {
      if (x2(n3), !(e31 instanceof g2)) throw e31;
      return $(1, 0), 0n;
    }
  }
  function Ri(e30, t4) {
    var n3 = S2();
    try {
      return T2(Number(e30))(t4);
    } catch (e31) {
      if (x2(n3), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function zi(e30, t4) {
    var n3 = S2();
    try {
      T2(Number(e30))(t4);
    } catch (e31) {
      if (x2(n3), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Bi(e30, t4, n3) {
    var r3 = S2();
    try {
      T2(Number(e30))(t4, n3);
    } catch (e31) {
      if (x2(r3), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Vi(e30, t4, n3, r3, i2) {
    var a2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2);
    } catch (e31) {
      if (x2(a2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Hi(e30, t4, n3, r3) {
    var i2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3);
    } catch (e31) {
      if (x2(i2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Ui(e30, t4, n3) {
    var r3 = S2();
    try {
      T2(Number(e30))(t4, n3);
    } catch (e31) {
      if (x2(r3), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Wi(e30, t4, n3, r3) {
    var i2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3);
    } catch (e31) {
      if (x2(i2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Gi(e30, t4, n3) {
    var r3 = S2();
    try {
      return T2(Number(e30))(t4, n3);
    } catch (e31) {
      if (x2(r3), !(e31 instanceof g2)) throw e31;
      return $(1, 0), 0n;
    }
  }
  function Ki(e30, t4, n3, r3, i2) {
    var a2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3, i2);
    } catch (e31) {
      if (x2(a2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function qi(e30, t4, n3, r3) {
    var i2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3);
    } catch (e31) {
      if (x2(i2), !(e31 instanceof g2)) throw e31;
      return $(1, 0), 0n;
    }
  }
  function Ji(e30, t4, n3, r3, i2, a2, o2, s2, c2) {
    var l2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3, i2, a2, o2, s2, c2);
    } catch (e31) {
      if (x2(l2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Yi(e30, t4, n3, r3, i2, a2, o2) {
    var s2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3, i2, a2, o2);
    } catch (e31) {
      if (x2(s2), !(e31 instanceof g2)) throw e31;
      return $(1, 0), 0n;
    }
  }
  function Xi(e30, t4, n3, r3, i2) {
    var a2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3, i2);
    } catch (e31) {
      if (x2(a2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Zi(e30) {
    var t4 = S2();
    try {
      return T2(Number(e30))();
    } catch (e31) {
      if (x2(t4), !(e31 instanceof g2)) throw e31;
      return $(1, 0), 0n;
    }
  }
  function Qi(e30, t4, n3, r3, i2, a2, o2) {
    var s2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3, i2, a2, o2);
    } catch (e31) {
      if (x2(s2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function $i(e30, t4, n3, r3) {
    var i2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3);
    } catch (e31) {
      if (x2(i2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function ea(e30, t4, n3, r3) {
    var i2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3);
    } catch (e31) {
      if (x2(i2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function ta(e30, t4, n3, r3, i2) {
    var a2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3, i2);
    } catch (e31) {
      if (x2(a2), !(e31 instanceof g2)) throw e31;
      return $(1, 0), 0n;
    }
  }
  function na(e30, t4, n3) {
    var r3 = S2();
    try {
      return T2(Number(e30))(t4, n3);
    } catch (e31) {
      if (x2(r3), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function ra(e30, t4, n3) {
    var r3 = S2();
    try {
      T2(Number(e30))(t4, n3);
    } catch (e31) {
      if (x2(r3), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function ia(e30, t4, n3, r3, i2, a2) {
    var o2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3, i2, a2);
    } catch (e31) {
      if (x2(o2), !(e31 instanceof g2)) throw e31;
      return $(1, 0), 0n;
    }
  }
  function aa(e30, t4, n3) {
    var r3 = S2();
    try {
      return T2(Number(e30))(t4, n3);
    } catch (e31) {
      if (x2(r3), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function oa(e30, t4, n3, r3) {
    var i2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3);
    } catch (e31) {
      if (x2(i2), !(e31 instanceof g2)) throw e31;
      return $(1, 0), 0n;
    }
  }
  function sa(e30, t4) {
    var n3 = S2();
    try {
      return T2(Number(e30))(t4);
    } catch (e31) {
      if (x2(n3), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function ca(e30, t4, n3, r3, i2, a2) {
    var o2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2, a2);
    } catch (e31) {
      if (x2(o2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function la(e30, t4, n3, r3, i2, a2, o2, s2) {
    var c2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3, i2, a2, o2, s2);
    } catch (e31) {
      if (x2(c2), !(e31 instanceof g2)) throw e31;
      return $(1, 0), 0n;
    }
  }
  function ua(e30, t4, n3, r3) {
    var i2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3);
    } catch (e31) {
      if (x2(i2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function da(e30, t4) {
    var n3 = S2();
    try {
      return T2(Number(e30))(t4);
    } catch (e31) {
      if (x2(n3), !(e31 instanceof g2)) throw e31;
      return $(1, 0), 0n;
    }
  }
  function fa(e30, t4, n3, r3, i2, a2, o2, s2, c2, l2) {
    var u2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3, i2, a2, o2, s2, c2, l2);
    } catch (e31) {
      if (x2(u2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function pa(e30, t4, n3, r3, i2, a2) {
    var o2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3, i2, a2);
    } catch (e31) {
      if (x2(o2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function ma(e30, t4, n3, r3) {
    var i2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3);
    } catch (e31) {
      if (x2(i2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function ha(e30, t4, n3, r3, i2, a2, o2, s2, c2, l2, u2) {
    var d2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2, a2, o2, s2, c2, l2, u2);
    } catch (e31) {
      if (x2(d2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function ga(e30, t4, n3, r3, i2, a2) {
    var o2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2, a2);
    } catch (e31) {
      if (x2(o2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function _a(e30, t4, n3, r3, i2) {
    var a2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2);
    } catch (e31) {
      if (x2(a2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function va(e30, t4, n3, r3, i2, a2) {
    var o2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2, a2);
    } catch (e31) {
      if (x2(o2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function ya(e30, t4, n3, r3, i2) {
    var a2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2);
    } catch (e31) {
      if (x2(a2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function ba(e30, t4, n3, r3) {
    var i2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3);
    } catch (e31) {
      if (x2(i2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function xa(e30, t4, n3, r3, i2) {
    var a2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2);
    } catch (e31) {
      if (x2(a2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Sa(e30, t4, n3, r3, i2, a2, o2) {
    var s2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3, i2, a2, o2);
    } catch (e31) {
      if (x2(s2), !(e31 instanceof g2)) throw e31;
      return $(1, 0), 0n;
    }
  }
  function Ca(e30, t4, n3, r3, i2, a2, o2, s2, c2, l2) {
    var u2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2, a2, o2, s2, c2, l2);
    } catch (e31) {
      if (x2(u2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function wa(e30, t4, n3, r3, i2, a2, o2) {
    var s2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2, a2, o2);
    } catch (e31) {
      if (x2(s2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Ta(e30, t4, n3, r3, i2, a2) {
    var o2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2, a2);
    } catch (e31) {
      if (x2(o2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Ea(e30, t4, n3, r3) {
    var i2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3);
    } catch (e31) {
      if (x2(i2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Da(e30, t4, n3, r3, i2, a2, o2, s2, c2, l2) {
    var u2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2, a2, o2, s2, c2, l2);
    } catch (e31) {
      if (x2(u2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Oa(e30, t4, n3, r3, i2) {
    var a2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2);
    } catch (e31) {
      if (x2(a2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function ka(e30, t4, n3, r3, i2) {
    var a2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3, i2);
    } catch (e31) {
      if (x2(a2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Aa(e30, t4, n3, r3, i2, a2, o2, s2) {
    var c2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2, a2, o2, s2);
    } catch (e31) {
      if (x2(c2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function ja(e30, t4, n3, r3, i2) {
    var a2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2);
    } catch (e31) {
      if (x2(a2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Ma(e30) {
    var t4 = S2();
    try {
      T2(Number(e30))();
    } catch (e31) {
      if (x2(t4), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Na(e30, t4, n3, r3, i2) {
    var a2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3, i2);
    } catch (e31) {
      if (x2(a2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Pa(e30, t4, n3, r3, i2, a2, o2, s2, c2, l2, u2, d2) {
    var f2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3, i2, a2, o2, s2, c2, l2, u2, d2);
    } catch (e31) {
      if (x2(f2), !(e31 instanceof g2)) throw e31;
      return $(1, 0), 0n;
    }
  }
  function Fa(e30, t4, n3, r3, i2, a2, o2, s2) {
    var c2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3, i2, a2, o2, s2);
    } catch (e31) {
      if (x2(c2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Ia(e30, t4, n3, r3, i2, a2) {
    var o2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2, a2);
    } catch (e31) {
      if (x2(o2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function La(e30, t4, n3, r3, i2, a2, o2, s2, c2, l2, u2) {
    var d2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3, i2, a2, o2, s2, c2, l2, u2);
    } catch (e31) {
      if (x2(d2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Ra(e30, t4, n3, r3, i2, a2) {
    var o2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2, a2);
    } catch (e31) {
      if (x2(o2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function za(e30, t4, n3, r3, i2, a2, o2, s2) {
    var c2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2, a2, o2, s2);
    } catch (e31) {
      if (x2(c2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Ba(e30, t4, n3, r3, i2, a2, o2, s2, c2) {
    var l2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2, a2, o2, s2, c2);
    } catch (e31) {
      if (x2(l2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Va(e30, t4, n3, r3, i2, a2, o2, s2, c2, l2, u2, d2) {
    var f2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2, a2, o2, s2, c2, l2, u2, d2);
    } catch (e31) {
      if (x2(f2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Ha(e30, t4, n3, r3, i2, a2, o2) {
    var s2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2, a2, o2);
    } catch (e31) {
      if (x2(s2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Ua(e30, t4, n3, r3, i2, a2, o2) {
    var s2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2, a2, o2);
    } catch (e31) {
      if (x2(s2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Wa(e30, t4, n3, r3, i2) {
    var a2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3, i2);
    } catch (e31) {
      if (x2(a2), !(e31 instanceof g2)) throw e31;
      return $(1, 0), 0n;
    }
  }
  function Ga(e30, t4, n3, r3, i2, a2) {
    var o2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3, i2, a2);
    } catch (e31) {
      if (x2(o2), !(e31 instanceof g2)) throw e31;
      return $(1, 0), 0n;
    }
  }
  function Ka(e30, t4, n3, r3, i2, a2) {
    var o2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3, i2, a2);
    } catch (e31) {
      if (x2(o2), !(e31 instanceof g2)) throw e31;
      return $(1, 0), 0n;
    }
  }
  function qa(e30, t4, n3, r3, i2, a2, o2, s2) {
    var c2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3, i2, a2, o2, s2);
    } catch (e31) {
      if (x2(c2), !(e31 instanceof g2)) throw e31;
      return $(1, 0), 0n;
    }
  }
  function Ja(e30, t4, n3, r3) {
    var i2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3);
    } catch (e31) {
      if (x2(i2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Ya(e30, t4, n3, r3) {
    var i2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3);
    } catch (e31) {
      if (x2(i2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Xa(e30, t4, n3, r3, i2, a2, o2, s2) {
    var c2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2, a2, o2, s2);
    } catch (e31) {
      if (x2(c2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function Za(e30, t4, n3, r3, i2, a2, o2) {
    var s2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3, i2, a2, o2);
    } catch (e31) {
      if (x2(s2), !(e31 instanceof g2)) throw e31;
      return $(1, 0), 0n;
    }
  }
  function Qa(e30, t4, n3, r3, i2, a2, o2, s2, c2, l2, u2, d2) {
    var f2 = S2();
    try {
      return T2(Number(e30))(t4, n3, r3, i2, a2, o2, s2, c2, l2, u2, d2);
    } catch (e31) {
      if (x2(f2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function $a(e30, t4, n3, r3, i2, a2, o2, s2, c2, l2, u2) {
    var d2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2, a2, o2, s2, c2, l2, u2);
    } catch (e31) {
      if (x2(d2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function eo(e30, t4, n3, r3, i2, a2, o2, s2, c2, l2, u2) {
    var d2 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2, a2, o2, s2, c2, l2, u2);
    } catch (e31) {
      if (x2(d2), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function to(e30, t4, n3, r3, i2, a2, o2, s2, c2, l2, u2, d2, f2, p3, m3, h3) {
    var ee3 = S2();
    try {
      T2(Number(e30))(t4, n3, r3, i2, a2, o2, s2, c2, l2, u2, d2, f2, p3, m3, h3);
    } catch (e31) {
      if (x2(ee3), !(e31 instanceof g2)) throw e31;
      $(1, 0);
    }
  }
  function no(e30) {
    e30 = Object.assign({}, e30);
    var t4 = (e31) => (t5) => Number(e31(BigInt(t5))), n3 = (e31) => (t5) => e31(BigInt(t5));
    return e30.$b = t4(e30.$b), e30.Uk = t4(e30.Uk), e30.Vk = n3(e30.Vk), e30.gp = /* @__PURE__ */ ((e31) => (t5, n4) => Number(e31(BigInt(t5), BigInt(n4))))(e30.gp), e30.hp = /* @__PURE__ */ ((e31) => (t5, n4) => e31(BigInt(t5), n4))(e30.hp), e30.jp = n3(e30.jp), e30._emscripten_stack_alloc = t4(e30._emscripten_stack_alloc), e30.kp = /* @__PURE__ */ ((e31) => () => Number(e31()))(e30.kp), e30.lp = n3(e30.lp), e30.mp = n3(e30.mp), e30.np = /* @__PURE__ */ ((e31) => (t5, n4, r3) => e31(BigInt(t5), BigInt(n4), BigInt(r3)))(e30.np), e30.op = t4(e30.op), e30;
  }
  async function ro() {
    Ke2 && await Ge2(), !m2 && re2();
  }
  var io = await y2();
  return await ro(), t3;
}
var et = class {
  constructor(e29) {
    if (e29 instanceof URL) {
      if (e29.protocol !== "http:" && e29.protocol !== "https:") throw new y("Only http/https protocol is supported");
      this.locateFile = () => e29.href;
    } else e29 instanceof WebAssembly.Module ? this.instantiateWasm = (t3, n2) => {
      n2(new WebAssembly.Instance(e29, t3));
    } : this.wasmBinary = e29;
  }
  wasmBinary;
  instantiateWasm;
  locateFile;
};
var R = class {
  api;
  constructor() {
  }
  async _initialize(e29, t3, n2) {
    if (this.api !== void 0) return;
    let r2 = await e29(new et(t3));
    this.writeConfigurationFiles(r2, n2), fe(r2, "MAGICK_CONFIGURE_PATH", (e30) => {
      fe(r2, "/xml", (t4) => {
        r2._Environment_SetEnv(e30, t4), r2._Environment_Initialize(), this.api = r2;
      });
    });
  }
  static get _api() {
    if (!z.api) throw new y("`await initializeImageMagick` should be called to initialize the library");
    return z.api;
  }
  static set _api(e29) {
    z.api = e29;
  }
  static read(t3, n2, r2, i) {
    return Qe._create((a) => {
      let o = i;
      if (typeof t3 != "string" && !e(t3)) typeof n2 == "number" && typeof r2 == "number" && a.read(t3, n2, r2);
      else if (typeof n2 != "number" && typeof r2 != "number") {
        o = r2;
        let e29;
        n2 instanceof N ? e29 = n2 : typeof n2 == "string" ? (e29 = new N(), e29.format = n2) : o = n2, a.read(t3, e29);
      }
      return o(a);
    });
  }
  static readCollection(e29, t3, n2) {
    return F.use((r2) => {
      let i = n2, a;
      return t3 instanceof N ? a = t3 : typeof t3 == "string" ? (a = new N(), a.format = t3) : i = t3, r2.read(e29, a), i(r2);
    });
  }
  static readFromCanvas(e29, t3, n2) {
    return Qe._create((r2) => (r2.readFromCanvas(e29, n2), t3(r2)));
  }
  writeConfigurationFiles(e29, t3) {
    e29.FS.analyzePath("/xml").exists || e29.FS.mkdir("/xml");
    for (let n2 of t3.all()) {
      let t4 = e29.FS.open(`/xml/${n2.fileName}`, "w"), r2 = new TextEncoder().encode(n2.data);
      e29.FS.write(t4, r2, 0, r2.length), e29.FS.close(t4);
    }
  }
};
var z = new R();
async function V(e29, t3) {
  await z._initialize($e, e29, t3 ?? r.default);
}
var tt = class {
  constructor(e29, t3, n2) {
    this.origin = e29, this.progress = new I((t3 + 1) / (n2 * 100));
  }
  origin;
  progress;
  cancel = false;
};
var nt = class e26 {
  static _logDelegate = 0;
  static _onLog;
  static _progressDelegate = 0;
  static _images = {};
  static setLogDelegate(t3) {
    e26._logDelegate === 0 && t3 !== void 0 && (e26._logDelegate = R._api.addFunction(e26.logDelegate, "vii")), R._api._Magick_SetLogDelegate(t3 === void 0 ? 0 : e26._logDelegate), e26._onLog = t3;
  }
  static setProgressDelegate(t3) {
    e26._progressDelegate === 0 && (this._progressDelegate = R._api.addFunction(e26.progressDelegate, "iijji")), this._images[t3._instance.toString()] = t3, R._api._MagickImage_SetClientData(t3._instance, t3._instance), R._api._MagickImage_SetProgressDelegate(t3._instance, T(e26._progressDelegate));
  }
  static removeProgressDelegate(t3) {
    R._api._MagickImage_SetClientData(t3._instance, R._api._NullPointer), R._api._MagickImage_SetProgressDelegate(t3._instance, R._api._NullPointer), delete e26._images[t3._instance.toString()];
  }
  static logDelegate(t3, n2) {
    if (e26._onLog === void 0) return;
    let r2 = b(T(n2), "");
    e26._onLog(new p(t3, r2));
  }
  static progressDelegate(t3, n2, r2, i) {
    let a = e26._images[i];
    if (a === void 0 || a.onProgress === void 0) return 1;
    let o = Number(n2), s = Number(r2), c = new tt(b(T(t3)), o, s);
    return a.onProgress(c), +!c.cancel;
  }
};
var rt = class e27 {
  static _allFormats;
  constructor(e29, t3, n2, r2, i, a, o, s) {
    this.format = e29, this.description = t3, this.mimeType = n2, this.moduleFormat = r2, this.supportsMultipleFrames = i, this.supportsReading = a, this.supportsWriting = o, this.version = s;
  }
  description;
  format;
  mimeType;
  moduleFormat;
  supportsMultipleFrames;
  supportsReading;
  supportsWriting;
  version;
  static get all() {
    return e27._allFormats === void 0 && (e27._allFormats = e27.loadFormats()), e27._allFormats;
  }
  static loadFormats() {
    return k.usePointer((t3) => be.use((n2) => {
      let r2 = R._api._MagickFormatInfo_CreateList(n2.ptr, t3), i = n2.value;
      try {
        let n3 = Array(Number(i)), a = Object.values(Ae);
        for (let o = 0; o < i; o++) {
          let i2 = R._api._MagickFormatInfo_GetInfo(r2, T(o), t3), s = b(R._api._MagickFormatInfo_Format_Get(i2)), c = e27.convertFormat(s, a), l = b(R._api._MagickFormatInfo_Description_Get(i2), ""), u = b(R._api._MagickFormatInfo_MimeType_Get(i2)), d = b(R._api._MagickFormatInfo_Module_Get(i2)), f = e27.convertFormat(d, a), p2 = R._api._MagickFormatInfo_SupportsMultipleFrames_Get(i2) == 1, m2 = R._api._MagickFormatInfo_SupportsReading_Get(i2) == 1, h2 = R._api._MagickFormatInfo_SupportsWriting_Get(i2) == 1, g2 = b(R._api._MagickFormatInfo_Version_Get(i2));
          n3[o] = new e27(c, l, u, f, p2, m2, h2, g2);
        }
        return n3;
      } finally {
        R._api._MagickFormatInfo_DisposeList(r2, i);
      }
    }));
  }
  static convertFormat(e29, t3) {
    return e29 === null ? Ae.Unknown : t3.includes(e29) ? e29 : Ae.Unknown;
  }
};
var H = {
  None: 0,
  Accelerate: 1,
  Annotate: 2,
  Blob: 4,
  Cache: 8,
  Coder: 16,
  Configure: 32,
  Deprecate: 64,
  Draw: 128,
  Exception: 256,
  Image: 512,
  Locale: 1024,
  Module: 2048,
  Pixel: 4096,
  Policy: 8192,
  Resource: 16384,
  Trace: 32768,
  Transform: 65536,
  User: 131072,
  Wand: 262144,
  Detailed: 2147450879,
  get All() {
    return this.Detailed | this.Trace;
  }
};
var it = class e28 {
  static get delegates() {
    return b(R._api._Magick_Delegates_Get(), "Unknown");
  }
  static get features() {
    return b(R._api._Magick_Features_Get(), " ").slice(0, -1);
  }
  static get imageMagickVersion() {
    return b(R._api._Magick_ImageMagickVersion_Get(), "Unknown");
  }
  static get supportedFormats() {
    return rt.all;
  }
  static onLog;
  static addFont(e29, t3) {
    let n2 = R._api.FS;
    n2.analyzePath("/fonts").exists || n2.mkdir("/fonts");
    let r2 = n2.open(`/fonts/${e29}`, "w");
    n2.write(r2, t3, 0, t3.length), n2.close(r2);
  }
  static resetRandomSeed = () => R._api._Magick_ResetRandomSeed();
  static setRandomSeed = (e29) => R._api._Magick_SetRandomSeed(e29);
  static setLogEvents(t3) {
    let n2 = t3 == H.None ? void 0 : e28.logDelegate;
    nt.setLogDelegate(n2), C(e28.getEventTypeString(t3), (e29) => R._api._Magick_SetLogEvents(e29));
  }
  static _getFontFileName(e29) {
    let t3 = `/fonts/${e29}`;
    if (!R._api.FS.analyzePath(t3).exists) throw `Unable to find a font with the name '${e29}', register it with the addFont method of the Magick class.`;
    return t3;
  }
  static getEventTypeString(e29) {
    if (e29 == H.All) return "All,Trace";
    if (e29 == H.Detailed) return "All";
    switch (e29) {
      case H.Accelerate:
        return "Accelerate";
      case H.Annotate:
        return "Annotate";
      case H.Blob:
        return "Blob";
      case H.Cache:
        return "Cache";
      case H.Coder:
        return "Coder";
      case H.Configure:
        return "Configure";
      case H.Deprecate:
        return "Deprecate";
      case H.Draw:
        return "Draw";
      case H.Exception:
        return "Exception";
      case H.Image:
        return "Image";
      case H.Locale:
        return "Locale";
      case H.Module:
        return "Module";
      case H.Pixel:
        return "Pixel";
      case H.Policy:
        return "Policy";
      case H.Resource:
        return "Resource";
      case H.Trace:
        return "Trace";
      case H.Transform:
        return "Transform";
      case H.User:
        return "User";
      case H.Wand:
        return "Wand";
      case H.None:
      default:
        return "None";
    }
  }
  static logDelegate(t3) {
    e28.onLog !== void 0 && e28.onLog(t3);
  }
};
var zt = {
  Undefined: 0,
  Uniform: 1,
  Gaussian: 2,
  MultiplicativeGaussian: 3,
  Impulse: 4,
  Laplacian: 5,
  Poisson: 6,
  Random: 7
};

// src/ops/definitions.ts
var pct = (ctx, val) => ctx ? new ctx.Percentage(val) : val;
var noiseType = (ctx, name) => {
  if (!ctx) return 2;
  const map = {
    Gaussian: "Gaussian",
    Uniform: "Uniform",
    Impulse: "Impulse",
    Laplacian: "Laplacian",
    Poisson: "Poisson",
    Random: "Random",
    MultiplicativeGaussian: "MultiplicativeGaussian"
  };
  return ctx.NoiseType[map[name] ?? "Gaussian"] ?? 2;
};
var OPERATIONS = [
  // ── Filters ──
  {
    id: "blur",
    name: "Gaussian Blur",
    icon: "\u25CE",
    category: "Filters",
    params: [{ id: "sigma", label: "Amount", type: "number", min: 0, max: 30, step: 0.5, default: 2 }],
    apply: (img, p2) => img.blur(0, p2.sigma)
  },
  {
    id: "sharpen",
    name: "Sharpen",
    icon: "\u25C8",
    category: "Filters",
    params: [{ id: "sigma", label: "Amount", type: "number", min: 0, max: 10, step: 0.5, default: 1.5 }],
    apply: (img, p2) => img.sharpen(0, p2.sigma)
  },
  {
    id: "motionBlur",
    name: "Motion Blur",
    icon: "\u224B",
    category: "Filters",
    params: [
      { id: "radius", label: "Radius", type: "number", min: 1, max: 30, step: 1, default: 10 },
      { id: "sigma", label: "Sigma", type: "number", min: 1, max: 20, step: 1, default: 5 },
      { id: "angle", label: "Angle", type: "number", min: -180, max: 180, step: 5, default: 0 }
    ],
    apply: (img, p2) => img.motionBlur(p2.radius, p2.sigma, p2.angle)
  },
  {
    id: "noise",
    name: "Add Noise",
    icon: "\u2056",
    category: "Filters",
    params: [
      {
        id: "noiseType",
        label: "Type",
        type: "select",
        options: ["Gaussian", "Uniform", "Impulse", "Laplacian", "Poisson", "Random", "MultiplicativeGaussian"],
        default: "Gaussian"
      }
    ],
    apply: (img, p2, ctx) => img.addNoise(noiseType(ctx, p2.noiseType))
  },
  // ── Geometry ──
  {
    id: "resize",
    name: "Resize",
    icon: "\u2921",
    category: "Geometry",
    params: [{ id: "percent", label: "Scale %", type: "number", min: 5, max: 200, default: 50 }],
    apply: (img, p2) => img.resize(
      Math.max(1, Math.round(img.width * p2.percent / 100)),
      Math.max(1, Math.round(img.height * p2.percent / 100))
    )
  },
  {
    id: "rotate",
    name: "Rotate",
    icon: "\u21BB",
    category: "Geometry",
    params: [{ id: "deg", label: "Degrees", type: "number", min: -180, max: 180, default: 90 }],
    apply: (img, p2) => img.rotate(p2.deg)
  },
  {
    id: "flip",
    name: "Flip Vertical",
    icon: "\u21C5",
    category: "Geometry",
    params: [],
    apply: (img) => img.flip()
  },
  {
    id: "flop",
    name: "Flip Horizontal",
    icon: "\u21C4",
    category: "Geometry",
    params: [],
    apply: (img) => img.flop()
  },
  // ── Color ──
  {
    id: "grayscale",
    name: "Grayscale",
    icon: "\u25D1",
    category: "Color",
    params: [],
    apply: (img) => img.grayscale()
  },
  {
    id: "negate",
    name: "Invert Colors",
    icon: "\u2298",
    category: "Color",
    params: [],
    apply: (img) => img.negate()
  },
  {
    id: "modulate",
    name: "Brightness / Saturation / Hue",
    icon: "\u2600",
    category: "Color",
    params: [
      { id: "brightness", label: "Brightness %", type: "number", min: 0, max: 200, step: 1, default: 100 },
      { id: "saturation", label: "Saturation %", type: "number", min: 0, max: 200, step: 1, default: 100 },
      { id: "hue", label: "Hue %", type: "number", min: 0, max: 200, step: 1, default: 100 }
    ],
    apply: (img, p2, ctx) => img.modulate(pct(ctx, p2.brightness), pct(ctx, p2.saturation), pct(ctx, p2.hue))
  },
  {
    id: "sigmoidalContrast",
    name: "Contrast (Sigmoidal)",
    icon: "\u25D0",
    category: "Color",
    params: [
      { id: "contrast", label: "Contrast", type: "number", min: 0, max: 10, step: 0.5, default: 3 }
    ],
    apply: (img, p2) => img.sigmoidalContrast(p2.contrast)
  },
  {
    id: "gamma",
    name: "Gamma",
    icon: "\u03B3",
    category: "Color",
    params: [{ id: "value", label: "Gamma", type: "number", min: 0.1, max: 5, step: 0.1, default: 1 }],
    apply: (img, p2) => {
      img.gammaCorrect(p2.value);
    }
  },
  {
    id: "level",
    name: "Levels",
    icon: "\u25A4",
    category: "Color",
    params: [
      { id: "blackPoint", label: "Black Point %", type: "number", min: 0, max: 50, step: 1, default: 0 },
      { id: "whitePoint", label: "White Point %", type: "number", min: 50, max: 100, step: 1, default: 100 },
      { id: "gamma", label: "Gamma", type: "number", min: 0.1, max: 5, step: 0.1, default: 1 }
    ],
    apply: (img, p2, ctx) => img.level(pct(ctx, p2.blackPoint), pct(ctx, p2.whitePoint), p2.gamma)
  },
  // ── Effects ──
  {
    id: "sepia",
    name: "Sepia Tone",
    icon: "\u{1F7EB}",
    category: "Effects",
    params: [
      { id: "threshold", label: "Threshold %", type: "number", min: 0, max: 100, step: 5, default: 80 }
    ],
    apply: (img, p2, ctx) => img.sepiaTone(pct(ctx, p2.threshold))
  },
  {
    id: "oilPaint",
    name: "Oil Paint",
    icon: "\u{1F58C}",
    category: "Effects",
    params: [{ id: "radius", label: "Radius", type: "number", min: 0.5, max: 10, step: 0.5, default: 3 }],
    apply: (img, p2) => img.oilPaint(p2.radius)
  },
  {
    id: "charcoal",
    name: "Charcoal",
    icon: "\u270F",
    category: "Effects",
    params: [
      { id: "radius", label: "Radius", type: "number", min: 0, max: 10, step: 0.5, default: 1.5 },
      { id: "sigma", label: "Sigma", type: "number", min: 0, max: 10, step: 0.5, default: 0.5 }
    ],
    apply: (img, p2) => img.charcoal(p2.radius, p2.sigma)
  }
];
var OP_MAP = Object.fromEntries(OPERATIONS.map((o) => [o.id, o]));

// src/engine/magick.worker.ts
var original = null;
var previewSource = null;
var latestRenderId = 0;
var post = (m2, t3) => self.postMessage(m2, t3 ?? []);
var FORMAT_MAP = {
  png: [Ae.Png, "image/png"],
  jpeg: [Ae.Jpeg, "image/jpeg"],
  jpg: [Ae.Jpeg, "image/jpeg"],
  webp: [Ae.WebP, "image/webp"]
};
var PREVIEW_MAX = 1600;
function downscaleForPreview(img) {
  const largest = Math.max(img.width, img.height);
  if (largest > PREVIEW_MAX) {
    const s = PREVIEW_MAX / largest;
    img.resize(
      Math.max(1, Math.round(img.width * s)),
      Math.max(1, Math.round(img.height * s))
    );
  }
}
self.onmessage = async (e29) => {
  const msg = e29.data;
  try {
    if (msg.type === "init") {
      const wasmUrl = new URL("/wasm/magick.wasm", self.location.origin);
      const res = await fetch(wasmUrl);
      if (!res.ok) throw new Error(`Failed to fetch /wasm/magick.wasm: ${res.status} ${res.statusText}`);
      const buffer = await res.arrayBuffer();
      await V(new Uint8Array(buffer));
      post({ type: "ready" });
    } else if (msg.type === "load") {
      original = new Uint8Array(msg.bytes);
      R.read(original, (img) => {
        const w2 = img.width;
        const h2 = img.height;
        downscaleForPreview(img);
        img.write(Ae.Png, (data) => {
          previewSource = data.slice();
        });
        post({ type: "loaded", id: msg.id, width: w2, height: h2 });
      });
    } else if (msg.type === "cancel") {
      latestRenderId = msg.upToId;
    } else if (msg.type === "render") {
      if (!original) throw new Error("No image loaded");
      latestRenderId = msg.id;
      const myId = msg.id;
      const fmtKey = (msg.format ?? "png").toLowerCase();
      const [fmt, mime] = msg.preview ? [Ae.Png, "image/png"] : FORMAT_MAP[fmtKey] ?? FORMAT_MAP.png;
      const source = msg.preview && previewSource ? previewSource : original;
      R.read(source, (img) => {
        if (myId !== latestRenderId) return;
        if (!msg.preview) {
        }
        for (const step of msg.steps) {
          if (myId !== latestRenderId) return;
          if (!step.enabled) continue;
          const op = OP_MAP[step.opId];
          if (op) {
            try {
              op.apply(img, step.params, { Percentage: I, NoiseType: zt });
            } catch (opErr) {
              console.warn(`[Worker] op "${step.opId}" failed:`, opErr);
            }
          }
        }
        if (myId !== latestRenderId) return;
        if (!msg.preview && msg.quality) {
          img.quality = msg.quality;
        }
        img.write(fmt, (data) => {
          if (myId !== latestRenderId) return;
          const copy = data.slice().buffer;
          post(
            { type: "rendered", id: msg.id, bytes: copy, width: img.width, height: img.height, mime },
            [copy]
          );
        });
      });
    }
  } catch (err) {
    post({
      type: "error",
      id: msg.id ?? -1,
      message: String(err?.message ?? err)
    });
  }
};
