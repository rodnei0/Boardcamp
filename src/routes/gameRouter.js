import { Router } from "express";
import { createGame, getGames } from "../controllers/gameController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import verifyOffsetLimitMiddleware from "../middlewares/verifyOffsetLimitMiddleware.js";
import verifyOrderMiddleware from "../middlewares/verifyOrderMiddleware.js";
import gameSchema from "../schemas/gameSchema.js";

const gameRouter = Router();

gameRouter.get("/games", verifyOffsetLimitMiddleware, verifyOrderMiddleware, getGames);
gameRouter.post("/games", validateSchemaMiddleware(gameSchema), createGame);

export default gameRouter;