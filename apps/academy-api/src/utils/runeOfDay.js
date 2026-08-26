import { ELDER_FUTHARK } from "../data/elderFuthark.js";
import { hashStringToInt } from "./hash.js";

export function runeOfDayKey(isoDate) {
  const idx = hashStringToInt(isoDate) % ELDER_FUTHARK.length;
  return ELDER_FUTHARK[idx].key;
}
