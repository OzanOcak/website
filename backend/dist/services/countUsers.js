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
exports.countUsers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_conn_1 = require("../db/db-conn");
const schema_1 = require("../db/schema");
const countUsers = (searchQuery, searchCriteria) => __awaiter(void 0, void 0, void 0, function* () {
    // Base query
    let query = db_conn_1.db.select({ value: (0, drizzle_orm_1.count)() }).from(schema_1.users);
    // Apply search filter based on criteria
    if (searchQuery) {
        switch (searchCriteria) {
            case "name":
                query = query.where((0, drizzle_orm_1.ilike)(schema_1.users.username, `%${searchQuery}%`));
                break;
            case "email":
                query = query.where((0, drizzle_orm_1.ilike)(schema_1.users.email, `%${searchQuery}%`));
                break;
            case "role":
                query = query.where((0, drizzle_orm_1.eq)(schema_1.users.role, searchQuery));
                break;
            default:
                break;
        }
    }
    const result = yield query;
    return result[0].value;
});
exports.countUsers = countUsers;
