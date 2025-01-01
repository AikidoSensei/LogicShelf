import { Router } from "express";
import { getExpenses } from "../controllers/expenseContoller";
const router = Router();

router.get('/', getExpenses)
export default router