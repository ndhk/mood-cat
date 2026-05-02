import type { CheckIn } from "../../db";
import type { PlatformEventV1 } from "../schema/platformEvent";
import { DEFAULT_PLATFORM_PROFILE_ID } from "../schema/profile";
import { createId } from "../utils/ids";
import { nowIso, resolveMoodOccurredAt } from "../utils/dates";
import { MOODS, NOT_SURE_MOOD } from "../../data/moods";

export type MoodCheckInEventData = {
  id: string;
  date: string;
  mood: string;
  followUp: string;
  activityId: string;
  activityCompleted: boolean;
  reflection: "better" | "same" | "worse";
  note: string;
  doodleId: string | null;
  createdAt: string;
  activitySnapshot?: {
    id: string;
    title: string;
    durationMinutes: number;
    supportText?: string;
  };
};

function findActivityById(activityId: string) {
  for (const mood of [...MOODS, NOT_SURE_MOOD]) {
    for (const option of mood.options) {
      for (const activity of option.activities) {
        if (activity.id === activityId) return activity;
      }
    }
  }
  return null;
}

function isValidIso(s: string): boolean {
  if (!s) return false;
  try {
    return !isNaN(new Date(s).getTime());
  } catch {
    return false;
  }
}

function buildEventData(checkIn: CheckIn): MoodCheckInEventData {
  const data: MoodCheckInEventData = {
    id: checkIn.id,
    date: checkIn.date,
    mood: checkIn.mood,
    followUp: checkIn.followUp,
    activityId: checkIn.activityId,
    activityCompleted: checkIn.activityCompleted,
    reflection: checkIn.reflection,
    note: checkIn.note,
    doodleId: checkIn.doodleId,
    createdAt: checkIn.createdAt,
  };

  const found = findActivityById(checkIn.activityId);
  if (found) {
    data.activitySnapshot = {
      id: found.id,
      title: found.title,
      durationMinutes: found.durationMinutes,
      supportText: found.supportText,
    };
  }

  return data;
}

export function createMoodCheckInEvent(
  checkIn: CheckIn
): PlatformEventV1<MoodCheckInEventData> {
  const now = nowIso();
  return {
    id: createId("evt"),
    schemaVersion: "1.0",
    profileId: DEFAULT_PLATFORM_PROFILE_ID,
    module: "mood",
    eventType: "mood_checkin",
    occurredAt: resolveMoodOccurredAt(checkIn),
    recordedAt: now,
    source: {
      type: "manual",
      name: "mood-cat",
    },
    data: buildEventData(checkIn),
    refinement: {
      status: "validated",
      adapter: "mood-cat-manual-v1",
      flags: [],
    },
    createdAt: now,
    updatedAt: now,
  };
}

export function legacyCheckInToPlatformEvent(
  checkIn: CheckIn
): PlatformEventV1<MoodCheckInEventData> {
  const ts = isValidIso(checkIn.createdAt) ? checkIn.createdAt : nowIso();
  return {
    id: createId("evt"),
    schemaVersion: "1.0",
    profileId: DEFAULT_PLATFORM_PROFILE_ID,
    module: "mood",
    eventType: "mood_checkin",
    occurredAt: resolveMoodOccurredAt(checkIn),
    recordedAt: ts,
    source: {
      type: "manual",
      name: "mood-cat",
      sourceEventId: checkIn.id,
    },
    data: buildEventData(checkIn),
    refinement: {
      status: "validated",
      adapter: "mood-cat-manual-v1",
      flags: [],
    },
    createdAt: ts,
    updatedAt: ts,
  };
}

export function platformEventToCheckIn(
  event: PlatformEventV1
): CheckIn | null {
  try {
    if (
      event.schemaVersion !== "1.0" ||
      event.module !== "mood" ||
      event.eventType !== "mood_checkin" ||
      !event.data
    ) {
      return null;
    }

    const d = event.data as MoodCheckInEventData;

    if (!d.id || !d.date || !d.mood || !d.createdAt) return null;

    return {
      id: d.id,
      date: d.date,
      mood: d.mood,
      followUp: d.followUp ?? "",
      activityId: d.activityId ?? "",
      activityCompleted: Boolean(d.activityCompleted),
      reflection: d.reflection ?? "same",
      note: d.note ?? "",
      doodleId: d.doodleId ?? null,
      createdAt: d.createdAt,
    };
  } catch {
    return null;
  }
}
