
/*
 * GET users listing.
 */

var model=require('../model/user');
var Login=require('../lib/login');

exports.index=function(req,res,path){
    res.json({code:0,path:path.toString()});
}
exports.login = function(req, res){
    var q=req.query;
    model.login(q,function(data){

        //console.log('login query data',data)
        if(data.userId){
            data[Login.URL_TOKEN_KEY]=Login.login();
        }
        res.json(data);
    });

};
exports.register = function(req, res){
    var q=req.query;
    model.register({
        phone: q.phone,
        passwd: q.passwd
    },function(data){

        //console.log('login query data',data)
        res.json(data);
    });

};
exports.userinfo = function(req, res){
    var q=req.query;
    if(q.type=='set'){
        model.setUserInfo({
            userId: q.userId,
            birthday: q.birthday,
            gender: q.gender,
            nick: q.nick
        },function(data){
            res.json(data);
        });
    }else{
        //to get
        model.getUserInfo({
            userId: q.userId
        },function(data){
            res.json(data);
        });
    }

};

exports.query = function(req, res){
    res.send("query "+456);
};