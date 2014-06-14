
/*
 * GET users listing.
 */

var Login=require('../lib/login');
//var User=require('./user.js');

var apis={
    user:require('./user.js')
};
exports.index = function(req, res){
   // if(!Login.checkRequest(req)){return res.json({code:-1,errCode:'USER_NOT_LOGIN'});};
    // console.log(req)
    var path=req.params[0].split('/');
    var api=path.shift();
    console.log('api',api,req.params.length)
    if(api in apis){
        apis[api]['index'].call(exports,req,res,path);
    }else{
        res.json({code:404,errCode:'NO_API'});
    }

};

