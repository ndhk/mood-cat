export function nowIso(): string {
  return new Date().toISOString();
}

export function dateOnlyToIsoStartOfDay(date: string): string {
  try {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return nowIso();
    const d = new Date(date + "T00:00:00");
    if (isNaN(d.getTime())) return nowIso();
    return d.toISOString();
  } catch {
    return nowIso();
  }
}

export function resolveMoodOccurredAt(checkIn: { createdAt: string; date: string }): string {
  try {
    if (checkIn.createdAt) {
      const d = new Date(checkIn.createdAt);
      if (!isNaN(d.getTime())) return checkIn.createdAt;
    }
  } catch {
    // fall through
  }
  try {
    if (checkIn.date) return dateOnlyToIsoStartOfDay(checkIn.date);
  } catch {
    // fall through
  }
  return nowIso();
}
