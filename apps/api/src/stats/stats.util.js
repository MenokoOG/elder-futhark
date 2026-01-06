"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserIdFromReq = getUserIdFromReq;
exports.isoDayUTC = isoDayUTC;
exports.parseIsoDayUTC = parseIsoDayUTC;
exports.computeStreak = computeStreak;
exports.levelFromPoints = levelFromPoints;
function getUserIdFromReq(req) {
    var _a, _b, _c, _d;
    var u = req.user;
    var id = (_d = (_c = (_b = (_a = u === null || u === void 0 ? void 0 : u.sub) !== null && _a !== void 0 ? _a : u === null || u === void 0 ? void 0 : u.userId) !== null && _b !== void 0 ? _b : u === null || u === void 0 ? void 0 : u.id) !== null && _c !== void 0 ? _c : u === null || u === void 0 ? void 0 : u._id) !== null && _d !== void 0 ? _d : null;
    if (!id)
        return "";
    return String(id);
}
function isoDayUTC(d) {
    var y = d.getUTCFullYear();
    var m = String(d.getUTCMonth() + 1).padStart(2, "0");
    var day = String(d.getUTCDate()).padStart(2, "0");
    return "".concat(y, "-").concat(m, "-").concat(day);
}
function parseIsoDayUTC(s) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s))
        return null;
    var _a = s.split("-").map(Number), y = _a[0], m = _a[1], d = _a[2];
    var dt = new Date(Date.UTC(y, m - 1, d));
    return Number.isFinite(dt.getTime()) ? dt : null;
}
function computeStreak(daysDesc) {
    if (daysDesc.length === 0)
        return 0;
    var first = parseIsoDayUTC(daysDesc[0]);
    if (!first)
        return 0;
    var streak = 1;
    var prev = first;
    for (var i = 1; i < daysDesc.length; i++) {
        var cur = parseIsoDayUTC(daysDesc[i]);
        if (!cur)
            continue;
        var diffDays = Math.round((prev.getTime() - cur.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
            streak += 1;
            prev = cur;
            continue;
        }
        if (diffDays === 0)
            continue;
        break;
    }
    return streak;
}
function levelFromPoints(points) {
    var level = 1;
    while (true) {
        var next = level + 1;
        var neededForNext = 150 * next * (next - 1);
        if (points >= neededForNext)
            level = next;
        else
            break;
    }
    var nextLevelAt = 150 * (level + 1) * level;
    return { level: level, nextLevelAt: nextLevelAt };
}
