import { Router } from "express";
import { createGame, getGames } from "../controllers/gameController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import gameSchema from "../schemas/gameSchema.js";

const gameRouter = Router();

gameRouter.get("/costumer", getGames);
gameRouter.post("/costumer", validateSchemaMiddleware(gameSchema), createGame);

export default gameRouter;