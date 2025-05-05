var express = require('express');
var router = express.Router();
const db = require("../database/connection");

router.get('/:rID', (req, res) => {
    const recipeID = req.params.rID;
    console.log("specific recipe route");
    let sql = `SELECT * FROM recipes WHERE ID = ?;`;
    db.query(sql, [recipeID], (err, result) => {
        if (err) throw err;
        var row = result[0];
        var titl = row.Title;
        var instruction = row.Instructions;
        let sql2 = `SELECT Ingredients.Title, Ingredients.Info, Associative.Amount, Associative.IsPrimaryProtein FROM Associative JOIN recipes ON Associative.RID = recipes.ID JOIN ingredients ON Associative.IID = ingredients.ID WHERE Associative.RID = ?;`
        db.query(sql2, [recipeID], (err, results) => {
            if (err) throw err;
            var ingredient = results;
            res.render('recipe', { title: titl, instructions: instruction, ingredients: ingredient});
        });
    });
  });

  module.exports = router;