import { Router } from "express";
import { createCustomer, getCustomers, getCustomersById, updateCustomer } from "../controllers/customerController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import customerSchema from "../schemas/costumerSchema.js";

const customerRouter = Router();

customerRouter.get("/customers", getCustomers);
customerRouter.get("/customers/:id", getCustomersById);
customerRouter.post("/customers", validateSchemaMiddleware(customerSchema), createCustomer);
customerRouter.put("/customers/:id", validateSchemaMiddleware(customerSchema), updateCustomer);

export default customerRouter;