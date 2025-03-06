"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const visit_count_controller_1 = require("../controllers/feature-controllers/visitor-count/visit-count-controller");
const get_visit_count_controller_1 = require("../controllers/feature-controllers/visitor-count/get-visit-count-controller");
const router = (0, express_1.Router)();
router.get("/admin/get-visit-count", get_visit_count_controller_1.getVisitorCount); // Public route
router.post("/increase-visit-count", visit_count_controller_1.increaseVisitorCount); // Public route with rate limiter
exports.default = router;
