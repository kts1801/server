var express = require('express'); // 로그인 + 회원가입
var mysql = require('mysql');
var router =express.Router();
var connection = mysql.createConnection({
    user : 'user',
    password : '201301473',
    database : 'new_schema',
    host : 'aws-rds-mysql.czvbtapsvpjv.us-west-2.rds.amazonaws.com'
});

var stationid;

router.post('/', function(req, res, next) {
	 connection.query('select * from Locker where Bikeid=?;', [req.body.Bikeid], function (error, cursor) {
         if (cursor.length > 0) {
                 stationid = cursor[0].Stationid;
         } else
                 res.status(503).json({
                          result : false,
                         reason : "Cannot post article" });
         });
	
    connection.query('insert into Bike(Bikeid, Point, Detail, Station) values (?, ?, ?, ?);',  [req.body.Bikeid, req.body.Point, req.body.Detail, stationid], function (error, info) {
            if (error == null){
                    connection.query('select * from Bike where Bikeid=?;', [req.body.Bikeid], function (error, cursor) {
                    if (cursor.length > 0) {
                            res.json(cursor[0]);
                    } else
                            res.status(503).json({
                                     result : false,
                                    reason : "Cannot post article" });
                    });
            } else res.status(503).json(error);
    });
});

router.get('/Arrive/:Stationid', function(req, res, next) {
	 connection.query('select * from Arrive where Arrivest = ? order by Time;', [req.params.Stationid], function (error, cursor) {
        if (cursor.length > 0) {
        	res.json(cursor);
        } else
                res.status(503).json({
                         result : false,
                        reason : "Cannot post article" });
        });
});

router.get('/Recommend/:Stationid', function(req, res, next) {
	 connection.query('SELECT * FROM Bike where Station = ? order by Point desc;', [req.params.Stationid], function (error, cursor) {
       if (cursor.length > 0) {
    	   res.json(cursor);
       } else
               res.status(503).json({
                        result : false,
                       reason : "Cannot post article" });
       });
});


module.exports = router;

