import sqlstring from "sqlstring";

export default function verifyOffsetLimitMiddleware(req, res, next) {
    let offset = '';
    let limit = '';

    if (req.query.offset) {
         offset = `OFFSET ${sqlstring.escape(req.query.offset)}`;
    }

    if (req.query.limit) {
        limit = `LIMIT ${sqlstring.escape(req.query.limit)}`;
    }


    res.locals.offset = offset;
    res.locals.limit = limit;

    next();
}