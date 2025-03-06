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
exports.admin = void 0;
const getAllUser_1 = require("../../services/getAllUser");
const countUsers_1 = require("../../services/countUsers");
const admin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, searchQuery = "", searchCriteria = "name", } = req.query; // Destructure page and limit from query parameters
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        // Validate page and limit to ensure they are positive numbers
        if (isNaN(pageNumber) ||
            isNaN(limitNumber) ||
            pageNumber < 1 ||
            limitNumber < 1) {
            res.status(400).json({ message: "Invalid page or limit value" });
            return;
        }
        const allUsers = yield (0, getAllUser_1.getAllUsers)(pageNumber, limitNumber, searchQuery, searchCriteria);
        const totalUsers = yield (0, countUsers_1.countUsers)(searchQuery, searchCriteria); // Get the total number of users
        // const profile = await getUserProfile(req, res); // this sends res too, admin also sends res. multiple headers res error.
        // Check if the returned data is an array and matches the User type
        if (!Array.isArray(allUsers)) {
            throw new Error("Unexpected data format: Not an array");
        }
        res.status(200).json({ users: allUsers, total: totalUsers });
    }
    catch (error) {
        console.error("Error fetching editor data:", error);
        if (!res.headersSent) {
            // Check if headers have already been sent
            res.status(500).json({ message: "Error fetching data" });
        }
    }
});
exports.admin = admin;
