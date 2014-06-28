
/**
 * Created by wurui on 14-3-7.
 */
var Validtion=require('../lib/validate');
var Util=require('../lib/util');
var Com=require('./common');
var parseUserId=Com.parseUserId;

//var Login=require('../lib/login');


var mysql = require('mysql');
var config=require('../configs');

//console.log('config',config)
var pool  = mysql.createPool(config.mysql);


exports.register=function(data,cb){
    var key;
    if(key=Validtion.validate(data)){
        cb({
            errCode:'DATA_VALUE_ERR:'+key
        });
        return;
    }

    data.pin=Com.rndPin();
    data.pid=data.pid||1;

    var sqlStr="CALL p_register('"+data.name+"','"+data.passwd+"','"+data.pin+"',"+data.pid+",'"+data.brief+"')";

   // console.log('register.data',data,sqlStr);
    pool.query(sqlStr,
        function(err, result,b) {
           // console.log(err,result,b);
            /*
            [ [ { result: 1 } ],
             { fieldCount: 0,
             affectedRows: 0,
             insertId: 0,
             serverStatus: 2,
             warningCount: 0,
             message: '',
             protocol41: true,
             changedRows: 0 } ]
            * */
            var res={code:1};
            if (err){
                res.errCode=err.code;

            }else{
                var queryResult=result[0][0]['result'];
                res.code=0;
                if(/\d+/.test(queryResult)){
                    data.loginId=queryResult;
                    res.data=data;
                }else{
                    res.code=1;
                    res.errCode=queryResult;
                }

            }
            cb(res);
        })
};

exports.login=function(data,cb){
    var sqlStr="SELECT id,pin,status FROM login WHERE name ='"+
        data.name+
        "' AND passwd ='"+
        data.passwd+
        "' ";

   // console.log('login sql:',sqlStr)

    pool.query(sqlStr, function(err, rows, fields) {

        var res={code:1};
        if (err){
            res.errCode=err.code;
        }else if(rows.length){

            //res.userId=rows[0].id+rows[0].pin;
            res.code=0;
            res.data={
                userId:parseUserId(rows[0]).userId,
                status:rows[0].status
            };
        }else{

            res.errCode='NO_MATCH_RECORD';

        }
        cb(res);
    });
};


exports.getSubUsers=function(data,cb){
    parseUserId(data);
//console.log('data',data)

    var sqlStr="SELECT b.id,b.pin,a.role,b.name,b.time,a.brief " +
        "FROM userinfo a LEFT JOIN login b ON a.loginId=b.id " +
        "WHERE a.parentId='"+data.id+"'";
    if('status' in data){
        sqlStr+=' AND b.status='+data.status;
    }

   // console.log('getSubUsers sql:',sqlStr)

    pool.query(sqlStr, function(err, rows, fields) {
        //console.log('getSubUsers rows:',rows)
        var res={code:1};
        if (err){
            res.errCode=err.code;
        }else if(rows.length){

            //res.userId=rows[0].id+rows[0].pin;
            rows.forEach(function(n,i){
                parseUserId(n);
                delete n.id;
                delete n.pin;
            });
            res.code=0;
            res.data=rows;
        }else{

            res.errCode='NO_MATCH_RECORD';

        }
        cb(res);


    });
};



exports.setSubUser=function(data,cb){
    parseUserId(data);
    var sdata=parseUserId({userId:data.uid});

    var sqlStr="UPDATE userinfo a LEFT JOIN login b ON a.loginId=b.id SET a.role="+data.role+",a.status="+data.status+", b.status="+data.status+" WHERE a.loginId="+sdata.id+" AND a.parentId="+data.id;

    // console.log('setSubUser sql:',sqlStr)

    pool.query(sqlStr, function(err, result, fields) {
        //console.log('getSubUsers rows:',rows)
        var res={code:1};
        if (err){
            res.errCode=err.code;
        }else if(result.affectedRows){

            console.log('result',result);
            res.code=0;

        }
        cb(res);


    });
};

exports.getSubUserTickets=function(data,cb){


    parseUserId(data);
//console.log('data',data)

    var sqlStr="SELECT nick,CONCAT(loginId,pin) AS userId,(SELECT COUNT(*) FROM ticket WHERE loginId=userinfo.loginId) AS tcount,"+
        "(SELECT COUNT(*) FROM ticket WHERE loginId=userinfo.loginId AND status=2) AS vcount, "+
        "(SELECT createTime FROM ticket WHERE loginId=userinfo.loginId LIMIT 0,1) AS lastTime "+
        "FROM userinfo WHERE parentId="+data.id;
    if('status' in data){
        sqlStr+=' AND status='+data.status;
    }

    // console.log('getSubUsers sql:',sqlStr)

    pool.query(sqlStr, function(err, rows, fields) {
        //console.log('getSubUsers rows:',rows)
        var res={code:1};
        if (err){
            res.errCode=err.code;
        }else if(rows.length){


            res.code=0;
            res.data=rows;
        }else{

            res.errCode='NO_MATCH_RECORD';

        }
        cb(res);


    });
}