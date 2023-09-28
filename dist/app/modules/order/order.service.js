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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const insertIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId, role } = user;
    const { orderedBooks } = payload;
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `User not found`);
    }
    if (role !== 'customer') {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `You are not authorized to place order`);
    }
    const result = yield prisma_1.default.order.create({
        data: {
            userId,
            orderedBooks,
        },
    });
    return result;
});
const getAllOrders = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, role } = user;
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `User not found`);
    }
    if (role === 'admin') {
        const orders = yield prisma_1.default.order.findMany({});
        return orders;
    }
    if (role === 'customer') {
        const orders = yield prisma_1.default.order.findMany({
            where: {
                userId: id,
            },
        });
        return orders;
    }
});
const getOrderById = (orderId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, role } = user;
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `User not found`);
    }
    if (role === 'admin') {
        const order = yield prisma_1.default.order.findUnique({
            where: {
                id: orderId,
            },
            include: {
                user: true,
            },
        });
        return order;
    }
    if (role === 'customer') {
        const order = yield prisma_1.default.order.findUnique({
            where: {
                id: orderId,
                userId: id,
            },
        });
        return order;
    }
});
exports.orderService = {
    insertIntoDB,
    getAllOrders,
    getOrderById,
};
