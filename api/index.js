
/*
 * GET users listing.
 */

//var User=require('./user.js');

var apis={
    user:require('./user.js')
};
exports.index = function(req, res){
    res.set({
        'Access-Control-Allow-Origin': 'http://localhost'
        //'Content-Length': '123',
        //'ETag': '12345'
    });

    // console.log(req)
    var path=req.params[0].split('/');
    var api=path.shift();
    console.log('api',api,req.params.length);


    if(api in apis){
        apis[api]['index'].call(exports,req,res,path);
    }else{
        res.json({code:404,errCode:'NO_API'});
    }

};

