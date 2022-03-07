import { Router } from "express";
import { getCategories, createCategory } from "../controllers/categoryController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import verifyOffsetLimitMiddleware from "../middlewares/verifyOffsetLimitMiddleware.js";
import verifyOrderMiddleware from "../middlewares/verifyOrderMiddleware.js";
import categorySchema from "../schemas/categorySchema.js";

const categoryRouter = Router();

categoryRouter.get("/categories", verifyOffsetLimitMiddleware, verifyOrderMiddleware, getCategories);
categoryRouter.post("/categories", validateSchemaMiddleware(categorySchema), createCategory);

export default categoryRouter;