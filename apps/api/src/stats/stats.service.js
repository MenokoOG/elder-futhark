"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
var common_1 = require("@nestjs/common");
var stats_util_1 = require("./stats.util");
/**
 * Collection names used by Stats.
 * Change these to match your actual schema/model names later.
 *
 * This module intentionally uses the raw Mongo connection so you
 * don't get blocked while other modules evolve.
 */
var COLLECTIONS = {
    // rituals / streaks
    ritual: "ritualentries",
    // spaced repetition cards
    study: "studyitems",
    // achievement unlocks
    achievements: "achievementunlocks",
    // quiz attempts
    quiz: "quizattempts",
    // drawing attempts (canvas recognition)
    drawing: "drawingattempts",
    // user profiles (for leaderboard handle lookup)
    users: "users"
};
var StatsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var StatsService = _classThis = /** @class */ (function () {
        function StatsService_1(conn) {
            this.conn = conn;
        }
        StatsService_1.prototype.col = function (name) {
            return this.conn.collection(name);
        };
        StatsService_1.prototype.safeCount = function (name, filter) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.col(name).countDocuments(filter)];
                        case 1: return [2 /*return*/, _b.sent()];
                        case 2:
                            _a = _b.sent();
                            return [2 /*return*/, 0];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        StatsService_1.prototype.safeFindDaysDesc = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var docs, days, _i, _a, d, day, seen, uniq, _b, days_1, day, lastRitualDay, runeOfDayKey, _c;
                var _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            _g.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.col(COLLECTIONS.ritual)
                                    .find({ userId: userId }, { projection: { day: 1, createdAt: 1, runeOfDayKey: 1 } })
                                    .sort({ day: -1, createdAt: -1 })
                                    .limit(120)
                                    .toArray()];
                        case 1:
                            docs = _g.sent();
                            days = [];
                            for (_i = 0, _a = docs; _i < _a.length; _i++) {
                                d = _a[_i];
                                day = typeof d.day === "string" ? d.day :
                                    d.createdAt ? (0, stats_util_1.isoDayUTC)(new Date(d.createdAt)) :
                                        null;
                                if (day)
                                    days.push(day);
                            }
                            seen = new Set();
                            uniq = [];
                            for (_b = 0, days_1 = days; _b < days_1.length; _b++) {
                                day = days_1[_b];
                                if (seen.has(day))
                                    continue;
                                seen.add(day);
                                uniq.push(day);
                            }
                            lastRitualDay = (_d = uniq[0]) !== null && _d !== void 0 ? _d : null;
                            runeOfDayKey = (_f = (_e = docs === null || docs === void 0 ? void 0 : docs[0]) === null || _e === void 0 ? void 0 : _e.runeOfDayKey) !== null && _f !== void 0 ? _f : null;
                            return [2 /*return*/, { daysDesc: uniq, lastRitualDay: lastRitualDay, runeOfDayKey: runeOfDayKey }];
                        case 2:
                            _c = _g.sent();
                            return [2 /*return*/, { daysDesc: [], lastRitualDay: null, runeOfDayKey: null }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        StatsService_1.prototype.safeLongestStreak = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var docs, days, _i, _a, d, day, set, uniqAsc, best, cur, prevDate, _b, uniqAsc_1, day, dt, diff, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.col(COLLECTIONS.ritual)
                                    .find({ userId: userId }, { projection: { day: 1, createdAt: 1 } })
                                    .sort({ day: -1, createdAt: -1 })
                                    .limit(365)
                                    .toArray()];
                        case 1:
                            docs = _d.sent();
                            days = [];
                            for (_i = 0, _a = docs; _i < _a.length; _i++) {
                                d = _a[_i];
                                day = typeof d.day === "string" ? d.day :
                                    d.createdAt ? (0, stats_util_1.isoDayUTC)(new Date(d.createdAt)) :
                                        null;
                                if (day)
                                    days.push(day);
                            }
                            set = new Set(days);
                            uniqAsc = Array.from(set).sort();
                            best = 0;
                            cur = 0;
                            prevDate = null;
                            for (_b = 0, uniqAsc_1 = uniqAsc; _b < uniqAsc_1.length; _b++) {
                                day = uniqAsc_1[_b];
                                dt = new Date("".concat(day, "T00:00:00.000Z"));
                                if (!prevDate) {
                                    cur = 1;
                                    best = Math.max(best, cur);
                                    prevDate = dt;
                                    continue;
                                }
                                diff = Math.round((dt.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
                                if (diff === 1)
                                    cur += 1;
                                else
                                    cur = 1;
                                best = Math.max(best, cur);
                                prevDate = dt;
                            }
                            return [2 /*return*/, best];
                        case 2:
                            _c = _d.sent();
                            return [2 /*return*/, 0];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        StatsService_1.prototype.safeStudyStats = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var now, col, totalCards, dueNow, learning, mature, easeAgg, avgEase, _a;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            now = new Date();
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 7, , 8]);
                            col = this.col(COLLECTIONS.study);
                            return [4 /*yield*/, col.countDocuments({ userId: userId })];
                        case 2:
                            totalCards = _d.sent();
                            return [4 /*yield*/, col.countDocuments({
                                    userId: userId,
                                    $or: [
                                        { nextReviewAt: { $lte: now } },
                                        { dueAt: { $lte: now } }
                                    ]
                                })];
                        case 3:
                            dueNow = _d.sent();
                            return [4 /*yield*/, col.countDocuments({
                                    userId: userId,
                                    $or: [{ state: "learning" }, { intervalDays: { $lte: 7 } }]
                                })];
                        case 4:
                            learning = _d.sent();
                            return [4 /*yield*/, col.countDocuments({
                                    userId: userId,
                                    $or: [{ state: "mature" }, { intervalDays: { $gte: 21 } }]
                                })];
                        case 5:
                            mature = _d.sent();
                            return [4 /*yield*/, col
                                    .aggregate([
                                    { $match: { userId: userId, ease: { $type: "number" } } },
                                    { $group: { _id: null, avgEase: { $avg: "$ease" } } }
                                ])
                                    .toArray()];
                        case 6:
                            easeAgg = _d.sent();
                            avgEase = (_c = (_b = easeAgg === null || easeAgg === void 0 ? void 0 : easeAgg[0]) === null || _b === void 0 ? void 0 : _b.avgEase) !== null && _c !== void 0 ? _c : null;
                            return [2 /*return*/, { totalCards: totalCards, dueNow: dueNow, learning: learning, mature: mature, avgEase: avgEase }];
                        case 7:
                            _a = _d.sent();
                            return [2 /*return*/, { totalCards: 0, dueNow: 0, learning: 0, mature: 0, avgEase: null }];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        StatsService_1.prototype.safeQuizStats = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var col, attempts, agg, row, _a;
                var _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _e.trys.push([0, 3, , 4]);
                            col = this.col(COLLECTIONS.quiz);
                            return [4 /*yield*/, col.countDocuments({ userId: userId })];
                        case 1:
                            attempts = _e.sent();
                            return [4 /*yield*/, col
                                    .aggregate([
                                    { $match: { userId: userId, score: { $type: "number" } } },
                                    {
                                        $group: {
                                            _id: null,
                                            bestScore: { $max: "$score" },
                                            avgScore: { $avg: "$score" },
                                            lastAttemptAt: { $max: "$createdAt" }
                                        }
                                    }
                                ])
                                    .toArray()];
                        case 2:
                            agg = _e.sent();
                            row = (_b = agg === null || agg === void 0 ? void 0 : agg[0]) !== null && _b !== void 0 ? _b : null;
                            return [2 /*return*/, {
                                    attempts: attempts,
                                    bestScore: (_c = row === null || row === void 0 ? void 0 : row.bestScore) !== null && _c !== void 0 ? _c : null,
                                    avgScore: (_d = row === null || row === void 0 ? void 0 : row.avgScore) !== null && _d !== void 0 ? _d : null,
                                    lastAttemptAt: (row === null || row === void 0 ? void 0 : row.lastAttemptAt) ? new Date(row.lastAttemptAt).toISOString() : null
                                }];
                        case 3:
                            _a = _e.sent();
                            return [2 /*return*/, { attempts: 0, bestScore: null, avgScore: null, lastAttemptAt: null }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        StatsService_1.prototype.safeDrawingStats = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var col, attempts, agg, row, _a;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 3, , 4]);
                            col = this.col(COLLECTIONS.drawing);
                            return [4 /*yield*/, col.countDocuments({ userId: userId })];
                        case 1:
                            attempts = _d.sent();
                            return [4 /*yield*/, col
                                    .aggregate([
                                    { $match: { userId: userId, matchScore: { $type: "number" } } },
                                    {
                                        $group: {
                                            _id: null,
                                            bestMatchScore: { $max: "$matchScore" },
                                            lastAttemptAt: { $max: "$createdAt" }
                                        }
                                    }
                                ])
                                    .toArray()];
                        case 2:
                            agg = _d.sent();
                            row = (_b = agg === null || agg === void 0 ? void 0 : agg[0]) !== null && _b !== void 0 ? _b : null;
                            return [2 /*return*/, {
                                    attempts: attempts,
                                    bestMatchScore: (_c = row === null || row === void 0 ? void 0 : row.bestMatchScore) !== null && _c !== void 0 ? _c : null,
                                    lastAttemptAt: (row === null || row === void 0 ? void 0 : row.lastAttemptAt) ? new Date(row.lastAttemptAt).toISOString() : null
                                }];
                        case 3:
                            _a = _d.sent();
                            return [2 /*return*/, { attempts: 0, bestMatchScore: null, lastAttemptAt: null }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        StatsService_1.prototype.safeAchievements = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var col, unlocked, recentDocs, recent, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            col = this.col(COLLECTIONS.achievements);
                            return [4 /*yield*/, col.countDocuments({ userId: userId })];
                        case 1:
                            unlocked = _b.sent();
                            return [4 /*yield*/, col
                                    .find({ userId: userId }, { projection: { key: 1, unlockedAt: 1, createdAt: 1 } })
                                    .sort({ unlockedAt: -1, createdAt: -1 })
                                    .limit(5)
                                    .toArray()];
                        case 2:
                            recentDocs = _b.sent();
                            recent = recentDocs.map(function (d) {
                                var _a, _b, _c;
                                return ({
                                    key: String((_a = d.key) !== null && _a !== void 0 ? _a : "unknown"),
                                    unlockedAt: new Date((_c = (_b = d.unlockedAt) !== null && _b !== void 0 ? _b : d.createdAt) !== null && _c !== void 0 ? _c : Date.now()).toISOString()
                                });
                            });
                            return [2 /*return*/, {
                                    unlocked: unlocked,
                                    totalKnown: null,
                                    recent: recent
                                }];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, { unlocked: 0, totalKnown: null, recent: [] }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Points model (simple and fun; adjust anytime):
         * - 5 pts per ritual day
         * - 1 pt per study card
         * - +25 per achievement
         * - + (quiz avg / 4) scaled
         * - + (drawing best) scaled
         */
        StatsService_1.prototype.computePoints = function (input) {
            var ritualPts = input.ritualDays * 5;
            var studyPts = input.studyCards * 1;
            var achievementPts = input.achievementsUnlocked * 25;
            var quizPts = input.quizAvg ? Math.round(input.quizAvg / 4) : 0;
            var drawingPts = input.drawingBest == null
                ? 0
                : input.drawingBest <= 1
                    ? Math.round(input.drawingBest * 100) // 0..1 scale
                    : Math.round(input.drawingBest); // 0..100 scale
            return ritualPts + studyPts + achievementPts + quizPts + drawingPts;
        };
        StatsService_1.prototype.getOverview = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var nowIso, ritualDaysCount, _a, daysDesc, lastRitualDay, runeOfDayKey, currentStreak, longestStreak, study, achievements, quiz, drawing, points, _b, level, nextLevelAt;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            nowIso = new Date().toISOString();
                            return [4 /*yield*/, this.safeCount(COLLECTIONS.ritual, { userId: userId })];
                        case 1:
                            ritualDaysCount = _c.sent();
                            return [4 /*yield*/, this.safeFindDaysDesc(userId)];
                        case 2:
                            _a = _c.sent(), daysDesc = _a.daysDesc, lastRitualDay = _a.lastRitualDay, runeOfDayKey = _a.runeOfDayKey;
                            currentStreak = (0, stats_util_1.computeStreak)(daysDesc);
                            return [4 /*yield*/, this.safeLongestStreak(userId)];
                        case 3:
                            longestStreak = _c.sent();
                            return [4 /*yield*/, this.safeStudyStats(userId)];
                        case 4:
                            study = _c.sent();
                            return [4 /*yield*/, this.safeAchievements(userId)];
                        case 5:
                            achievements = _c.sent();
                            return [4 /*yield*/, this.safeQuizStats(userId)];
                        case 6:
                            quiz = _c.sent();
                            return [4 /*yield*/, this.safeDrawingStats(userId)];
                        case 7:
                            drawing = _c.sent();
                            points = this.computePoints({
                                ritualDays: ritualDaysCount,
                                studyCards: study.totalCards,
                                achievementsUnlocked: achievements.unlocked,
                                quizAvg: quiz.avgScore,
                                drawingBest: drawing.bestMatchScore
                            });
                            _b = (0, stats_util_1.levelFromPoints)(points), level = _b.level, nextLevelAt = _b.nextLevelAt;
                            return [2 /*return*/, {
                                    userId: userId,
                                    points: points,
                                    level: level,
                                    nextLevelAt: nextLevelAt,
                                    ritual: {
                                        currentStreak: currentStreak,
                                        longestStreak: longestStreak,
                                        totalRitualDays: ritualDaysCount,
                                        lastRitualDay: lastRitualDay,
                                        runeOfDayKey: runeOfDayKey
                                    },
                                    study: study,
                                    achievements: achievements,
                                    quiz: quiz,
                                    drawing: drawing,
                                    updatedAt: nowIso
                                }];
                    }
                });
            });
        };
        StatsService_1.prototype.getLeaderboard = function () {
            return __awaiter(this, arguments, void 0, function (limit) {
                var safeLimit, users, rows, _i, _a, u, id, overview, _b;
                var _c;
                if (limit === void 0) { limit = 10; }
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            safeLimit = Math.max(1, Math.min(50, limit));
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 7, , 8]);
                            return [4 /*yield*/, this.col(COLLECTIONS.users)
                                    .find({}, { projection: { _id: 1, handle: 1 }, sort: { createdAt: -1 }, limit: safeLimit })
                                    .toArray()];
                        case 2:
                            users = _d.sent();
                            rows = [];
                            _i = 0, _a = users;
                            _d.label = 3;
                        case 3:
                            if (!(_i < _a.length)) return [3 /*break*/, 6];
                            u = _a[_i];
                            id = String(u._id);
                            return [4 /*yield*/, this.getOverview(id)];
                        case 4:
                            overview = _d.sent();
                            rows.push({
                                userId: id,
                                handle: (_c = u.handle) !== null && _c !== void 0 ? _c : null,
                                points: overview.points,
                                level: overview.level,
                                updatedAt: overview.updatedAt
                            });
                            _d.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 3];
                        case 6:
                            rows.sort(function (a, b) { return b.points - a.points; });
                            return [2 /*return*/, rows.slice(0, safeLimit)];
                        case 7:
                            _b = _d.sent();
                            return [2 /*return*/, []];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        return StatsService_1;
    }());
    __setFunctionName(_classThis, "StatsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StatsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StatsService = _classThis;
}();
exports.StatsService = StatsService;
