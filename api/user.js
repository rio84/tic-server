
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
    var q=req.body;
    model.login(q,function(r){

        //console.log('login query data',data)
        if(r.data&&r.data.userId&& r.data.status==1){
            r[Login.URL_TOKEN_KEY]=Login.login(r.data.userId);
        }
        res.json(r);
    });

};

//ok
exports.register = function(req, res){
    var q=req.body;
   // console.log('register.q',q);
    model.register(q,function(data){

        //console.log('login query data',data)
        res.json(data);
    });

};

exports.subuser = function(req, res){
    if(!Login.checkUser(req)){return res.json({code:-1,errCode:'USER_NOT_LOGIN'});};
    var q=req.query;
    // console.log('register.q',q);
    model.getSubUsers(q,function(data){

        //console.log('login query data',data)
        res.json(data);
    });

};
exports.subticket = function(req, res){
    if(!Login.checkUser(req)){return res.json({code:-1,errCode:'USER_NOT_LOGIN'});};
    var q=req.query;
    // console.log('register.q',q);
    model.getSubUserTickets(q,function(data){

        //console.log('login query data',data)
        res.json(data);
    });

};



exports.updateuser = function(req, res){
    if(!Login.checkUser(req)){return res.json({code:-1,errCode:'USER_NOT_LOGIN'});};
    var q=req.query,
        p=req.body;
    p.userId= q.userId;
    // console.log('register.q',q);
    model.setSubUser(p,function(data){

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