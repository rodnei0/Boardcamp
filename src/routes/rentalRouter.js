import { Router } from "express";
import { createRental, deleteRental, getRentals, returnRental } from "../controllers/rentalController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import rentalSchema from "../schemas/rentalSchema.js";

const rentalRouter = Router();

rentalRouter.get("/rentals", getRentals);
rentalRouter.post("/rentals", validateSchemaMiddleware(rentalSchema), createRental);
rentalRouter.post("/rentals/:id/return", returnRental);
rentalRouter.delete("/rentals/:id", deleteRental);

export default rentalRouter;