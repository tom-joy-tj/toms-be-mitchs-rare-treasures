const { selectTreasures, 
    selectTreasuresByID 
} = require("../models/treasures-model.js")


exports.getTreasures = (req,res) => {

    let orderBy = "age";
    let order = "ASC";
    let colourQuery = null

    const validOrderBy = ["age", "cost_at_auction", "treasure_name"]
    const validOrderType = ["ASC", "DESC", "asc", "desc"]
   
    if (req.query.sortby && validOrderBy.includes(req.query.sortby)) {
        orderBy = req.query.sortby
    };

    if (req.query.order && validOrderType.includes(req.query.order)) {
        order = req.query.order
    };

    if (req.query.colour) {
        colourQuery = req.query.colour
    };

    return selectTreasures(orderBy, order, colourQuery)
    .then((treasures) => {
    res.status(200).send(treasures)
    });
}

exports.getTreasuresByID = (req, res) => {
    const chosenID = req.params.treasure_id 
    return selectTreasuresByID(chosenID)
    .then((treasures) => {
    res.status(200).send(treasures)
    })
}