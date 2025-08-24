import { DateTime } from "luxon";

export function getLocalTimeForZone({
  baseZone = "America/Chicago",
  baseTime = "21:00",
  targetZone,
  date = DateTime.now(),
}: {
  baseZone?: string;
  baseTime?: string;
  targetZone: string;
  date?: DateTime;
}) {
  const [hour, minute] = baseTime.split(":").map(Number);
  // Create a DateTime for today at baseTime in baseZone
  const baseDate = date.set({ hour, minute, second: 0, millisecond: 0 }).setZone(baseZone, { keepLocalTime: true });
  // Convert to target zone
  const localDate = baseDate.setZone(targetZone);
  return localDate.toFormat("h:mm a");
}
