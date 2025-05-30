"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SALT_ROUNDS = 12;
const hashPassword = async (password) => {
    try {
        const salt = await bcryptjs_1.default.genSalt(SALT_ROUNDS);
        return await bcryptjs_1.default.hash(password, salt);
    }
    catch (error) {
        throw new Error("Error hashing password");
    }
};
exports.hashPassword = hashPassword;
const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcryptjs_1.default.compare(password, hashedPassword);
    }
    catch (error) {
        throw new Error("Error comparing password");
    }
};
exports.comparePassword = comparePassword;
