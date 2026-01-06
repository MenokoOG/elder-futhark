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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressSchema = exports.Progress = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var Progress = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _points_decorators;
    var _points_initializers = [];
    var _points_extraInitializers = [];
    var _streak_decorators;
    var _streak_initializers = [];
    var _streak_extraInitializers = [];
    var _lastRitualDate_decorators;
    var _lastRitualDate_initializers = [];
    var _lastRitualDate_extraInitializers = [];
    var _lastRuneKey_decorators;
    var _lastRuneKey_initializers = [];
    var _lastRuneKey_extraInitializers = [];
    var _totalStudyReviews_decorators;
    var _totalStudyReviews_initializers = [];
    var _totalStudyReviews_extraInitializers = [];
    var _bestQuizByAett_decorators;
    var _bestQuizByAett_initializers = [];
    var _bestQuizByAett_extraInitializers = [];
    var _unlockedLessonKeys_decorators;
    var _unlockedLessonKeys_initializers = [];
    var _unlockedLessonKeys_extraInitializers = [];
    var _unlockedAchievementKeys_decorators;
    var _unlockedAchievementKeys_initializers = [];
    var _unlockedAchievementKeys_extraInitializers = [];
    var Progress = _classThis = /** @class */ (function () {
        function Progress_1() {
            this.userId = __runInitializers(this, _userId_initializers, void 0);
            // Points / XP
            this.points = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _points_initializers, void 0));
            // Daily ritual streak
            this.streak = (__runInitializers(this, _points_extraInitializers), __runInitializers(this, _streak_initializers, void 0));
            // Last ritual date (nullable)
            this.lastRitualDate = (__runInitializers(this, _streak_extraInitializers), __runInitializers(this, _lastRitualDate_initializers, void 0));
            // Last rune key used for ritual (nullable)
            this.lastRuneKey = (__runInitializers(this, _lastRitualDate_extraInitializers), __runInitializers(this, _lastRuneKey_initializers, void 0));
            // --- Study / SRS metrics ---
            this.totalStudyReviews = (__runInitializers(this, _lastRuneKey_extraInitializers), __runInitializers(this, _totalStudyReviews_initializers, void 0));
            // --- Quiz metrics ---
            // Store best quiz score per Aett as a simple map: { "1": 10, "2": 7, "3": 9 }
            // Use Map so Mongoose has a concrete runtime type.
            this.bestQuizByAett = (__runInitializers(this, _totalStudyReviews_extraInitializers), __runInitializers(this, _bestQuizByAett_initializers, void 0));
            // --- Unlocks ---
            this.unlockedLessonKeys = (__runInitializers(this, _bestQuizByAett_extraInitializers), __runInitializers(this, _unlockedLessonKeys_initializers, void 0));
            this.unlockedAchievementKeys = (__runInitializers(this, _unlockedLessonKeys_extraInitializers), __runInitializers(this, _unlockedAchievementKeys_initializers, void 0));
            __runInitializers(this, _unlockedAchievementKeys_extraInitializers);
        }
        return Progress_1;
    }());
    __setFunctionName(_classThis, "Progress");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _userId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, index: true, required: true })];
        _points_decorators = [(0, mongoose_1.Prop)({ type: Number, default: 0 })];
        _streak_decorators = [(0, mongoose_1.Prop)({ type: Number, default: 0 })];
        _lastRitualDate_decorators = [(0, mongoose_1.Prop)({ type: Date, default: null })];
        _lastRuneKey_decorators = [(0, mongoose_1.Prop)({ type: String, default: null })];
        _totalStudyReviews_decorators = [(0, mongoose_1.Prop)({ type: Number, default: 0 })];
        _bestQuizByAett_decorators = [(0, mongoose_1.Prop)({ type: Map, of: Number, default: {} })];
        _unlockedLessonKeys_decorators = [(0, mongoose_1.Prop)({ type: [String], default: [] })];
        _unlockedAchievementKeys_decorators = [(0, mongoose_1.Prop)({ type: [String], default: [] })];
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _points_decorators, { kind: "field", name: "points", static: false, private: false, access: { has: function (obj) { return "points" in obj; }, get: function (obj) { return obj.points; }, set: function (obj, value) { obj.points = value; } }, metadata: _metadata }, _points_initializers, _points_extraInitializers);
        __esDecorate(null, null, _streak_decorators, { kind: "field", name: "streak", static: false, private: false, access: { has: function (obj) { return "streak" in obj; }, get: function (obj) { return obj.streak; }, set: function (obj, value) { obj.streak = value; } }, metadata: _metadata }, _streak_initializers, _streak_extraInitializers);
        __esDecorate(null, null, _lastRitualDate_decorators, { kind: "field", name: "lastRitualDate", static: false, private: false, access: { has: function (obj) { return "lastRitualDate" in obj; }, get: function (obj) { return obj.lastRitualDate; }, set: function (obj, value) { obj.lastRitualDate = value; } }, metadata: _metadata }, _lastRitualDate_initializers, _lastRitualDate_extraInitializers);
        __esDecorate(null, null, _lastRuneKey_decorators, { kind: "field", name: "lastRuneKey", static: false, private: false, access: { has: function (obj) { return "lastRuneKey" in obj; }, get: function (obj) { return obj.lastRuneKey; }, set: function (obj, value) { obj.lastRuneKey = value; } }, metadata: _metadata }, _lastRuneKey_initializers, _lastRuneKey_extraInitializers);
        __esDecorate(null, null, _totalStudyReviews_decorators, { kind: "field", name: "totalStudyReviews", static: false, private: false, access: { has: function (obj) { return "totalStudyReviews" in obj; }, get: function (obj) { return obj.totalStudyReviews; }, set: function (obj, value) { obj.totalStudyReviews = value; } }, metadata: _metadata }, _totalStudyReviews_initializers, _totalStudyReviews_extraInitializers);
        __esDecorate(null, null, _bestQuizByAett_decorators, { kind: "field", name: "bestQuizByAett", static: false, private: false, access: { has: function (obj) { return "bestQuizByAett" in obj; }, get: function (obj) { return obj.bestQuizByAett; }, set: function (obj, value) { obj.bestQuizByAett = value; } }, metadata: _metadata }, _bestQuizByAett_initializers, _bestQuizByAett_extraInitializers);
        __esDecorate(null, null, _unlockedLessonKeys_decorators, { kind: "field", name: "unlockedLessonKeys", static: false, private: false, access: { has: function (obj) { return "unlockedLessonKeys" in obj; }, get: function (obj) { return obj.unlockedLessonKeys; }, set: function (obj, value) { obj.unlockedLessonKeys = value; } }, metadata: _metadata }, _unlockedLessonKeys_initializers, _unlockedLessonKeys_extraInitializers);
        __esDecorate(null, null, _unlockedAchievementKeys_decorators, { kind: "field", name: "unlockedAchievementKeys", static: false, private: false, access: { has: function (obj) { return "unlockedAchievementKeys" in obj; }, get: function (obj) { return obj.unlockedAchievementKeys; }, set: function (obj, value) { obj.unlockedAchievementKeys = value; } }, metadata: _metadata }, _unlockedAchievementKeys_initializers, _unlockedAchievementKeys_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Progress = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Progress = _classThis;
}();
exports.Progress = Progress;
exports.ProgressSchema = mongoose_1.SchemaFactory.createForClass(Progress);
// Helpful indexes
exports.ProgressSchema.index({ userId: 1 }, { unique: true });
exports.ProgressSchema.index({ points: -1 });
