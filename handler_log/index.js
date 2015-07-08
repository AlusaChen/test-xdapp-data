var doc = require('./docs');

exports.run = function(socket){
    //获取文档数目
    socket.on('count', function(data){
        return_ret(socket, 'ready', 'ready');
        if(data['app'] && data['log'])
        {
            doc.count(socket, data);
        }
        else
        {
            return_ret(socket, 'failed', 'need params', -1)
        }
    });

    //清除数据
    socket.on('clear', function(data){
        return_ret(socket, 'ready', 'ready');
        if(data['app'] && data['log'] && Object.keys(data['where']).length>0)
        {
            doc.remove(socket, data);
        }
        else
        {
            return_ret(socket, 'failed', 'need params', -1)
        }
    });


    socket.on('disconnect', function(){
        //console.log(socket.id + ' disconnect');
    });


};
