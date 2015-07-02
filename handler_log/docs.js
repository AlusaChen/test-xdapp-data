//文档
var async = require('async');
var MongoClient = require('mongodb').MongoClient;

exports.remove = function(req, res) {
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
            collection.removeMany({itemid:503}, {w:1}, function(err, result) {
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