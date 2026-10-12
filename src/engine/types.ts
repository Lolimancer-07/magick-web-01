export type ParamDef =
  | { id: string; label: string; type: "number"; min: number; max: number; step?: number; default: number }
  | { id: string; label: string; type: "select"; options: string[]; default: string }
  | { id: string; label: string; type: "boolean"; default: boolean };

export interface PipelineStep {
  uid: string;
  opId: string;
  params: Record<string, number | string | boolean>;
  enabled: boolean;
}

export type WorkerRequest =
  | { type: "init" }
  | { type: "load"; id: number; bytes: ArrayBuffer }
  | { type: "render"; id: number; steps: PipelineStep[]; preview: boolean; format: string; quality?: number };

export type WorkerResponse =
  | { type: "ready" }
  | { type: "loaded"; id: number; width: number; height: number }
  | { type: "rendered"; id: number; bytes: ArrayBuffer; width: number; height: number; mime: string }
  | { type: "error"; id: number; message: string };
