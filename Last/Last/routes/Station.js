var express = require('express');
var mysql = require('mysql');
var router =express.Router();

var connection = mysql.createConnection({
    user : 'user',
    password : '201301473',
    database : 'new_schema',
    host : 'aws-rds-mysql.czvbtapsvpjv.us-west-2.rds.amazonaws.com'
});

router.get('/:id', function(req, res, next) {
	req.setEncoding('utf8');
         connection.query('select * from Station where Name = ?;',[req.params.id], function (error, cursor) {
	   if (cursor.length > 0) {
                                        res.json(cursor[0]);
                                        console.log(cursor[0].Name+"정거장 정보 전송 완료");
                                } else
                                        res.status(503).json({
                                                result : false,
                                                reason : "Cannot find article"
                                });
        });
});


router.get('/', function(req, res, next) {
        req.setEncoding('utf8');
         connection.query('select * from Station ;', function (error, cursor) {
                   res.json(cursor);
        });
});

module.exports = router;



