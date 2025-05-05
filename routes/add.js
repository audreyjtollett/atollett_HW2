var express = require('express');
var router = express.Router();
const db = require("../database/connection");

router.get('/', function(req,res) {
    let sql = `SELECT CAST(ID AS char) AS ID, Title FROM ingredients;`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.render('add',{title: 'Add Recipe', ingredients: result})
    });
})

router.post('/', function(req,res) {
    console.log(req.body);
    let sql = `INSERT INTO recipes (Title, Instructions) VALUES (?,?)`;
    db.query(sql,[req.body.title,req.body.instructions], (err,result) => {
      if(err) throw err;
        db.query(`SELECT LAST_INSERT_ID();`, (err, rid)=>{
            if(err) throw err;
            console.log(req.body.ingredients)
            req.body.ingredients.forEach(elem => {
                console.log(elem);
                let sql2 = `INSERT INTO associative (RID,IID, Amount, IsPrimaryProtein) VALUES (?,?,?,?)`;
                if(req.body.pp == elem){
                    p = 1;
                }else{
                    p = 0;
                }
                db.query(sql2,[rid[0]['LAST_INSERT_ID()'],parseInt(elem),req.body.amounts[parseInt(elem)-1],p], (err,result2) => {
                    if(err) throw err;
                });
            });
            res.redirect('/list')
        });
    });
})

module.exports = router;