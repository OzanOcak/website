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
exports.getUserProfile = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_conn_1 = require("../db/db-conn");
const schema_1 = require("../db/schema");
const getUserProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Replace UserType with the actual type
    try {
        // Fetch user data from the database
        const user = yield db_conn_1.db
            .select({
            id: schema_1.users.id,
            username: schema_1.users.username,
            email: schema_1.users.email,
            role: schema_1.users.role,
            profilePicture: schema_1.oauth_identities.profilePicture, // Fetch the profile picture
        })
            .from(schema_1.users)
            .leftJoin(schema_1.oauth_identities, (0, drizzle_orm_1.eq)(schema_1.users.id, schema_1.oauth_identities.userId)) // Join with oauth_identities
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, Number(userId))) // Filter by user ID
            .execute();
        if (user.length === 0) {
            return null; // Return null if the user is not found
        }
        //console.log(user[0]);
        return user[0]; // Return the user data
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        throw new Error("Database error"); // Throw an error to be caught in the controller
    }
});
exports.getUserProfile = getUserProfile;
