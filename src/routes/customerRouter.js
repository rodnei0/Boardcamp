import { Router } from "express";
import { createCustomer, getCustomers, getCustomersByid, updateCustomer } from "../controllers/customerController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import customerSchema from "../schemas/costumerSchema.js";

const customerRouter = Router();

customerRouter.get("/customers", getCustomers);
customerRouter.get("/customers/:id", getCustomersByid);
customerRouter.post("/customers", validateSchemaMiddleware(customerSchema), createCustomer);
customerRouter.put("/customers/:id", validateSchemaMiddleware(customerSchema), updateCustomer);

export default customerRouter;