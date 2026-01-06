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
exports.RitualService = void 0;
var common_1 = require("@nestjs/common");
var shared_1 = require("@efa/shared");
function isoToday() {
    var d = new Date();
    var yyyy = d.getFullYear();
    var mm = String(d.getMonth() + 1).padStart(2, "0");
    var dd = String(d.getDate()).padStart(2, "0");
    return "".concat(yyyy, "-").concat(mm, "-").concat(dd);
}
var RitualService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RitualService = _classThis = /** @class */ (function () {
        function RitualService_1(progressSvc, progressModel) {
            this.progressSvc = progressSvc;
            this.progressModel = progressModel;
        }
        RitualService_1.prototype.getRuneOfDay = function (userId, isoDate) {
            return __awaiter(this, void 0, void 0, function () {
                var date, p, lastIso, claimedToday;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            date = isoDate !== null && isoDate !== void 0 ? isoDate : isoToday();
                            return [4 /*yield*/, this.progressSvc.ensureProgress(userId)];
                        case 1:
                            p = _a.sent();
                            lastIso = p.lastRitualDate ? p.lastRitualDate.toISOString().slice(0, 10) : null;
                            claimedToday = lastIso === date;
                            return [2 /*return*/, { isoDate: date, runeKey: (0, shared_1.runeOfDayKey)(date), streak: p.streak, claimedToday: claimedToday }];
                    }
                });
            });
        };
        RitualService_1.prototype.claim = function (userId, isoDate) {
            return __awaiter(this, void 0, void 0, function () {
                var date, p, lastIso, last, nextStreak, lastIsoInner, lastDate, curDate, diffDays;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            date = isoDate !== null && isoDate !== void 0 ? isoDate : isoToday();
                            return [4 /*yield*/, this.progressSvc.ensureProgress(userId)];
                        case 1:
                            p = _a.sent();
                            lastIso = p.lastRitualDate ? p.lastRitualDate.toISOString().slice(0, 10) : null;
                            if (lastIso === date) {
                                return [2 /*return*/, { isoDate: date, runeKey: (0, shared_1.runeOfDayKey)(date), streak: p.streak, claimedToday: true }];
                            }
                            last = p.lastRitualDate;
                            nextStreak = 1;
                            if (last) {
                                lastIsoInner = last.toISOString().slice(0, 10);
                                lastDate = new Date(lastIsoInner + "T00:00:00Z");
                                curDate = new Date(date + "T00:00:00Z");
                                diffDays = Math.round((curDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
                                if (diffDays === 1)
                                    nextStreak = p.streak + 1;
                            }
                            p.streak = nextStreak;
                            p.lastRitualDate = new Date(date + "T00:00:00Z");
                            return [4 /*yield*/, this.progressModel.updateOne({ userId: userId }, { $set: { streak: p.streak, lastRitualDate: p.lastRitualDate } }).exec()];
                        case 2:
                            _a.sent();
                            // Achievements
                            return [4 /*yield*/, this.progressSvc.unlockAchievement(userId, "FIRST_RITUAL")];
                        case 3:
                            // Achievements
                            _a.sent();
                            if (!(p.streak >= 7)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.progressSvc.unlockAchievement(userId, "STREAK_7")];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5:
                            if (!(p.streak >= 30)) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.progressSvc.unlockAchievement(userId, "STREAK_30")];
                        case 6:
                            _a.sent();
                            _a.label = 7;
                        case 7: return [2 /*return*/, { isoDate: date, runeKey: (0, shared_1.runeOfDayKey)(date), streak: p.streak, claimedToday: true }];
                    }
                });
            });
        };
        return RitualService_1;
    }());
    __setFunctionName(_classThis, "RitualService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RitualService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RitualService = _classThis;
}();
exports.RitualService = RitualService;
