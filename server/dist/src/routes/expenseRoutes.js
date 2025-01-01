"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expenseContoller_1 = require("../controllers/expenseContoller");
const router = (0, express_1.Router)();
router.get('/', expenseContoller_1.getExpenses);
exports.default = router;
