"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inviteController_1 = require("../../controllers/inviteController");
const router = (0, express_1.Router)();
router.post('/invite-user', inviteController_1.sendInvitation);
exports.default = router;
