import { Router } from "express";
import { increaseVisitorCount } from "../controllers/feature-controllers/visitor-count/visit-count-controller";
import { getVisitorCount } from "../controllers/feature-controllers/visitor-count/get-visit-count-controller";
import { authenticate } from "../middleware/authenticate-user";

const router = Router();

router.get("/admin/get-visit-count", getVisitorCount); // Public route
router.post("/increase-visit-count", increaseVisitorCount); // Public route with rate limiter

export default router;
