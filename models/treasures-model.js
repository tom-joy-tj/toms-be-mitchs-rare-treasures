const db = require("../db/connection.js");


exports.selectTreasures = (orderBy, order, colourQuery) => {
    let queryValues = []
    let queryStr = `SELECT treasure_id, treasure_name, colour, age, cost_at_auction, shop_id AS shop_name FROM treasures`
    if (colourQuery) {
        queryStr += ` WHERE colour = $1`;
        queryValues.push(colourQuery)
    }
    queryStr += ` ORDER BY ${orderBy} ${order}`

    return db.query (queryStr, queryValues)
    .then(({rows}) => {
        return rows
    })
}

exports.selectTreasuresByID = (chosenID) => {
    return db.query("SELECT treasure_id, treasure_name, colour, age, cost_at_auction, shop_id AS shop_name FROM treasures WHERE treasure_id = $1", [chosenID])
    .then(({rows}) => {
        return rows
    })
}