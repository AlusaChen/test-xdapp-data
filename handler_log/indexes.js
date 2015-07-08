//not use


//索引
var async = require('async');
var MongoClient = require('mongodb').MongoClient;

//查看索引
exports.list = function(req, res) {
    var mongo_url = 'mongodb://127.0.01:27017/game_' + req.params.app + '_log';
    var log = req.query.log;
    if(!log) res.json(handler_ret_data('log error', {}, -1));
    async.waterfall([
        function(callback) {
            MongoClient.connect(mongo_url, function(err, db) {
                callback(err, db);
            });
        },
        function(db, callback) {
            var collection = db.collection(log);
            collection.indexes(function(err, indexes) {
                callback(err, db, indexes);
            });
        }
    ], function(err, db, result) {
        db.close();
        if(err) res.json(handler_ret_data('error', {
            'error' : err
        }, -1));
        else res.json(handler_ret_data('', {
            'indexes' : result
        }));
    });
};

//创建索引
exports.create = function(req, res) {
    var mongo_url = 'mongodb://127.0.01:27017/game_' + req.params.app + '_log';
    var log = req.query.log;
    if(!log) res.json(handler_ret_data('log error', {}, -1));
    async.waterfall([
        function (callback) {
            MongoClient.connect(mongo_url, function(err, db) {
                callback(err, db);
            });
        },
        function (db, callback) {
            db.createIndex(log, {'sid':-1,'time':-1,'cid':1}, {background:true, w:1, name:'sid_time_cid'}, function(err, index_name) {
                callback(err, db, index_name);
            });
        }
    ], function(err, db, index_name) {
        db.close();
        if(err) res.json(handler_ret_data('error', {
            'error' : err
        }, -1));
        else res.json(handler_ret_data('', {
            'index_name' : index_name
        }));
    });
};

//删除索引
exports.drop = function(req, res) {
    var mongo_url = 'mongodb://127.0.01:27017/game_' + req.params.app + '_log';
    var log = req.query.log;
    if(!log) res.json(handler_ret_data('log error', {}, -1));
    async.waterfall([
        function (callback) {
            MongoClient.connect(mongo_url, function(err, db) {
                callback(err, db);
            });
        },
        function(db, callback) {
            var collection = db.collection(log);
            collection.dropIndex('sid_time_cid', function(err, result) {
                callback(err, db, result);
            });
        }
    ], function(err, db, result) {
        db.close();
        if(err) res.json(handler_ret_data('error', {
            'error' : err
        }, -1));
        else res.json(handler_ret_data('', {
            'result' : result
        }));
    });
};