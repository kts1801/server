var express = require('express');
var mysql = require('mysql');
var router =express.Router();

var connection = mysql.createConnection({
    user : 'user',
    password : '201301473',
    database : 'new_schema',
    host : 'aws-rds-mysql.czvbtapsvpjv.us-west-2.rds.amazonaws.com'
});

var Random_num = Math.floor(Math.random()*10000);

router.post('/', function(req, res, next) {
	var repeat = setInterval(function(){
		connection.query('select * from Rent where Number=?;', Random_num, function (error, cursor) {
	         if (cursor.length > 0) {//동일한 번호가 있을 때 다시 랜덤함수 값 저장
	        	 Random_num = Math.floor(Math.random()*10000);
	        	 console.log("다시 생성한 번호 : "+Random_num);
	         } else{ //값 저장
	        	 connection.query("SELECT * from Rent where User = ?;",[req.body.User], function (error, cursor){
	        	        if(cursor.length>0){ // 아이디 값이 있을때
	        	        connection.query("UPDATE Rent SET Number = ? WHERE User = ?;",[Random_num, req.body.User], function (error, info)
	        	                {
	        	                console.log("아이디 값 있음 - update문 실행");
	        	                  if (error == null){
	        	                        connection.query('select * from Rent where User=?;', [req.body.User], function (error, cursor) {
	        	                                if (cursor.length > 0) {
	        	                                        res.json(cursor[0]);
	        	                                        console.log("update완료 후 선택완료");
	        	                                } else
	        	                                        res.status(503).json({
	        	                                                result : false,
	        	                                                reason : "Cannot post article"
	        	                                });
	        	                        });
	        	                  }else
	        	                      console.log("Error inserting : %s ",error);
	        	                })

	        	        }else{//아이디가 없을때
	        	                 connection.query("INSERT INTO Rent(User, Number) values (?, ?);",[req.body.User, Random_num], function (error, info)
	        	                                {
	        	                                console.log("아이디 값 없음 - insert문 실행");
	        	                                  if (error == null){
	        	                                        connection.query('select * from Rent where User=?;', [req.body.User], function (error, cursor) {
	        	                                                if (cursor.length > 0) {
	        	                                                        console.log("insert완료 후 선택완료");
	        	                                                        res.json(cursor[0]);
	        	                                                } else
	        	                                                        res.status(503).json({
	        	                                                                result : false,
	        	                                                                reason : "Cannot post article"
	        	                                                        });
	        	                                                });
	        	                                   }else
	        	                                                console.log("Error inserting : %s ",error);

	        	                             });
	        	                        }
	        	});
	        	 clearInterval(repeat);
			}
	         });
	}, 100)
	
});

router.get('/:id', function(req, res, next) {
        req.setEncoding('utf8');
         connection.query('select * from Rent where User = ?;',[req.params.id], function (error, cursor) {
           if (cursor.length > 0) {
                                        res.json(cursor[0]);
                                } else
                                        res.status(503).json({
                                                result : false,
                                                reason : "Cannot find article"
                                });
        });
});

router.get('/delete/:id', function(req, res, next) {
        req.setEncoding('utf8');
connection.query('delete from Rent where User = ?;',[req.params.id], function (error, result){
           if (!error) {
                                        
                                } else
                                        res.status(503).json({
                                                result : false,
                                                reason : "Cannot find article"
                                });
        });
});


module.exports = router;

