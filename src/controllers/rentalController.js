import db from "../db.js";
import dayjs from "dayjs";
import sqlstring from "sqlstring";

export async function getRentals(req, res) {
    const customerId = req.query.customerId;
    const gameId = req.query.gameId;

    const query = `
        SELECT rentals.*, 
            customers.name,
            games.name,
            games."categoryId",
            categories.name 
            FROM rentals 
                JOIN customers ON rentals."customerId"=customers.id
                JOIN games ON rentals."gameId"=games.id
                JOIN categories ON games."categoryId"=categories.id
    `;

    const customerQuery = `
        WHERE "customerId"=$1
    `;

    const gameQuery = `
        WHERE "gameId"=$1
    `;

    function resultRows(resultRows) {
        const result = resultRows.map(row => {
            const [id, customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee, costumerName, gameName, gameCategory, categoryName] = row;
            
            return {
                id, customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee, customer: { id: customerId, name: costumerName }, game: { id: gameId, name: gameName, categoryId: gameCategory, categoryName: categoryName }
            }
        })
        return result
    }

    try {
        if (customerId) {
            const id = parseInt(customerId.replace(/'/g,''));

            const result = await db.query({
                text:
                    `${query} ${customerQuery}`,
                rowMode: 'array'
            },[sqlstring.escape(id)]);

            if (result.rowCount === 0) {
                return res.sendStatus(404)
            }

            return res.status(200).send(resultRows(result.rows));
        }
        if (gameId) {
            const id = parseInt(gameId.replace(/'/g,''));

            const result = await db.query({
                text:
                    `${query} ${gameQuery}`,
                rowMode: 'array'
            },[sqlstring.escape(id)]);

            if (result.rowCount === 0) {
                return res.sendStatus(404)
            }

            return res.status(200).send(resultRows(result.rows));
        }
                            
        const result = await db.query({
            text:
                `${query}`,
            rowMode: 'array'
        });
        
        res.status(200).send(resultRows(result.rows));
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function createRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id=$1`,[customerId]);
        if (customer.rowCount === 0) {
            return res.sendStatus(400)
        }
        
        const game = await db.query(`SELECT * FROM games WHERE id=$1`,[gameId]);
        if (game.rowCount === 0) {
            return res.sendStatus(400)
        }

        const result = await db.query(`SELECT COUNT("gameId") FROM rentals WHERE "returnDate" IS NULL AND "gameId"=$1`,[gameId]);
        if (result.rows[0].count >= game.rows[0].stockTotal) {
            return res.sendStatus(400)
        }

        const rentDate = dayjs('2022-03-01');
        const originalPrice = daysRented * game.rows[0].pricePerDay;

        await db.query(`
            INSERT INTO 
                rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
                VALUES ($1, $2, $3, $4, $5, $6, $7)`
                , [customerId, gameId, rentDate, daysRented, null, originalPrice, null]);
        
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function returnRental(req, res) {
    const { id } = req.params;

    try {
        const rental = await db.query(`SELECT rentals.*, games."pricePerDay" FROM rentals JOIN games ON rentals."gameId"=games.id WHERE rentals.id=$1`,[id]);
        if (rental.rowCount === 0) {
            return res.sendStatus(404)
        }
        if (rental.rows[0].returnDate !== null) {
            return res.sendStatus(400)
        }

        const rentDate = rental.rows[0].rentDate;
        const daysRented = rental.rows[0].daysRented;
        const pricePerDay = rental.rows[0].pricePerDay;

        const returnDate = new Date(dayjs().format("YYYY-MM-DD"));
        returnDate.setHours(returnDate.getHours() + 4);

        const dayInMiliseconds = 60 * 60 * 24 *1000;
        const diff = (Math.round(Math.abs(returnDate - rentDate)) / dayInMiliseconds);

        let delayFee = null
        if (diff > daysRented) {
            delayFee = (diff - daysRented) * pricePerDay;
        } 

        await db.query(`
            UPDATE rentals 
                SET "returnDate"=$1, "delayFee"=$2
                WHERE id=$3`
                ,[returnDate, delayFee, id]);
        
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function deleteRental(req, res) {
    const { id } = req.params;

    try {
        const rental = await db.query(`SELECT * FROM rentals WHERE rentals.id=$1`,[id]);
        if (rental.rowCount === 0) {
            return res.sendStatus(404)
        }
        if (rental.rows[0].returnDate !== null) {
            return res.sendStatus(400)
        }

        await db.query(`
            DELETE FROM rentals WHERE id=$1
            `, [id]);

        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error);
    }
}