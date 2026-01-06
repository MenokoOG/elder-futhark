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
exports.ZodValidationPipe = void 0;
var common_1 = require("@nestjs/common");
/**
 * ZodValidationPipe
 * - Validates incoming request payloads using a provided Zod schema.
 * - Returns parsed (typed) data on success.
 * - Throws BadRequestException with flattened Zod errors on failure.
 *
 * Usage:
 *   @Body(new ZodValidationPipe(MySchema)) body: MyType
 */
var ZodValidationPipe = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ZodValidationPipe = _classThis = /** @class */ (function () {
        function ZodValidationPipe_1(schema, options) {
            this.schema = schema;
            this.options = options;
        }
        ZodValidationPipe_1.prototype.transform = function (value, metadata) {
            var parsed = this.schema.safeParse(value);
            if (!parsed.success) {
                throw new common_1.BadRequestException(this.buildError(parsed.error, metadata));
            }
            return parsed.data;
        };
        ZodValidationPipe_1.prototype.buildError = function (err, metadata) {
            var _a, _b, _c, _d, _e, _f;
            var flattened = err.flatten();
            var payload = {
                message: "Validation failed",
                details: {
                    formErrors: flattened.formErrors,
                    fieldErrors: flattened.fieldErrors
                }
            };
            if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.label) {
                payload.label = this.options.label;
            }
            if (((_b = this.options) === null || _b === void 0 ? void 0 : _b.includeMetadata) && metadata) {
                payload.metadata = {
                    type: metadata.type,
                    metatype: (_d = (_c = metadata.metatype) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : null,
                    data: (_e = metadata.data) !== null && _e !== void 0 ? _e : null
                };
            }
            if ((_f = this.options) === null || _f === void 0 ? void 0 : _f.includeRawError) {
                payload.raw = err;
            }
            return payload;
        };
        return ZodValidationPipe_1;
    }());
    __setFunctionName(_classThis, "ZodValidationPipe");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ZodValidationPipe = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ZodValidationPipe = _classThis;
}();
exports.ZodValidationPipe = ZodValidationPipe;
