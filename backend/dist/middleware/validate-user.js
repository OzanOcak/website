"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = void 0;
const zod_1 = require("zod");
const UserSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email("Invalid email address")
        .min(3, "Email is required")
        .max(50),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
const validateUser = (req, res, next) => {
    try {
        UserSchema.parse(req.body); // This will throw if the validation fails
        next(); // Proceed to the next middleware/controller
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({
                message: "Validation Error",
                issues: error.errors,
            });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.validateUser = validateUser;
