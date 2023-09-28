"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const signUpService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.user.findFirst({
        where: {
            email: data.email,
        },
    });
    if (isExist) {
        throw new Error('Email already exists');
    }
    const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
    data.password = hashedPassword;
    const result = yield prisma_1.default.user.create({
        data,
    });
    if (!result) {
        throw new Error('User not created');
    }
    // eslint-disable-next-line no-unused-vars
    const { password } = result, userWithoutPassword = __rest(result, ["password"]);
    return userWithoutPassword;
});
const signInService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        throw new Error('User not found');
    }
    const isPasswordMatched = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordMatched) {
        throw new Error('Invalid Password');
    }
    // creating access token
    const token = jwtHelpers_1.jwtHelpers.createToken({ email: user.email, role: user.role, id: user.id }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        token,
    };
});
exports.authService = {
    signUpService,
    signInService,
};
