var io = require('socket.io')(3000);
var xdlogs = require('./handler_log');

var logs = io.of('/logs') .on('connection', xdlogs.run);

global.return_ret = function(socket, event, data, code) {
    if(!event) event = 'succeed';
    if(!code) code = 1;
    socket.emit(event, data, code);
};
