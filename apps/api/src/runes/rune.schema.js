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
exports.RuneSchema = exports.Rune = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var Rune = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _key_decorators;
    var _key_initializers = [];
    var _key_extraInitializers = [];
    var _glyph_decorators;
    var _glyph_initializers = [];
    var _glyph_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _phonetic_decorators;
    var _phonetic_initializers = [];
    var _phonetic_extraInitializers = [];
    var _meaning_decorators;
    var _meaning_initializers = [];
    var _meaning_extraInitializers = [];
    var _aett_decorators;
    var _aett_initializers = [];
    var _aett_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    var Rune = _classThis = /** @class */ (function () {
        function Rune_1() {
            this.key = __runInitializers(this, _key_initializers, void 0);
            this.glyph = (__runInitializers(this, _key_extraInitializers), __runInitializers(this, _glyph_initializers, void 0));
            this.name = (__runInitializers(this, _glyph_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.phonetic = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _phonetic_initializers, void 0));
            this.meaning = (__runInitializers(this, _phonetic_extraInitializers), __runInitializers(this, _meaning_initializers, void 0));
            this.aett = (__runInitializers(this, _meaning_extraInitializers), __runInitializers(this, _aett_initializers, void 0));
            this.notes = (__runInitializers(this, _aett_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            __runInitializers(this, _notes_extraInitializers);
        }
        return Rune_1;
    }());
    __setFunctionName(_classThis, "Rune");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _key_decorators = [(0, mongoose_1.Prop)({ unique: true, index: true, required: true })];
        _glyph_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _name_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _phonetic_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _meaning_decorators = [(0, mongoose_1.Prop)({ type: [String], required: true })];
        _aett_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _notes_decorators = [(0, mongoose_1.Prop)({ required: true })];
        __esDecorate(null, null, _key_decorators, { kind: "field", name: "key", static: false, private: false, access: { has: function (obj) { return "key" in obj; }, get: function (obj) { return obj.key; }, set: function (obj, value) { obj.key = value; } }, metadata: _metadata }, _key_initializers, _key_extraInitializers);
        __esDecorate(null, null, _glyph_decorators, { kind: "field", name: "glyph", static: false, private: false, access: { has: function (obj) { return "glyph" in obj; }, get: function (obj) { return obj.glyph; }, set: function (obj, value) { obj.glyph = value; } }, metadata: _metadata }, _glyph_initializers, _glyph_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _phonetic_decorators, { kind: "field", name: "phonetic", static: false, private: false, access: { has: function (obj) { return "phonetic" in obj; }, get: function (obj) { return obj.phonetic; }, set: function (obj, value) { obj.phonetic = value; } }, metadata: _metadata }, _phonetic_initializers, _phonetic_extraInitializers);
        __esDecorate(null, null, _meaning_decorators, { kind: "field", name: "meaning", static: false, private: false, access: { has: function (obj) { return "meaning" in obj; }, get: function (obj) { return obj.meaning; }, set: function (obj, value) { obj.meaning = value; } }, metadata: _metadata }, _meaning_initializers, _meaning_extraInitializers);
        __esDecorate(null, null, _aett_decorators, { kind: "field", name: "aett", static: false, private: false, access: { has: function (obj) { return "aett" in obj; }, get: function (obj) { return obj.aett; }, set: function (obj, value) { obj.aett = value; } }, metadata: _metadata }, _aett_initializers, _aett_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Rune = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Rune = _classThis;
}();
exports.Rune = Rune;
exports.RuneSchema = mongoose_1.SchemaFactory.createForClass(Rune);
