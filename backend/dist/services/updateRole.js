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
exports.updateRole = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_conn_1 = require("../db/db-conn");
const schema_1 = require("../db/schema");
// Controller to update user role
const updateRole = (id, newRole) => __awaiter(void 0, void 0, void 0, function* () {
    const validRoles = ["user", "admin", "editor"]; // Define valid roles
    if (!validRoles.includes(newRole)) {
        throw new Error("Invalid role"); // Throw an error if the role is invalid
    }
    try {
        const user = yield db_conn_1.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, Number(id)))
            .execute();
        if (!user.length) {
            throw new Error("User not found"); // Throw an error if the user is not found
        }
        const euser = yield db_conn_1.db
            .update(schema_1.users)
            .set({ role: newRole })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, Number(id)))
            .execute();
    }
    catch (error) {
        console.error("Error updating role:", error);
        throw new Error("Database error"); // Throw an error to be caught in the controller
    }
});
exports.updateRole = updateRole;
