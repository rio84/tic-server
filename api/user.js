
/*
 * GET users listing.
 */

var model=require('../model/user');
var Login=require('../lib/login');

exports.index=function(req,res,path){
    var api=path.shift();
    //console.log('user',api)
    if(api in exports){
        exports[api].call(this,req,res,path);
    }else{
        res.json({code:404,errCode:'NO_USER_API'});
    }

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

//ok
exports.register = function(req, res){
    var q=req.body;
   // console.log('register.q',q);
    model.register({
        name: q.name,
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