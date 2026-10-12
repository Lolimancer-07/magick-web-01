import type { PipelineStep, WorkerRequest, WorkerResponse } from "./types";

class EngineClient {
  private worker!: Worker;
  private nextId = 1;
  private pending = new Map<
    number,
    { resolve: (v: any) => void; reject: (e: Error) => void } // eslint-disable-line @typescript-eslint/no-explicit-any
  >();
  private readyPromise!: Promise<void>;
  private started = false;

  start() {
    if (typeof window === "undefined") {
      return Promise.reject(new Error("EngineClient can only run in the browser"));
    }
    if (this.started) return this.readyPromise;
    this.started = true;
    this.worker = new Worker("/magick.worker.js", { type: "module" });
    this.readyPromise = new Promise((res, rej) => {
      this.worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
        const m = e.data;
        if (m.type === "ready") return res();
        const p = this.pending.get((m as any).id); // eslint-disable-line @typescript-eslint/no-explicit-any
        if (!p) {
          if (m.type === "error" && (m as any).id === -1) {
            return rej(new Error(m.message));
          }
          return;
        }
        this.pending.delete((m as any).id); // eslint-disable-line @typescript-eslint/no-explicit-any
        m.type === "error"
          ? p.reject(new Error(m.message))
          : p.resolve(m);
      };
      this.worker.onerror = (err) => {
        console.error("Magick worker error:", err);
        rej(new Error(err instanceof Error ? err.message : "Worker encountered an error"));
      };
    });
    this.worker.postMessage({ type: "init" } satisfies WorkerRequest);
    return this.readyPromise;
  }

  private call<T>(
    req: Omit<WorkerRequest, "id"> & { id?: number },
    transfer: Transferable[] = []
  ) {
    const id = this.nextId++;
    return new Promise<T>((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.worker.postMessage({ ...req, id }, transfer);
    });
  }

  async load(file: File) {
    await this.start();
    const bytes = await file.arrayBuffer();
    return this.call<{ width: number; height: number }>(
      { type: "load", bytes } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      [bytes]
    );
  }

  render(
    steps: PipelineStep[],
    opts: { preview: boolean; format?: string; quality?: number }
  ) {
    return this.call<{
      bytes: ArrayBuffer;
      mime: string;
      width: number;
      height: number;
    }>({
      type: "render",
      steps,
      preview: opts.preview,
      format: opts.format ?? "png",
      quality: opts.quality,
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

export const engine = new EngineClient();
