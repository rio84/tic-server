
/**
 * Created by wurui on 14-3-7.
 */
var Validtion=require('../lib/validate');
var Util=require('../lib/util');
var Com=require('./common');
var parseUserId=Com.parseUserId;

var mysql = require('mysql');
var config=require('../configs');

//console.log('config',config)
var pool  = mysql.createPool(config.mysql);
var teamNames=['小熊队','花鱼','猪正红','白狗子','吃饱撑','南瓜菩萨','飞行夜叉','火狐','治暴牙医','风双子'];
//一个team几个人？2个？多个？


exports.recom=function(data,cb){
    parseUserId(data);

    var sqlStr="SELECT b.name,b.id FROM userteam a RIGHT JOIN team b ON a.teamid=b.id WHERE a.status=1 AND b.status=1 AND b.members>0 AND a.loginid!="+data.id+(data.count?" LIMIT "+data.count:"");
    pool.query(sqlStr, function(err, rows) {
        var res={};
        if (err){
            res.errCode=err.code;

        }else {
            res.code=0;

            res.data=rows;

        }
        cb(res);
    })
};

exports.friends=function(data,cb){
//    parseUserId(data);
    var sqlStr="select team.name,t.tid as id from (select teamid as tid from teamteam where teamid2="+data.teamid+" union select teamid2 as tid from teamteam where teamid="+data.teamid+" ) t left join team on team.id=t.tid";
    sqlStr+=(data.count?" LIMIT "+data.count:"");
    pool.query(sqlStr, function(err, rows) {
        var res={};
        if (err){
            res.errCode=err.code;

        }else {
            res.code=0;

            res.data=rows;

        }
        cb(res);
    })
};
exports.mine=function(data,cb){
    parseUserId(data);
    var sqlStr="SELECT * FROM userteam a LEFT JOIN team b ON a.teamid=b.id WHERE a.status=1 AND b.members>0 AND a.loginid="+data.id;
    console.log('mine',sqlStr)
    pool.query(sqlStr, function(err, rows) {
        var res={};
        if (err){
            res.errCode=err.code;

        }else {
            res.code=0;

            res.data=rows;

        }
        cb(res);
    })
}
exports.create=function(data,cb){
    parseUserId(data);
    var sqlStr="INSERT INTO team SET ?",

        q={
            owner:data.id,
            status:1,
            time:Util.now(),
            name:teamNames[Util.rnd(0,teamNames.length-1)]
        };
    pool.query(sqlStr,q, function(err, result) {
        var res={};
        if (err){
            res.errCode=err.code;

        }else if( result.affectedRows==1){
            res.code=0;
            res.data={teamId:result.insertId};

        }else{
            res.code=1;
        }
        cb(res);
    })
};

exports.join=function(data,cb){
    parseUserId(data);


    pool.query("CALL p_team_join("+data.teamid+","+data.id+")",
        function(err, result) {
        var res={};
        if (err){
            res.errCode=err.code;

        }else if( result.affectedRows==1){
            res.code=0;

        }else{
            res.errCode=result[0].result;
            res.code=1;
        }
        cb(res);
    })
};

exports.leave=function(data,cb){

    parseUserId(data);


    pool.query("CALL p_team_leave("+data.teamid+","+data.id+")",
        function(err, result) {
            var res={};
            if (err){
                res.errCode=err.code;

            }else if( result.affectedRows==1){
                res.code=0;

            }else{
                res.errCode=result[0].result;
                res.code=1;
            }
            cb(res);
        })
};

exports.relative=function(data,cb){//建立关系
    //parseUserId(data);
    var sqlStr="CALL p_team_relative("+data.teamid+","+data.teamid2+")";


    pool.query(sqlStr, function(err, result) {//console.log('relative',result)
        var res={};
        if (err){
            res.errCode=err.code;

        }else {
            switch(result.result){
                case 'DUPLICATE_RECORD':
                case 'INVITED':
                case 'RELATION_CREATED_BEFORE':

                case 'RELATION_CREATED':
                    break;
            }
            res.code=0;
            res.result=result[0][0].result;

        }
        cb(res);
    })
};

