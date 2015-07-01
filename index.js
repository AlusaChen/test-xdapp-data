var express = require('express');
var app = express();
var handler_data = require('./handler_data');
app.use('/datas', handler_data);

app.listen(3000);