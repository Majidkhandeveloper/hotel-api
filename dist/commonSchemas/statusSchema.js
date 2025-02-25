"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const statusSchema = zod_1.z.object({
    status: zod_1.z.number()
});
exports.default = statusSchema;
