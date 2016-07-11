var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:registerID', function(req, res, next) {

var gcm = require('node-gcm');
var fs = require('fs');

var message = new gcm.Message();

var message = new gcm.Message({
    collapseKey: 'demo',
    delayWhileIdle: true,
    timeToLive: 3,
    data: {
        title: '자전거 고장신고',
        message: '자전거 개선을 위하여 이용하신 자전거의 평가를 부탁드립니다.' ,
        custom_key1: 'custom data1',
        custom_key2: 'custom data2'
    }
});

var server_api_key = 'AIzaSyA_1vukt5vXCKLfIigJi8RLOmmD5KX6g5U';
var sender = new gcm.Sender(server_api_key);
var registrationIds = [];

var token = req.params.registerID;

registrationIds.push(token);

sender.send(message, registrationIds, 4, function (err, result) {
    console.log(result);
        res.send("success");
});

});

module.exports = router;

