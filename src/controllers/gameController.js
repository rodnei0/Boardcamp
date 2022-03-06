import db from "../db.js";
import sqlstring from "sqlstring";

export async function getGames(req, res) {
    const name = req.query.name;

    const query = `
        SELECT games.*, 
            categories.name 
            FROM games 
            JOIN categories ON games."categoryId"=categories.id
    `;

    const nameQuery = `
        WHERE games.name LIKE $1
    `;

    function resultRows(resultRows) {
    const result = resultRows.map(row => {
        const [id, name, image, stockTotal, categoryId, pricePerDay, categoryName] = row;
              
        return {
            id, name, image, stockTotal, categoryId, pricePerDay, categoryName
        }
    })
    return result
}

    try {
        if (name) {
            let gameName = sqlstring.escape(name);
            gameName = gameName.replace(/'/g,'');

            const result = await db.query({
                text:
                    `${query} ${nameQuery}`,
                rowMode: 'array'
            },[`${gameName}%`]);

            if (result.rowCount === 0) {
                return res.sendStatus(404)
            }

            return res.status(200).send(resultRows(result.rows));
        } else {
            const result = await db.query({
                text:
                    `${query}`,
                rowMode: 'array'
            });
            
            return res.status(200).send(resultRows(result.rows));
        }
    } catch (error) {
        console.log(error)

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