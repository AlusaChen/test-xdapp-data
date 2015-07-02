var express = require('express');
var router = express.Router();
var indexes = require('./indexes'),
    docs = require('./docs');

router.get('/', function(req, res) {
    var ret = handler_ret_data('Welcome!');
    res.json(ret);
});


router.use('/:type/:app',function checkapp(req, res, next) {
    if(req.params.app != 'testapp')
    {
        res.json(handler_ret_data('app error', {}, -1));
        return;
    }
    next();
});

//查看索引
router.get('/list_indexes/:app', function(req, res) {
    indexes.list(req, res);
});

//创建索引
router.post('/create_index/:app', function(req, res) {
    indexes.create(req, res);
});

//删除索引
router.get('/drop_index/:app', function(req, res) {
    indexes.drop(req, res);
});

//删除日志文档
router.get('/remove_doc/:app', function(req, res) {
    docs.remove(req, res);
});


module.exports = router;