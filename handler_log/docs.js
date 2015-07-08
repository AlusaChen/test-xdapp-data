//文档
var async = require('async');
var MongoClient = require('mongodb').MongoClient;

//删除文档
exports.remove = function(socket, data) {
    var app = data['app'];
    var log = data['log'];
    var where = data['where'];
    var mongo_url = 'mongodb://127.0.01:27017/game_' + app + '_log';
    async.waterfall([
        function (callback) {
            MongoClient.connect(mongo_url, function(err, db) {
                callback(err, db);
            });
        },
        function(db, callback) {
            var collection = db.collection(log);
            collection.removeMany(where, {w:1}, function(err, result) {
                callback(err, db, result);
            });
        }
    ], function(err, db, result) {
        db.close();
        if(err) return_ret(socket, 'faield', err, -1);
        else return_ret(socket, '', result);
    });
};

//获取文档数量
exports.count = function (socket, data) {
    var app = data['app'];
    var log = data['log'];
    var where = data['where']?data['where']:{};
    var mongo_url = 'mongodb://127.0.01:27017/game_' + app + '_log';
    async.waterfall([
        function (callback) {
            MongoClient.connect(mongo_url, function(err, db) {
                callback(err, db);
            });
        },
        function(db, callback) {
            var collection = db.collection(log);
            collection.count(where, function(err, result) {
                callback(err, db, result);
            });
        }
    ], function(err, db, result) {
        db.close();
        if(err) return_ret(socket, 'faield', err, -1);
        else return_ret(socket, '', result);
    });
};