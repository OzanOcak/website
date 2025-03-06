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
exports.deleteSelfProfile = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_conn_1 = require("../db/db-conn");
const schema_1 = require("../db/schema");
const deleteSelfProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(userId);
    try {
        yield db_conn_1.db.delete(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id)).execute();
    }
    catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Database error"); // Throw an error to be caught in the controller
    }
});
exports.deleteSelfProfile = deleteSelfProfile;
