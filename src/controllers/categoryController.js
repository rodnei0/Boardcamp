import db from "../db.js";

export async function getCategories(req, res) {
    const offset = res.locals.offset;
    const limit = res.locals.limit;
    const orderBy = res.locals.orderBy.replace(/'/g,'');
    const desc = res.locals.desc;

    try {
        const result = await db.query(`SELECT * FROM categories ${offset} ${limit} ${orderBy} ${desc}`);
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