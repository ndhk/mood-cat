export type PlatformModule =
  | "espresso"
  | "mood"
  | "practice"
  | "study"
  | "seag"
  | "health"
  | "calendar"
  | "meals"
  | "tasks"
  | "music"
  | "finance"
  | "t1d";

export type PlatformEventV1<TData extends Record<string, unknown> = Record<string, unknown>> = {
  id: string;
  schemaVersion: "1.0";
  profileId: string;
  module: PlatformModule;
  eventType: string;
  occurredAt: string;
  recordedAt: string;
  source: {
    type: "manual" | "app" | "device" | "csv" | "api" | "ai";
    name: string;
    sourceEventId?: string;
  };
  data: TData;
  refinement?: {
    status: "raw" | "cleaned" | "validated" | "rejected";
    adapter?: string;
    flags?: string[];
  };
  createdAt: string;
  updatedAt: string;
};
