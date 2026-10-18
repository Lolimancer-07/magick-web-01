/**
 * Batch Rename Token Parser & Conflict Resolver (Spec 4.10)
 */

export interface RenameTokenContext {
  originalName: string; // e.g. "photo.jpg"
  index: number;        // zero-based index
  start: number;        // e.g. 1
  step: number;         // e.g. 1
  padding: number;      // e.g. 3 -> "001"
  date?: Date;          // taken date or lastModified
  width?: number;
  height?: number;
  format?: string;      // e.g. "jpg"
  findText?: string;
  replaceText?: string;
  caseChange?: "none" | "lower" | "upper" | "title";
}

export interface RenameResult {
  originalName: string;
  newName: string;
  hasConflict: boolean;
  conflictResolvedName: string;
}

export function formatBatchName(pattern: string, ctx: RenameTokenContext): string {
  // Extract base name and extension
  const lastDot = ctx.originalName.lastIndexOf(".");
  const baseName = lastDot > 0 ? ctx.originalName.slice(0, lastDot) : ctx.originalName;
  const ext = lastDot > 0 ? ctx.originalName.slice(lastDot + 1) : "";

  const num = ctx.start + ctx.index * ctx.step;
  const paddedIndex = String(num).padStart(ctx.padding, "0");
  const randomStr = Math.random().toString(36).substring(2, 7);

  const dateObj = ctx.date || new Date();
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getDate()).padStart(2, "0");
  const dateStr = `${yyyy}-${mm}-${dd}`;

  let result = pattern
    .replace(/\{name\}/gi, baseName)
    .replace(/\{index\}/gi, paddedIndex)
    .replace(/\{counter\}/gi, String(num))
    .replace(/\{date\}/gi, dateStr)
    .replace(/\{w\}/gi, String(ctx.width || 0))
    .replace(/\{h\}/gi, String(ctx.height || 0))
    .replace(/\{ext\}/gi, ext)
    .replace(/\{format\}/gi, ctx.format || ext)
    .replace(/\{random\}/gi, randomStr);

  // Apply find & replace if specified
  if (ctx.findText && ctx.findText.length > 0) {
    result = result.split(ctx.findText).join(ctx.replaceText || "");
  }

  // Apply case change if specified
  if (ctx.caseChange === "lower") {
    result = result.toLowerCase();
  } else if (ctx.caseChange === "upper") {
    result = result.toUpperCase();
  } else if (ctx.caseChange === "title") {
    result = result.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // Ensure extension is retained if not present in pattern
  if (!result.includes(".") && ext) {
    result = `${result}.${ext}`;
  }

  return result;
}

/**
 * Evaluates pattern across multiple files and automatically detects/resolves conflicts
 * by suffixing duplicates with (1), (2), etc.
 */
export function computeBatchRenameList(
  files: { name: string; width?: number; height?: number; date?: Date }[],
  pattern: string,
  options: {
    start?: number;
    step?: number;
    padding?: number;
    findText?: string;
    replaceText?: string;
    caseChange?: "none" | "lower" | "upper" | "title";
  } = {}
): RenameResult[] {
  const start = options.start ?? 1;
  const step = options.step ?? 1;
  const padding = options.padding ?? 2;

  const rawNames = files.map((file, idx) => {
    return formatBatchName(pattern, {
      originalName: file.name,
      index: idx,
      start,
      step,
      padding,
      date: file.date,
      width: file.width,
      height: file.height,
      findText: options.findText,
      replaceText: options.replaceText,
      caseChange: options.caseChange,
    });
  });

  // Track occurrences to detect conflicts
  const nameCounts = new Map<string, number>();
  for (const name of rawNames) {
    nameCounts.set(name, (nameCounts.get(name) || 0) + 1);
  }

  // Second pass: resolve duplicates with (1), (2)
  const seenCount = new Map<string, number>();
  return files.map((file, idx) => {
    const rawName = rawNames[idx];
    const isConflict = (nameCounts.get(rawName) || 0) > 1;

    let conflictResolvedName = rawName;
    if (isConflict) {
      const occurrence = (seenCount.get(rawName) || 0) + 1;
      seenCount.set(rawName, occurrence);

      if (occurrence > 1) {
        const lastDot = rawName.lastIndexOf(".");
        if (lastDot > 0) {
          const base = rawName.slice(0, lastDot);
          const ext = rawName.slice(lastDot);
          conflictResolvedName = `${base}(${occurrence - 1})${ext}`;
        } else {
          conflictResolvedName = `${rawName}(${occurrence - 1})`;
        }
      }
    }

    return {
      originalName: file.name,
      newName: rawName,
      hasConflict: isConflict,
      conflictResolvedName,
    };
  });
}
