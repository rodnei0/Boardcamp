import sqlstring from "sqlstring";

export default function verifyOrderMiddleware(req, res, next) {
    const orderByFilters = {
        id: 'id',
        name: 'name',
        birthday: 'birthday',
        stockTotal: 'stockTotal',
        pricePerDay: 'pricePerDay',
        customerId: 'customerId',
        gameId: 'gameId',
        rentDate: 'rentDate',
        daysRented: 'daysRented',
        returnDate: 'returnDate',
        originalPrice: 'originalPrice',
        delayFee: 'delayFee'
    }

    let orderBy = '';
    let desc = '';

    if (req.query.order) {
        orderBy = `ORDER BY ${sqlstring.escape(orderByFilters[req.query.order])}`;
        orderBy = orderBy.replace(/'/g,'"')

        if (req.query.desc === 'true') {
            desc = 'DESC'
        }
    }

    res.locals.orderBy = orderBy;
    res.locals.desc = desc;

    next();
}