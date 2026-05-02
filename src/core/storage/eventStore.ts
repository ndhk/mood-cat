import { db } from "../../db";
import type { PlatformEventV1 } from "../schema/platformEvent";

export async function saveEvent(event: PlatformEventV1): Promise<void> {
  try {
    await db.events.put(event as PlatformEventV1);
  } catch (err) {
    console.error("[eventStore] saveEvent failed:", err);
  }
}

export async function getEvents(): Promise<PlatformEventV1[]> {
  try {
    return (await db.events.toArray()) as PlatformEventV1[];
  } catch (err) {
    console.error("[eventStore] getEvents failed:", err);
    return [];
  }
}

export async function getEventsByModule(module: string): Promise<PlatformEventV1[]> {
  try {
    return (await db.events.where("module").equals(module).toArray()) as PlatformEventV1[];
  } catch (err) {
    console.error("[eventStore] getEventsByModule failed:", err);
    return [];
  }
}

export async function getEventsByProfile(profileId: string): Promise<PlatformEventV1[]> {
  try {
    return (await db.events.where("profileId").equals(profileId).toArray()) as PlatformEventV1[];
  } catch (err) {
    console.error("[eventStore] getEventsByProfile failed:", err);
    return [];
  }
}

export async function getEventsBySourceEventId(sourceEventId: string): Promise<PlatformEventV1[]> {
  try {
    const all = (await db.events.toArray()) as PlatformEventV1[];
    return all.filter(e => e.source?.sourceEventId === sourceEventId);
  } catch (err) {
    console.error("[eventStore] getEventsBySourceEventId failed:", err);
    return [];
  }
}

export async function updateEvent(
  eventId: string,
  patch: Partial<PlatformEventV1>
): Promise<void> {
  try {
    await db.events.update(eventId, patch as Partial<PlatformEventV1>);
  } catch (err) {
    console.error("[eventStore] updateEvent failed:", err);
  }
}

export async function deleteEvent(eventId: string): Promise<void> {
  try {
    await db.events.delete(eventId);
  } catch (err) {
    console.error("[eventStore] deleteEvent failed:", err);
  }
}
