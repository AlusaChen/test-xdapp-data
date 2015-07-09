//更新文档测试
/*
var MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID;
    */
var redis = require("redis");
var async = require('async'),
    php = require('phpjs'),
    program = require('commander');

program
    .version('0.0.1')
    .option('-s, --sdate [date]', 'start date, format yyyy-mm-dd, default [today]', 'now')
    .option('-e, --edate [date]', 'end date, format yyyy-mm-dd, default [tomorrow]', 'now +1 Day')
    .parse(process.argv);

var sdate = program.sdate;
var edate = program.edate;


var
    Db = require('mongodb').Db,
    Server = require('mongodb').Server,
    poolModule = require('generic-pool');

//settings = require('../settings'),

var settings = {
    'db' : 'game_kssg_log',
    'host' : '127.0.0.1'
};

var mongoPool = poolModule.Pool({
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
    max : 5,
    //min : 5,
    idleTimeoutMillis : 30000,
    log : true
});


function get_where()
{
    var stime = php.strtotime(php.date('Y-m-d', php.strtotime(sdate)));
    var etime = php.strtotime(php.date('Y-m-d', php.strtotime(edate)));
    stime = stime - 3600;
    return {
        time:{$gte:stime, $lt:etime},
        _up:{$exists:false}
    };
}

function run()
{
    async.waterfall([
        function(callback) {
            mongoPool.acquire(function(err, db){
                callback(err, db);
            });
        },
        function(db, callback) {
            var coll_account = db.collection('account');
            var where = get_where();
            var allplayers = [];
            coll_account.find(where).toArray(function (err, docs) {
                async.each(docs, function(doc, cb){
                    var pos = doc.account.indexOf('.');
                    if (pos != -1) {
                        doc._up = true;
                        doc.cid = parseInt(doc.account.substr(0, pos));
                        coll_account.save(doc, function(err){
                            var k = 's'+doc.sid+'p'+doc.pid;
                            var v = doc.cid;
                            allplayers.push(k, v);
                            if(err) console.log('up account err ' + err);
                            cb(err);
                        });
                    }
                    else
                    {
                        cb();
                    }
                }, function(err) {
                    console.log('up account cid ok');
                    if(err) console.log(err);
                    callback(err, db, allplayers);
                });
            });
        },
        function(db, allplayers, callback) {
            console.log('all players : '+allplayers.length);
            if(allplayers.length) {
                var client = redis.createClient();
                client.on("error", function (err) {
                    console.log("Error " + err);
                    callback(err, db);
                });
                client.mset(allplayers, function (err, res) {
                    client.quit();
                    callback(err, db, res);
                });
            }
            else
            {
                callback(null, db, 'ok');
            }
        }
    ], function(err, db, res) {
        console.log('up redis ok');
        if(err) console.log('err run ' + err);
        mongoPool.release(db);
        run_all();
    });
}

function run_all()
{
    async.each(['create','login','charge'], function(log, callback){
        run_other(log, callback);
    }, function(err){
        if( err ) {
            console.log('A file failed to process');
        } else {
            console.log('all succeed');
        }
    });
}

function run_other(log, cb)
{
    async.waterfall([
        function(callback) {
            mongoPool.acquire(function(err, db){
                callback(err, db);
            });
        },
        function(db, callback){
            var client = redis.createClient();
            var coll = db.collection(log);
            var where = get_where();
            coll.find(where).toArray(function(err, docs){
                async.each(docs, function(doc, cb){
                    var k = 's'+doc.sid+'p'+doc.pid;
                    client.get(k, function(error, val) {
                        if(error)
                        {
                            cb(error);
                            return;
                        }
                        if(val)
                        {
                            doc.cid = parseInt(val);
                            doc._up = true;
                            coll.save(doc,function(err){
                                if(err) console.log(err);
                                cb(err);
                            });
                        }
                        else
                        {
                            cb();
                        }
                    });
                }, function(err){
                    client.quit();
                    callback(err, db);
                });
            });
        }
    ], function(err, db) {
        console.log('up '+log+' ok');
        if(err) console.log('err run other '+err);
        mongoPool.release(db);
        cb(err);
    });
}


run();