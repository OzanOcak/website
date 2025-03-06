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
exports.deleteProfile = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_conn_1 = require("../db/db-conn");
const schema_1 = require("../db/schema");
const deleteProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(userId);
    try {
        // Check if the user exists
        const user = yield db_conn_1.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, id))
            .execute();
        if (!user.length) {
            throw new Error("User not found");
        }
        //await db.delete(tokens).where(eq(tokens.userId, id)).execute();
        //await db.delete(oauth_identities).where(eq(oauth_identities.userId, id));
        yield db_conn_1.db.delete(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id)).execute();
    }
    catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Database error"); // Throw an error to be caught in the controller
    }
});
exports.deleteProfile = deleteProfile;
