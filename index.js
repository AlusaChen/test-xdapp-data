var express = require('express'),
    app = express();

var handler_log = require('./handler_log');

//var handler_data = require('./handler_data');
//app.use('/datas', handler_data);

global.handler_ret_data = function(msg, data, code) {
    if(!msg) msg = 'succeed';
    if(!code) code = 1;
    if(!data) data = {};

    return {
        code : code,
        message : msg,
        data : data
    };
};

app.use('/logs', handler_log);

app.listen(3000);