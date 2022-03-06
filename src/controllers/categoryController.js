import db from "../db.js";

export async function getCategories(req, res) {
    try {
        const result = await db.query(`SELECT * FROM categories`);
        res.status(200).send(result.rows);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function createCategory(req, res) {
    const { name } = req.body;

    try {
        const result = await db.query(`SELECT * FROM categories WHERE name=$1`,[name]);
        if (result.rowCount > 0) {
            return res.sendStatus(404);
        }

        await db.query(`
            INSERT INTO 
                categories (name) 
                VALUES ($1)`
                , [name]);
        
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error);
    }
}