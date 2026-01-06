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
exports.StudyService = void 0;
var common_1 = require("@nestjs/common");
var shared_1 = require("@efa/shared");
var StudyService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var StudyService = _classThis = /** @class */ (function () {
        function StudyService_1(progressSvc, studyModel, progressModel) {
            this.progressSvc = progressSvc;
            this.studyModel = studyModel;
            this.progressModel = progressModel;
        }
        StudyService_1.prototype.ensureDeck = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var now, dueNow, _i, ELDER_FUTHARK_1, r, exists, init;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            now = new Date();
                            dueNow = now.toISOString();
                            _i = 0, ELDER_FUTHARK_1 = shared_1.ELDER_FUTHARK;
                            _a.label = 1;
                        case 1:
                            if (!(_i < ELDER_FUTHARK_1.length)) return [3 /*break*/, 5];
                            r = ELDER_FUTHARK_1[_i];
                            return [4 /*yield*/, this.studyModel.findOne({ userId: userId, runeKey: r.key }).select("_id").lean().exec()];
                        case 2:
                            exists = _a.sent();
                            if (!!exists) return [3 /*break*/, 4];
                            init = (0, shared_1.sm2Init)(now);
                            return [4 /*yield*/, this.studyModel.create({
                                    userId: userId,
                                    runeKey: r.key,
                                    repetitions: init.repetitions,
                                    intervalDays: init.intervalDays,
                                    easeFactor: init.easeFactor,
                                    dueAt: dueNow,
                                    lapses: init.lapses
                                })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 1];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        StudyService_1.prototype.next = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var now, doc, soon;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.ensureDeck(userId)];
                        case 1:
                            _a.sent();
                            now = new Date().toISOString();
                            return [4 /*yield*/, this.studyModel
                                    .findOne({ userId: userId, dueAt: { $lte: now } })
                                    .sort({ dueAt: 1 })
                                    .lean()
                                    .exec()];
                        case 2:
                            doc = _a.sent();
                            if (!!doc) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.studyModel.findOne({ userId: userId }).sort({ dueAt: 1 }).lean().exec()];
                        case 3:
                            soon = _a.sent();
                            return [2 /*return*/, soon];
                        case 4: return [2 /*return*/, doc];
                    }
                });
            });
        };
        StudyService_1.prototype.grade = function (userId, runeKey, grade) {
            return __awaiter(this, void 0, void 0, function () {
                var doc, next, p;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.studyModel.findOne({ userId: userId, runeKey: runeKey }).exec()];
                        case 1:
                            doc = _a.sent();
                            if (!doc)
                                throw new Error("Study item missing");
                            next = (0, shared_1.sm2Review)({
                                repetitions: doc.repetitions,
                                intervalDays: doc.intervalDays,
                                easeFactor: doc.easeFactor,
                                dueAt: doc.dueAt,
                                lapses: doc.lapses
                            }, grade, new Date());
                            doc.repetitions = next.repetitions;
                            doc.intervalDays = next.intervalDays;
                            doc.easeFactor = next.easeFactor;
                            doc.dueAt = next.dueAt;
                            doc.lapses = next.lapses;
                            return [4 /*yield*/, doc.save()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.progressSvc.ensureProgress(userId)];
                        case 3:
                            p = _a.sent();
                            p.totalStudyReviews += 1;
                            return [4 /*yield*/, this.progressModel.updateOne({ userId: userId }, { $set: { totalStudyReviews: p.totalStudyReviews } }).exec()];
                        case 4:
                            _a.sent();
                            // achievements
                            return [4 /*yield*/, this.progressSvc.unlockAchievement(userId, "SR_10_REVIEWS")];
                        case 5:
                            // achievements
                            _a.sent();
                            if (!(p.totalStudyReviews >= 50)) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.progressSvc.unlockAchievement(userId, "SR_50_REVIEWS")];
                        case 6:
                            _a.sent();
                            _a.label = 7;
                        case 7: return [2 /*return*/, doc.toObject()];
                    }
                });
            });
        };
        return StudyService_1;
    }());
    __setFunctionName(_classThis, "StudyService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StudyService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StudyService = _classThis;
}();
exports.StudyService = StudyService;
