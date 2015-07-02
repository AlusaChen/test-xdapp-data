var
    Db = require('mongodb').Db,
    Server = require('mongodb').Server,
    poolModule = require('generic-pool');

//settings = require('../settings'),

var settings = {
    'db' : 'game_testapp_log',
    'host' : 'localhost'
};

var pool = poolModule.Pool({
    name : "mongoPool",
    create : function(callback) {
        var mongodb = new Db(settings.db, new Server(settings.host, 27017), {safe: true});
        mongodb.open(function(err, db) {
            callback(err, db);
        });
    },
    destroy : function(mongodb) {
        mongodb.close();
    },
    max : 3,
    //min : 5,
    idleTimeoutMillis : 30000,
    log : true
});

exports.pool = pool;