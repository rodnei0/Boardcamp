import db from "../db.js";

export async function getCustomers(req, res) {
    const cpf = req.query.cpf;
    const offset = res.locals.offset;
    const limit = res.locals.limit;
    const orderBy = res.locals.orderBy.replace(/'/g,'');
    const desc = res.locals.desc;

    try {
        if (cpf) {
            const result = await db.query(`SELECT * FROM customers WHERE cpf LIKE $1`,[`${cpf}%`]);
            if (result.rowCount === 0) {
                return res.sendStatus(404)
            }
            res.status(200).send(result.rows)
        } else {
            const result = await db.query(`SELECT * FROM customers ${offset} ${limit} ${orderBy} ${desc}`);
            res.status(200).send(result.rows)
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function getCustomersById(req, res) {
    const { id } = req.params;

    try {
        const result = await db.query(`SELECT * FROM customers WHERE id=$1`,[id]);
        if (result.rowCount === 0) {
            return res.sendStatus(404);
        }

        res.status(200).send(result.rows)
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function createCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        const result = await db.query(`SELECT * FROM customers WHERE cpf=$1`,[cpf]);
        if (result.rowCount > 0) {
            return res.sendStatus(409)
        }
        
        await db.query(`
            INSERT INTO 
                customers (name, phone, cpf, birthday) 
                VALUES ($1, $2, $3, $4)`
                , [name, phone, cpf, birthday]);
        
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function updateCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;

    try {
        await db.query(`UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 
        WHERE id=$5`
        ,[name, phone, cpf, birthday, id]);
        
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error);
    }
}