import { ELDER_FUTHARK } from "../runes/elderFuthark";
import { hashStringToInt } from "./hash";

export function runeOfDayKey(isoDate: string) {
  // isoDate expected: YYYY-MM-DD
  const idx = hashStringToInt(isoDate) % ELDER_FUTHARK.length;
  return ELDER_FUTHARK[idx]!.key;
}

export function runeOfDay(isoDate: string) {
  const key = runeOfDayKey(isoDate);
  return ELDER_FUTHARK.find(r => r.key === key)!;
}