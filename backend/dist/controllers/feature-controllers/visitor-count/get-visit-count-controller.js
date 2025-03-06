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
exports.getVisitorCount = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_conn_1 = require("../../../db/db-conn");
const schema_1 = require("../../../db/schema");
// GET /api/visitor-count
const getVisitorCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Fetching visitor count..."); // Debug log
    try {
        const result = yield db_conn_1.db
            .select()
            .from(schema_1.website_visits)
            .where((0, drizzle_orm_1.eq)(schema_1.website_visits.id, 1))
            .execute();
        const totalVisits = result[0].total_visits;
        res.status(200).json({ total_visits: totalVisits });
    }
    catch (error) {
        console.error("Error fetching visitor count:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getVisitorCount = getVisitorCount;
