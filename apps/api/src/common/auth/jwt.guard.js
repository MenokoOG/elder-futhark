"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtGuard = void 0;
var passport_1 = require("@nestjs/passport");
exports.JwtGuard = (0, passport_1.AuthGuard)("jwt");
