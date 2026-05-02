import { db } from "../../db";
import { legacyCheckInToPlatformEvent } from "../adapters/moodAdapter";
import type { PlatformEventV1 } from "../schema/platformEvent";

const SENTINEL_KEY = "platform_events_v1_mood_checkins_migration_done";

export async function migrateLegacyMoodCheckIns(): Promise<void> {
  try {
    const sentinel = await db.meta.get(SENTINEL_KEY);
    if (sentinel?.value === true) return;

    const legacyCheckIns = await db.checkIns.toArray();

    if (legacyCheckIns.length === 0) {
      await db.meta.put({ key: SENTINEL_KEY, value: true });
      return;
    }

    // Load existing source IDs once — duplicate check is in-memory
    const existingEvents = (await db.events.toArray()) as PlatformEventV1[];
    const seenSourceIds = new Set(
      existingEvents
        .map(e => e.source?.sourceEventId)
        .filter((id): id is string => typeof id === "string")
    );

    let allSucceeded = true;

    for (const checkIn of legacyCheckIns) {
      if (!checkIn.id || !checkIn.date || !checkIn.mood || !checkIn.createdAt) {
        console.warn("[migration] Skipping malformed checkIn:", checkIn.id ?? "(no id)");
        continue;
      }

      if (seenSourceIds.has(checkIn.id)) continue;

      try {
        const event = legacyCheckInToPlatformEvent(checkIn);
        await db.events.put(event as PlatformEventV1);
        seenSourceIds.add(checkIn.id);
      } catch (err) {
        console.error("[migration] Failed to migrate checkIn:", checkIn.id, err);
        allSucceeded = false;
      }
    }

    if (allSucceeded) {
      await db.meta.put({ key: SENTINEL_KEY, value: true });
    }
  } catch (err) {
    console.warn("[migration] Unexpected error, skipping:", err);
  }
}
