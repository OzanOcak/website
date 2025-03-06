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
exports.user = void 0;
const getProfile_1 = require("../../services/getProfile");
const user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.userId); // Extract userId from the request
        const profile = yield (0, getProfile_1.getUserProfile)(userId); // Call the service function
        // Ensure that the profile retrieval was successful and check for undefined.
        if (!profile) {
            res.status(404).json({ message: "Profile not found." });
            return;
        }
        res.status(200).json({ profile: profile }); // Return to prevent further execution
        return;
    }
    catch (error) {
        console.error("Error fetching editor data:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Error fetching data" });
            return;
        }
        // If headers were already sent, you can log this or handle it as needed
    }
});
exports.user = user;
