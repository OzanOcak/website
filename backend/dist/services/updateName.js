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
exports.updateName = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_conn_1 = require("../db/db-conn");
const schema_1 = require("../db/schema");
// Controller to update user role
const updateName = (id, newName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const euser = yield db_conn_1.db
            .update(schema_1.users)
            .set({ username: newName })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, Number(id)))
            .execute();
    }
    catch (error) {
        console.error("Error updating role:", error);
        throw new Error("Database error"); // Throw an error to be caught in the controller
    }
});
exports.updateName = updateName;
