# Platform Module Standard v1

## 1. Purpose

This standard defines how each standalone prototype module becomes compatible with the future shared family/personal platform. It covers the event schema, adapter pattern, storage conventions, migration strategy, and rollout sequence. Following this standard ensures that modules built independently can be unified without rewriting core logic or discarding existing user data.

---

## 2. Core Principle

Every module must write meaningful user actions as `PlatformEventV1` records while preserving the module's existing UI-facing data shape through adapters.

The platform event layer is **additive and parallel**. It does not replace module-local models during the transition phase. The module's existing screens, hooks, and storage continue to operate unchanged. The platform event record exists alongside them.

---

## 3. PlatformEventV1 Required Fields

```ts
type PlatformEventV1<TData extends Record<string, unknown> = Record<string, unknown>> = {
  id: string;                    // unique event ID, prefixed (e.g. "evt_<uuid>")
  schemaVersion: "1.0";          // locked to "1.0" for this standard
  profileId: string;             // platform profile ID (see profile convention below)
  module: PlatformModule;        // which module produced the event
  eventType: string;             // e.g. "mood_checkin", "brew_logged"
  occurredAt: string;            // ISO 8601 — when the action happened
  recordedAt: string;            // ISO 8601 — when the record was written
  source: {
    type: "manual" | "app" | "device" | "csv" | "api" | "ai";
    name: string;                // e.g. "mood-cat", "espresso"
    sourceEventId?: string;      // legacy record ID if migrated
  };
  data: TData;                   // module-specific payload
  refinement?: {
    status: "raw" | "cleaned" | "validated" | "rejected";
    adapter?: string;            // e.g. "mood-cat-manual-v1"
    flags?: string[];
  };
  createdAt: string;             // ISO 8601
  updatedAt: string;             // ISO 8601
};
```

**Profile ID convention:** Local single-user prototypes use a stable string ID such as `"profile_local_default"`. Do not reuse the legacy storage key (e.g. `"local-default"`) as the platform profile ID.

**ID generation:** Use `crypto.randomUUID()` where available, with a `Date.now() + Math.random()` fallback. Prefix IDs for readability: `evt_`, `profile_`, etc.

**occurredAt vs recordedAt:** `occurredAt` is when the user action happened (may be derived from legacy data). `recordedAt` is when the platform event record was written. For real-time events they are the same. For migrated legacy records, `recordedAt` should reflect the original record's creation timestamp.

---

## 4. Module Adapter Standard

Each module must provide three adapter functions, typically in `src/core/adapters/<module>Adapter.ts`:

| Function | Purpose |
|---|---|
| `create[Module]Event(record)` | Creates a new `PlatformEventV1` from a live module record at save time |
| `legacy[Module]ToPlatformEvent(record)` | Converts a legacy record during migration; sets `source.sourceEventId` |
| `platformEventTo[Module](event)` | Reconstructs the module's local record shape from a platform event; returns `null` if malformed |

**UI must not depend directly on `PlatformEventV1`.** Screens, hooks, and components work with the module's own record type. Conversion to and from platform events is the adapter's responsibility. This keeps the refactor invisible to the UI layer and makes it independently reversible.

The `data` payload should embed the full module record so that `platformEventTo[Module]` can reconstruct it exactly, including fields like `doodleId` that reference separate storage.

---

## 5. Storage Standard

Storage backend may differ by prototype:

| Backend | Convention |
|---|---|
| `localStorage` | Store platform events under key `platform_events_v1` as a JSON array |
| `IndexedDB / Dexie` | Add an `events` table with schema `'id, module, eventType, profileId, occurredAt, createdAt'` |

Regardless of backend, the event shape must conform to `PlatformEventV1`. This ensures events can be exported, compared, and eventually unified across modules even when storage backends differ.

When adding an `events` table to an existing Dexie database, increment the database version and add only the new tables in the new version block. Do not modify existing version blocks or existing table schemas.

A `meta` table (schema: `'key'`) should be added alongside `events` to store migration sentinels and any future lightweight module-level state.

---

## 6. Migration Standard

A one-time migration backfills existing module records into the `events` table or storage key.

Every migration must:

- **Preserve legacy data.** Never delete or modify the source records. The legacy table or storage key remains intact after migration.
- **Be idempotent.** Use a sentinel (stored in `meta` table or localStorage) to skip reruns after success. Key convention: `platform_events_v1_<module>_<type>_migration_done`.
- **Avoid duplicates.** Before inserting a migrated event, check whether an event already exists with `source.sourceEventId === legacyRecord.id`. Perform this check in memory if the field is not indexed.
- **Use `source.sourceEventId`.** Set this to the legacy record's ID so the link between legacy and platform records is traceable.
- **Fail gracefully.** If a single record fails to migrate, log a warning and continue. Do not mark the sentinel until all valid records succeed. If migration fails entirely, the app must continue working from legacy data.
- **Skip malformed records.** If a legacy record is missing essential fields (`id`, `date`/timestamp, primary data field), skip it with a warning. Do not crash the migration.

