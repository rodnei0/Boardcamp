import { Router } from "express";
import { createCustomer, getCustomers, getCustomersById, updateCustomer } from "../controllers/customerController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import verifyOffsetLimitMiddleware from "../middlewares/verifyOffsetLimitMiddleware.js";
import verifyOrderMiddleware from "../middlewares/verifyOrderMiddleware.js";
import customerSchema from "../schemas/costumerSchema.js";

const customerRouter = Router();

customerRouter.get("/customers", verifyOffsetLimitMiddleware, verifyOrderMiddleware, getCustomers);
customerRouter.get("/customers/:id", getCustomersById);
customerRouter.post("/customers", validateSchemaMiddleware(customerSchema), createCustomer);
customerRouter.put("/customers/:id", validateSchemaMiddleware(customerSchema), updateCustomer);

export default customerRouter;