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
exports.StudyItemSchema = exports.StudyItem = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var StudyItem = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _runeKey_decorators;
    var _runeKey_initializers = [];
    var _runeKey_extraInitializers = [];
    var _repetitions_decorators;
    var _repetitions_initializers = [];
    var _repetitions_extraInitializers = [];
    var _intervalDays_decorators;
    var _intervalDays_initializers = [];
    var _intervalDays_extraInitializers = [];
    var _easeFactor_decorators;
    var _easeFactor_initializers = [];
    var _easeFactor_extraInitializers = [];
    var _dueAt_decorators;
    var _dueAt_initializers = [];
    var _dueAt_extraInitializers = [];
    var _lapses_decorators;
    var _lapses_initializers = [];
    var _lapses_extraInitializers = [];
    var StudyItem = _classThis = /** @class */ (function () {
        function StudyItem_1() {
            this.userId = __runInitializers(this, _userId_initializers, void 0);
            this.runeKey = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _runeKey_initializers, void 0));
            this.repetitions = (__runInitializers(this, _runeKey_extraInitializers), __runInitializers(this, _repetitions_initializers, void 0));
            this.intervalDays = (__runInitializers(this, _repetitions_extraInitializers), __runInitializers(this, _intervalDays_initializers, void 0));
            this.easeFactor = (__runInitializers(this, _intervalDays_extraInitializers), __runInitializers(this, _easeFactor_initializers, void 0));
            this.dueAt = (__runInitializers(this, _easeFactor_extraInitializers), __runInitializers(this, _dueAt_initializers, void 0));
            this.lapses = (__runInitializers(this, _dueAt_extraInitializers), __runInitializers(this, _lapses_initializers, void 0));
            __runInitializers(this, _lapses_extraInitializers);
        }
        return StudyItem_1;
    }());
    __setFunctionName(_classThis, "StudyItem");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _userId_decorators = [(0, mongoose_1.Prop)({ index: true, required: true })];
        _runeKey_decorators = [(0, mongoose_1.Prop)({ index: true, required: true })];
        _repetitions_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _intervalDays_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        _easeFactor_decorators = [(0, mongoose_1.Prop)({ default: 2.5 })];
        _dueAt_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _lapses_decorators = [(0, mongoose_1.Prop)({ default: 0 })];
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _runeKey_decorators, { kind: "field", name: "runeKey", static: false, private: false, access: { has: function (obj) { return "runeKey" in obj; }, get: function (obj) { return obj.runeKey; }, set: function (obj, value) { obj.runeKey = value; } }, metadata: _metadata }, _runeKey_initializers, _runeKey_extraInitializers);
        __esDecorate(null, null, _repetitions_decorators, { kind: "field", name: "repetitions", static: false, private: false, access: { has: function (obj) { return "repetitions" in obj; }, get: function (obj) { return obj.repetitions; }, set: function (obj, value) { obj.repetitions = value; } }, metadata: _metadata }, _repetitions_initializers, _repetitions_extraInitializers);
        __esDecorate(null, null, _intervalDays_decorators, { kind: "field", name: "intervalDays", static: false, private: false, access: { has: function (obj) { return "intervalDays" in obj; }, get: function (obj) { return obj.intervalDays; }, set: function (obj, value) { obj.intervalDays = value; } }, metadata: _metadata }, _intervalDays_initializers, _intervalDays_extraInitializers);
        __esDecorate(null, null, _easeFactor_decorators, { kind: "field", name: "easeFactor", static: false, private: false, access: { has: function (obj) { return "easeFactor" in obj; }, get: function (obj) { return obj.easeFactor; }, set: function (obj, value) { obj.easeFactor = value; } }, metadata: _metadata }, _easeFactor_initializers, _easeFactor_extraInitializers);
        __esDecorate(null, null, _dueAt_decorators, { kind: "field", name: "dueAt", static: false, private: false, access: { has: function (obj) { return "dueAt" in obj; }, get: function (obj) { return obj.dueAt; }, set: function (obj, value) { obj.dueAt = value; } }, metadata: _metadata }, _dueAt_initializers, _dueAt_extraInitializers);
        __esDecorate(null, null, _lapses_decorators, { kind: "field", name: "lapses", static: false, private: false, access: { has: function (obj) { return "lapses" in obj; }, get: function (obj) { return obj.lapses; }, set: function (obj, value) { obj.lapses = value; } }, metadata: _metadata }, _lapses_initializers, _lapses_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StudyItem = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StudyItem = _classThis;
}();
exports.StudyItem = StudyItem;
exports.StudyItemSchema = mongoose_1.SchemaFactory.createForClass(StudyItem);
exports.StudyItemSchema.index({ userId: 1, runeKey: 1 }, { unique: true });
exports.StudyItemSchema.index({ userId: 1, dueAt: 1 });
