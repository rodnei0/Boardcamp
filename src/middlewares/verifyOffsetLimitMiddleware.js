export default function verifyOffsetLimitMiddleware(req, res, next) {
    let offset = '';
    let limit = '';

    if (req.query.offset) {
         offset = `OFFSET ${req.query.offset}`;
    }

    if (req.query.limit) {
        limit = `LIMIT ${req.query.limit}`;
    }

    res.locals.offset = offset;
    res.locals.limit = limit;

    next();
}