Migration timing: run during app initialisation, before the first user-facing state read. Do not run it only inside a specific screen.

---

## 7. Dual-Write Standard

Dual-write means that on every new save, the module writes to both its legacy store and the `events` table simultaneously.

Use dual-write when:

- Legacy reads still power important app logic (history, frequency limits, rewards, dashboards)
- Switching reads to the events table is a separate future task
- The cost of a broken read path is user-facing

**Mood Cat uses dual-write** because `HistoryScreen` reads from `checkIns`, rewards logic reads from `checkIns`, and same-day frequency logic depends on the legacy table. Switching those reads to the events table is deferred until the event spine is proven stable.

In the dual-write path, the legacy write is always primary. If the event write fails, log the error and do not block or roll back the legacy write.

---

## 8. Read-Path Standard

Migrating the read path is a separate task from adding the write path and migration.

**Phase 1 (current standard):** Legacy reads remain. `getAllCheckIns()`, `HistoryScreen`, and equivalent functions continue reading from the legacy table. The `events` table grows in the background.

**Phase 2 (future):** Switch read functions to derive data from the `events` table (e.g. via `platformEventTo[Module]()`). Legacy table becomes a fallback or is removed.

Keep these phases separate. Mixing read-path refactor with migration and write-path refactor in the same step increases risk and makes rollback harder. The exception is very simple modules with no frequency logic, no rewards, and no external readers.

---

## 9. Refinement Layer Standard

Future integrations must not combine raw data directly from multiple modules. Each source must pass through a refinement layer before being used in cross-module views, summaries, or AI context.

The refinement layer is responsible for:

- **Clean** — remove noise, duplicates, and formatting inconsistencies
- **Normalise** — convert units, align timestamps, standardise enumerations
- **Validate** — confirm required fields are present and plausible
- **Weight/confidence** — assign confidence scores where data quality varies (e.g. manual vs. device-sourced)
- **Flag issues** — mark events that could not be fully validated (`refinement.status = "rejected"` or `"raw"`)
- **Preserve traceability** — never discard the original event; always store refinement metadata on the event record

The `refinement` field on `PlatformEventV1` is the attachment point for this layer. Adapters that produce events at save time should set `refinement.status = "validated"` and `refinement.adapter` to identify the adapter version.

---

## 10. Module Rollout Sequence

Follow this sequence when adding `PlatformEventV1` support to a new module:

1. **Inspect the existing data model** — identify all record types, storage keys, legacy IDs, and read paths
2. **Add `PlatformEventV1` schema** if not already present in the codebase
3. **Add the module adapter** — `create[Module]Event`, `legacy[Module]ToPlatformEvent`, `platformEventTo[Module]`
4. **Add the event store** — wire up `saveEvent`, `getEvents`, `getEventsByModule`, etc. against the appropriate backend
5. **Add the safe migration** — idempotent, sentinel-guarded, skip-on-fail
6. **Add dual-write** if the legacy read path is still active
7. **Preserve the UI-facing model** — no screen changes, no hook changes
8. **Validate manually** — check that new events are written, migration runs once, history shows no duplicates, rewards and limits still work
9. **Only then** consider adding new features that depend on the event layer

Do not skip steps. Do not combine step 9 with steps 1–8.

---

## 11. Exclusions

The platform event refactor must not also introduce:

- Authentication or user accounts
- Backend or cloud sync
- AI features or inference
- New user-facing screens
- New app features
- Analytics dashboards
- Third-party integrations

These are future-phase work. The refactor is a data-layer change only. Its value is building the event spine safely so those capabilities can be added later without rewriting history.

---

## 12. Current Module Status

| Module | Status |
|---|---|
| **Espresso** | `PlatformEventV1` complete. localStorage-based event storage. Adapter pattern in place. Migration from legacy records complete. Developer event inspection view complete. |
| **Mood Cat** | `PlatformEventV1` support complete via dual-write. Dexie/IndexedDB `events` and `meta` tables added. Migration from legacy `checkIns` complete. Legacy reads preserved. Live smoke test passed. |
| **Practice tracker** | Planned |
| **Study guide** | Planned |
| **SEAG prep** | Planned |
| **Health** | Planned |
| **Meal planning** | Planned |
| **Receipt scanning** | Planned |
| **Pantry / fridge scanning** | Planned |
| **Music reflection** | Planned |
| **T1D support** | Planned |

---

## 13. Future Work

- **Shared platform shell** — single host app that loads modules
- **Shared profile model** — unified `profileId` across all modules, replacing per-module `"profile_local_default"` convention
- **Shared backend** — sync events to a persistent store; current prototypes are device-local only
- **Unified developer event inspector** — single view across all modules, replacing per-module developer screens
- **Read-path migration** — switch module history and summary views from legacy tables to event-derived queries
- **Source-specific refinement adapters** — per-module refinement logic plugged into the `refinement` field
- **Export / import platform events** — portable JSON export of all events across modules, usable for backup, transfer, and AI context
