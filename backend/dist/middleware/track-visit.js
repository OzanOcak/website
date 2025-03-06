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
exports.trackVisit = void 0;
const db_conn_1 = require("../db/db-conn"); // Adjust the path to your Drizzle DB connection
const schema_1 = require("../db/schema"); // Adjust the path to your schema
const drizzle_orm_1 = require("drizzle-orm");
const trackVisit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the "visited" cookie exists
    if (req.cookies.visited) {
        console.log("Cookie exists. Skipping visit tracking."); // Debugging
        return next();
    }
    //console.log(req.cookies.visted);
    // If the cookie does not exist, create it and increment the visit count
    try {
        // Directly increment the visit count in the database
        yield db_conn_1.db
            .update(schema_1.website_visits)
            .set({ total_visits: (0, drizzle_orm_1.sql) `total_visits + 1` })
            .where((0, drizzle_orm_1.eq)(schema_1.website_visits.id, 1))
            .execute();
        // Set a "visited" cookie that expires in 24 hours
        res.cookie("visited", "true", { maxAge: 24 * 60 * 60 * 1000 }); // 24 hours
        console.log("Cookie created and visit tracked."); // Debugging
    }
    catch (error) {
        console.error("Error tracking visit:", error);
    }
    next();
});
exports.trackVisit = trackVisit;
