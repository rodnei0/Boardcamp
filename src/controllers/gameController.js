import db from "../db.js";

export async function getGames(req, res) {
    const name = req.query.name;

    try {
        if (name !== undefined) {
            const result = await db.query(`SELECT * FROM games WHERE name LIKE '${name}%'`);
            if (result.rowCount === 0) {
                return res.sendStatus(404)
            }
            res.status(200).send(result.rows)
        } else {
            const result = await db.query(`SELECT * FROM games`);
            res.status(200).send(result.rows)
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function createGame(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {
        const category = await db.query(`SELECT * FROM categories WHERE id=$1`,[categoryId]);
        if (category.rowCount === 0) {
            return res.sendStatus(400)
        }

        const game = await db.query(`SELECT * FROM games WHERE name=$1`,[name]);
        if (game.rowCount > 0) {
            return res.sendStatus(409)
        }
        
        await db.query(`
            INSERT INTO 
                games (name, image, "stockTotal", "categoryId", "pricePerDay") 
                VALUES ($1, $2, $3, $4, $5)`
                , [name, image, parseInt(stockTotal), categoryId, parseInt(pricePerDay)]);
        
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error);
    }
}