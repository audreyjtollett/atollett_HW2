var express = require('express');
var router = express.Router();
const db = require("../database/connection");

//Chat GPT heavily refactored and adjusted this to avoid weird synchronizing problems with rendering happening before all queries were done. I don't know what a promise is obviously.
router.get('/', function(req, res, next) {
  console.log("list page displayed");
  let buckets = [];

  let sql = `
    SELECT IID, Title, IsPrimaryProtein 
    FROM associative 
    JOIN ingredients ON associative.IID = ingredients.ID 
    WHERE IsPrimaryProtein = 1 
    GROUP BY IID;
  `;

  db.query(sql, async (err, result) => {
    if (err) throw err;
    console.log("getting unique proteins");

    // Convert all inner queries into promises
    const promises = result.map((row) => {
      return new Promise((resolve, reject) => {
        let sql2 = `
          SELECT recipes.ID, recipes.Title 
          FROM recipes 
          JOIN associative ON recipes.ID = associative.RID 
          WHERE associative.IsPrimaryProtein = 1 AND associative.IID = ?;
        `;

        db.query(sql2, [row.IID], (err2, result2) => {
          if (err2) return reject(err2);
          resolve([row.Title, result2]);
        });
      });
    });

    try {
      // Wait for all nested queries to finish
      buckets = await Promise.all(promises);

      console.log("Final buckets:", buckets);
      res.render('list', { title: 'Recipe List', all: buckets });

    } catch (err) {
      next(err); // handle error
    }
  });
});


module.exports = router;
