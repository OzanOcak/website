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
exports.adminEdit = void 0;
const getProfile_1 = require("../../services/getProfile");
const adminEdit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const userProfile = yield (0, getProfile_1.getUserProfile)(Number(userId)); // Implement this function to fetch user profile by ID
        if (!userProfile) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ user: userProfile });
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Error fetching user profile" });
        }
    }
});
exports.adminEdit = adminEdit;
