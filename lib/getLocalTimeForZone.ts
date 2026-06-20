import { DateTime } from "luxon";

export function getLocalTimeForZone({
  baseZone = "America/Chicago",
  baseTime = "19:00",
  targetZone,
  date = DateTime.now(),
}: {
  baseZone?: string;
  baseTime?: string;
  targetZone: string;
  date?: DateTime;
}) {
  const [hour, minute] = baseTime.split(":").map(Number);
  const baseDate = date
    .setZone(baseZone)
    .set({ hour, minute, second: 0, millisecond: 0 });
  const localDate = baseDate.setZone(targetZone);
  return localDate.toFormat("h:mm a");
}
