"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const metrics_1 = require("../controllers/metrics");
const router = (0, express_1.Router)();
router.get('/', metrics_1.getMetrics);
exports.default = router;
