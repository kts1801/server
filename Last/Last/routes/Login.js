var express = require('express'); // 로그인 + 회원가입
var mysql = require('mysql');
var router =express.Router();
var connection = mysql.createConnection({
    user : 'user',
    password : '201301473',
    database : 'new_schema',
    host : 'aws-rds-mysql.czvbtapsvpjv.us-west-2.rds.amazonaws.com'
});

//로그인
router.get('/:id/:ps', function(req, res, next) {
         connection.query('select * from Login where Loginid = ? ;',[req.params.id], function (error, cursor) {
           if (cursor.length > 0) {
                                        res.json(cursor[0]);
                                        console.log(cursor[0].Name+"정보  전송 완료");
                                } else
                                        res.status(503).json({
                                                result : false,
                                                reason : "Cannot find article"
                                });
        });
});

//회원 정보 가져오기
router.get('/:id', function(req, res, next) {
connection.query('select * from Login where Loginid = ? ;',[req.params.id], function (error, cursor) {
           if (cursor.length > 0) {
                                        res.json(cursor[0]);
                                        console.log(cursor[0].Name+"정보  전송 완료");
                                } else
                                        res.status(503).json({
                                                result : false,
                                                reason : "Cannot find article"
                                });
        });

});

//회원 가입
router.post('/', function(req, res, next) {
    connection.query('insert into Login(Loginid, Pass, Name, Phone, Registerid) values (?, ?, ?, ?, ?);',  [req.body.Loginid, req.body.Pass, req.body.Name, req.body.Phone, req.body.Registerid], function (error, info) {
            if (error == null){
                    console.log("1");
                    connection.query('select * from Login where Loginid=?;', [req.body.Loginid], function (error, cursor) {
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

//회원 정보 수정
router.post('/update/:Loginid', function(req, res, next) {
    connection.query('update Login set   Name=?, Phone=? where Loginid = ?;',  [ req.body.Name, req.body.Phone, req.params.Loginid], function (error, info) {
            if (error == null){
                    connection.query('select * from Login where Loginid=?;', [req.body.Loginid], function (error, cursor) {
                            res.json(cursor[0]);
                    });
            } else res.status(503).json(error);
    });
});

//비밀번호 변경
router.post('/changePW/:Loginid', function(req, res, next) {
    connection.query('update Login set  Pass=? where Loginid = ?;',  [ req.body.Pass, req.params.Loginid], function (error, info) {
            if (error == null){
                    connection.query('select * from Login where Loginid=?;', [req.body.Loginid], function (error, cursor) {
                            res.json(cursor[0]);
                    });
            } else res.status(503).json(error);
    });
});


module.exports = router;

