export default function validateSchemaMiddleware(schema) {
    return (req, res, next) => {
        const validation = schema.validate(req.body);
        if (validation.error) {
            res.status(422).send("Schema inválido!")
        }

        next();
    }
}