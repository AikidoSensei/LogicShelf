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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpenses = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expenseCategoryUnformatted = yield prisma.expenseByCategory.findMany({
            orderBy: {
                date: 'desc'
            }
        });
        const expenseCategory = expenseCategoryUnformatted.map((item) => (Object.assign(Object.assign({}, item), { amount: item.amount.toString() })));
        res.status(200).json(expenseCategory);
    }
    catch (error) {
        res.status(500).json({ message: 'Could not get expense by category' });
    }
    finally {
        prisma.$disconnect;
    }
});
exports.getExpenses = getExpenses;
