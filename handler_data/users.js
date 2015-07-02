/*
var MongoClient = require('mongodb').MongoClient;
exports.run = function(req, res) {
    MongoClient.connect('mongodb://localhost:27017/game_testapp_log', function(err, db) {
        var collection = db.collection('create');
        collection.findOne({}, function(err, doc){
            if(err) console.log(err);
            db.close();
            res.send('total length is ' + doc.name);
        });

    });
};
*/

var pool = require('../mongo_pool').pool;
exports.run = function(req, res) {
    pool.acquire(function(err, db){
        if(err)
        {
            res.send(err);
        }

        var collection = db.collection('create');
        collection.findOne({}, function(err, doc) {
            if(err)
            {
                res.send(err);
            }
            pool.release(db);
            res.send(doc.name);
        });
    });
};