import db from "../db.js";

export async function getCategories(req, res) {
    try {
        const result = await db.query(`SELECT * FROM categories`);
        res.send(result.rows);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function createCategory(req, res) {
    const { name } = req.body;

    if (name === "") {
        return res.sendStatus(400)
    }

    try {
        const category = await db.query(`SELECT * FROM categories WHERE name=$1`,[name]);
        if (category) {
            return res.sendStatus(409)
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