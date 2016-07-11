var express = require('express');
var mysql = require('mysql');
var router =express.Router();
var connection = mysql.createConnection({
        user : 'user',
        password : '201301473',
        database : 'new_schema',
        host : 'aws-rds-mysql.czvbtapsvpjv.us-west-2.rds.amazonaws.com'
});

//Tmap api 접근 위해서
var http = require( "https" )
var sys = require( "util" )
var fs = require( "fs" )

var t_totalTime;//기본 제공시간 1시간
var description;

 router.post('/post', function(req, res, next) {
	 connection.query("INSERT INTO Arrive(UserId, Arrivest) values (?, ?);",[req.params.UserId, req.params.Arrivest], function (error, info)
             {
                   console.log("아이디 값 없음 - insert문 실행");
                   if (error == null){
                         connection.query('select * from Arrive where UserId=?;', [req.params.UserId], function (error, cursor) {
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
	});


router.get('/:id/:del', function(req, res, next) {
        req.setEncoding('utf8');
         connection.query('select * from Arrive where UserId = ?;',[req.params.id], function (error, cursor) {
           if (cursor.length > 0) {
		if(req.params.del == 1){
        	   connection.query('delete from Arrive where UserId = ?;',[req.params.id], function (error, result) {
                   if (!error) {
                                                console.log("도착예정정보 삭제 완료");
                                        } else
                                                res.status(503).json({
                                                        result : false,
                                                        reason : "삭제 실패"
                                        });
                });
		}
                                        res.json(cursor[0]);
                                        console.log("도착예정정보 전송 완료");
                                } else
                                        res.status(503).json({
                                                result : false,
                                                reason : "Cannot find article"
                                });
        });
       

  });



  router.post('/:UserId/:Arrivest/:currentX/:currentY',function(req,res,next){
          var startX = req.params.currentX;
          var startY = req.params.currentY;
          var endX;
          var endY;


          console.log("currentX : "+req.params.currentX);
          console.log("currentY : "+req.params.currentY);

          //도착 x,y좌표
          connection.query("SELECT * from Station where Name = ?;",[req.params.Arrivest], function (error, cursor){
              if (cursor.length > 0) {
                  endX = cursor[0].Hard;
                  endY = cursor[0].Lat;

          console.log("endX : "+endX);
          console.log("endY : "+endY);

          connection.query("SELECT * from Arrive where UserId = ?;",[req.params.UserId], function (error, cursor){//aaa
              if(cursor.length>0){ // 아이디 값이 있을때
             if (cursor[0].Bike != null) {//1출발 정류장에 값이 있다.
                     //url설정
                     var url = "/tmap/routes/bicycle?&version=1&startX="+startX+"&startY="+startY+"&endX="+endX+"&endY="+endY+"&reqCoordType=WGS84GEO&appKey=de1952ec-8c34-36fd-9f79-07d348d2757e";

                     var options = {
                     host: 'apis.skplanetx.com',
                     path:url
                     };

                     console.log("url : "+url);
                     http.get(options, function(response){
                     var body = "";
                     response.addListener('data', function(chunk)
                     {
                             console.log("tmap 접속중");
                         body += chunk;
                     });
                     response.addListener('end', function()
                     {//2
                             console.log("tmap 끝");
                         jsonObj = JSON.parse(body);
                         //불러온 값 저장하기
                         t_totalTime = jsonObj.features[0].properties.totalTime;
                             console.log("t_totaltime : "+t_totalTime);
			description = jsonObj.features[1].properties.description;
                                 console.log("description : "+description);

                      });//2
                     });
                     connection.query("UPDATE Arrive SET Time = ? WHERE UserId = ?;",[t_totalTime, req.params.UserId], function (error, info)
                             {
                                     console.log("UPDATE3 : UPDATE실행");
                                  if (error == null){
                                        connection.query('select * from Arrive where UserId=?;', [req.params.UserId], function (error, cursor) {
                                            if (cursor.length > 0) {
                                                      res.json(cursor[0]);
                                                      console.log("update완료 후 선택완료");
                                            } else res.status(503).json({
                                                      result : false,
                                                      reason : "Cannot post article"
                                            });
                                        });
                                  }else
                                        console.log("Error inserting : %s ",error);
                             }).on('error', function(e) {
                                    console.log("Got error: " + e.message);
                            });
                        }
             }else{
                      connection.query("INSERT INTO Arrive(UserId, Arrivest) values (?, ?);",[req.params.UserId, req.params.Arrivest], function (error, info)
                      {
                            console.log("아이디 값 없음 - insert문 실행");
                            if (error == null){
                                  connection.query('select * from Arrive where UserId=?;', [req.params.UserId], function (error, cursor) {
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
                     }).on('error', function(e) {//aaa
                             console.log("Got error: " + e.message);
                     });
                 }
             }).on('error', function(e) {
                     console.log("Got error: " + e.message);
             });
     });

router.get('/Navi/:Arrivest/:currentX/:currentY',function(req,res,next){
          var startX = req.params.currentX;
          var startY = req.params.currentY;
          var endX;
          var endY;
	  var zzz;


          console.log("currentX : "+req.params.currentX);
          console.log("currentY : "+req.params.currentY);

          //도착 x,y좌표
          connection.query("SELECT * from Station where Name = ?;",[req.params.Arrivest], function (error, cursor){
              if (cursor.length > 0) {
                  endX = cursor[0].Hard;
                  endY = cursor[0].Lat;

                  console.log("endX : "+endX);
                  console.log("endY : "+endY);

                             //url설정
                             var url = "/tmap/routes/bicycle?&version=1&startX="+startX+"&startY="+startY+"&endX="+endX+"&endY="+endY+"&reqCoordType=WGS84GEO&appKey=de1952ec-8c34-36fd-9f79-07d348d2757e";

                             var options = {
                             host: 'apis.skplanetx.com',
                             path:url
                             };

                             console.log("url : "+url);
                             http.get(options, function(response){
                             var body = "";
                             response.addListener('data', function(chunk)
                             {
                                     console.log("tmap 접속중");
                                 body += chunk;
                             });
                             response.addListener('end', function()
                             {//2
                                     console.log("tmap 끝");
                                 jsonObj = JSON.parse(body);
                                 //불러온 값 저장하기
                                 zzz = jsonObj.features[0].properties.description;

				res.json({
                                 description : jsonObj.features[0].properties.description
                                 });

                                 console.log("description "+zzz);
                             });//2
                             });
                   }
                  
              }).on('error', function(e) {
                  console.log("Got error: " + e.message);
              });
          });

//길찾기
router.get('/Road/:startX/:startY/:endX/:endY',function(req,res,next){
          var startX = req.params.startX;
          var startY = req.params.startY;
          var endX = req.params.endX;
          var endY = req.params.endY;

          console.log("--Road Tmap Start--");

                             //url설정
                             var url = "/tmap/routes/bicycle?&version=1&startX="+startX+"&startY="+startY+"&endX="+endX+"&endY="+endY+"&reqCoordType=WGS84GEO&appKey=de1952ec-8c34-36fd-9f79-07d348d2757e";

                             var options = {
                             host: 'apis.skplanetx.com',
                             path:url
                             };

                             console.log("url : "+url);
                             http.get(options, function(response){
                             var body = "";
                             response.addListener('data', function(chunk)
                             {
                                     console.log("tmap 접속중");
                                 body += chunk;
                             });
                             response.addListener('end', function()
                             {//2
                                     console.log("tmap 끝");
                                 jsonObj = JSON.parse(body);
                                 //불러온 값 저장하기
				 var resultObj = {
					totaltime : jsonObj.features[0].properties.totalTime,
					totaldistance : jsonObj.features[0].properties.totalDistance,
                                        properties : []
                                }

                                for(var i=0;i<jsonObj.features.length;i++)
                                {
					if(jsonObj.features[i].properties.nodeType == "POINT"){
                                        resultObj.properties.push({
                                                description : jsonObj.features[i].properties.description,
                                                distance : jsonObj.features[i].properties.distance,
						icon : jsonObj.features[i].properties.turnType
                                        	});
					}else if(jsonObj.features[i].properties.nodeType == "LINE"){
                                        resultObj.properties.push({
                                                description : jsonObj.features[i].properties.description,
                                                distance : jsonObj.features[i].properties.distance,
                                                icon : 11
                                                });
                                        }
                                }
                                res.json(resultObj);

                             });//2
                             });
          });

     module.exports = router;


