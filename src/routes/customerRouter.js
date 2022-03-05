import { Router } from "express";
import { createCustomer, getCustomers, getCustomersByid, updateCustomer } from "../controllers/customerController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import customerSchema from "../schemas/costumerSchema.js";

const customeRouter = Router();

customeRouter.get("/customers", getCustomers);
customeRouter.get("/customers/:id", getCustomersByid);
customeRouter.post("/customers", validateSchemaMiddleware(customerSchema), createCustomer);
customeRouter.put("/customers/:id", validateSchemaMiddleware(customerSchema), updateCustomer);

export default customeRouter;