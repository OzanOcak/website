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
exports.editor = void 0;
const editor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const allUsers = await getAllUsers(); // Fetch all users
        res.status(200).json({
            users: "something from editor", // front-end response.data.users
            //  profile: profile,
        });
        //console.log("Fetched users:", allUsers);
    }
    catch (error) {
        console.error("Error fetching editor data:", error);
        if (!res.headersSent) {
            // Check if headers have already been sent
            res.status(500).json({ message: "Error fetching data" });
        }
    }
});
exports.editor = editor;
