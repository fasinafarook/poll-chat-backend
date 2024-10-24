"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController"); // Adjust the import according to your project structure
const userRouter = (0, express_1.Router)();
userRouter.post('/register', async (req, res) => {
    await (0, userController_1.register)(req, res);
});
userRouter.post('/login', async (req, res) => {
    await (0, userController_1.login)(req, res);
});
exports.default = userRouter;
