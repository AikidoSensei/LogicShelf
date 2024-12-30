import { Router } from "express";
import { getMetrics } from "../controllers/metrics";
const router = Router()

router.get('/ ', getMetrics)

export default router