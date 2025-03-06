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
exports.deleteSelfUserProfile = void 0;
const deleteSelfProfile_1 = require("../../../services/deleteSelfProfile");
const deleteSelfUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params; // Get the user ID from the request params
    const id = Number(userId);
    try {
        yield (0, deleteSelfProfile_1.deleteSelfProfile)(id); // Call the service function
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        // Use type assertion to treat error as an Error object
        const typedError = error;
        if (typedError.message === "User not found") {
            res.status(404).json({ message: "User not found" });
        }
        else {
            console.error("Error deleting user:", typedError);
            res.status(500).json({ message: "Error deleting user" });
        }
    }
});
exports.deleteSelfUserProfile = deleteSelfUserProfile;
