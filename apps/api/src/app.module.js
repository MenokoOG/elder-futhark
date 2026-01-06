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
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var mongoose_1 = require("@nestjs/mongoose");
var node_path_1 = require("node:path");
var env_validation_1 = require("./config/env.validation");
var auth_module_1 = require("./auth/auth.module");
var runes_module_1 = require("./runes/runes.module");
var tools_module_1 = require("./tools/tools.module");
var progress_module_1 = require("./progress/progress.module");
var ritual_module_1 = require("./ritual/ritual.module");
var study_module_1 = require("./study/study.module");
var lore_module_1 = require("./lore/lore.module");
var stats_module_1 = require("./stats/stats.module");
var health_module_1 = require("./health/health.module");
function mustGetEnv(name) {
    var v = process.env[name];
    if (!v || !String(v).trim()) {
        throw new Error("Missing required environment variable: ".concat(name));
    }
    return String(v);
}
var AppModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: node_path_1.default.resolve(process.cwd(), ".env"),
                    validate: function (raw) {
                        var parsed = env_validation_1.EnvSchema.safeParse(raw);
                        if (!parsed.success) {
                            console.error(parsed.error.flatten());
                            throw new Error("Invalid environment variables");
                        }
                        return parsed.data;
                    }
                }),
                mongoose_1.MongooseModule.forRoot(mustGetEnv("MONGODB_URI"), {
                    serverSelectionTimeoutMS: 10000,
                    connectTimeoutMS: 10000
                }),
                health_module_1.HealthModule,
                auth_module_1.AuthModule,
                runes_module_1.RunesModule,
                tools_module_1.ToolsModule,
                progress_module_1.ProgressModule,
                ritual_module_1.RitualModule,
                study_module_1.StudyModule,
                lore_module_1.LoreModule,
                stats_module_1.StatsModule,
            ]
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppModule = _classThis = /** @class */ (function () {
        function AppModule_1() {
        }
        return AppModule_1;
    }());
    __setFunctionName(_classThis, "AppModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppModule = _classThis;
}();
exports.AppModule = AppModule;
