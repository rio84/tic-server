
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


exports.register=function(data,cb){
    /*
    * data={phone:111,passwd}
    * */
    var key;
     if(key=Validtion.validate(data)){
        cb({
            errCode:'DATA_VALUE_ERR:'+key
        });
        return;
    }

    var sqlStr="INSERT INTO login SET ?",
        pin=Com.rndPin(),
        q={
            phone:data.phone,
            passwd:data.passwd,
            status:1,
            pin:pin,
            time:Util.now()
        };
    pool.query(sqlStr,q, function(err, result) {
        var res={};
        if (err){
            res.errCode=err.code;

        }else{
            res.userId=parseUserId(result.insertId,pin);

            //userinfo
            pool.query('INSERT INTO userinfo SET ?',{
                loginId:result.insertId,
                status:0

            },function(er,result2){
                console.log('insert userinfo',er,result2);
            });
        }


        cb(res);
    });

 };

exports.login=function(data,cb){
    var sqlStr="SELECT id,pin FROM login WHERE phone ='"+
        data.phone+
        "' AND passwd ='"+
        data.passwd+
        "' AND status=1";

    pool.query(sqlStr, function(err, rows, fields) {
        var res={};
        if (err){
            res.errCode=err.code;
        }else if(rows.length){

            //res.userId=rows[0].id+rows[0].pin;
            res.userId=parseUserId(rows[0]).userId;
            res.code=0;
        }else{

            res.errCode='NO_MATCH_RECORD';

        }
        cb(res);

        //console.log('query result rows:',rows)
        /*
        console.log('query result err:',err)
        console.log('query result rows:',rows)
        console.log('query result fields:',fields)
        console.log('query result fields ----')
        */

       // console.log('The solution is: ', rows[0].solution);
    });
};

exports.setUserInfo=function(data,cb){
    var key;
    if(key=Validtion.validate(data)){
        cb({
            errCode:'DATA_VALUE_ERR:'+key
        });
        return;
    }
/*
    insert into userinfo (gender) select * from(select 1) as tmp where exists (select * from login);
*/
    parseUserId(data);
    /*
    var sqlStr="INSERT INTO userinfo (nick,location,gender,birthday,loginId) " +
        "VALUES('" +data.nick+
        "','" +data.location+
        "','" +data.gender+
        "','" +data.birthday+
        "',(SELECT id FROM login WHERE id='" +data.id+
        "' AND pin='" +data.pin+
        "'))";

        */
    var sqlStr="UPDATE userinfo SET ";
    var sqlData=Util.filterObj(data,['nick','location','gender','birthday']);
    var sqlCols=[];
    sqlData.status=1;
    for(var k in sqlData){
        sqlCols.push(k+"='"+sqlData[k]+"'");
    }
    sqlStr+=sqlCols.join(',')+' WHERE loginid='+data.id;

    console.log('sqlStr',sqlStr)


    pool.query(sqlStr, function(err, result) {
        var res={};
        if (err){
            res.errCode=err.code;


        }else{
          //  console.log('setUserInfo',result)

            res.code=result.affectedRows==1?0:1;

        }


        cb(res);
    });
};
exports.getUserInfo=function(data,cb){
    parseUserId(data);
    var sqlStr="SELECT nick,location,gender,birthday " +
        "FROM userinfo, login " +
        "WHERE login.pin='"+
        data.pin+"' AND login.id='"+data.id+"'";
   // console.log('getUserInfo',sqlStr)

    pool.query(sqlStr, function(err, rows, fields) {
        var res={};
        if (err){
            res.errCode=err.code;
        }else if(rows.length){

            //res.userId=rows[0].id+rows[0].pin;
            res.data=rows[0];
            res.code=0;
        }else{

            res.errCode='NO_MATCH_RECORD';

        }
        cb(res);

        //console.log('query result rows:',rows)
        /*
         console.log('query result err:',err)
         console.log('query result rows:',rows)
         console.log('query result fields:',fields)
         console.log('query result fields ----')
         */

        // console.log('The solution is: ', rows[0].solution);
    });
};

exports.getRelativeUsers=function(data,cb){
    //todo
    parseUserId(data);
    var sqlStr="SELECT userinfo.nick,userinfo.location,userinfo.gender,userinfo.birthday,CONCAT(login.id,login.pin) AS userId " +
        "FROM userinfo,login WHERE userinfo.status=1 AND login.status=1 AND userinfo.loginid=login.id AND loginid !="+data.id;
       // "WHERE ";
    /*
    var whereArr=[];

    if(whereArr){
        whereArr.unshift('WHERE ');
    }

    //var sqlData=Util.filterObj(data,['nick','location','gender','birthday']);
    //(data.count?"TOP "+data.count:"")
    if(data.count){
        sqlStr+='LIMIT '+data.count;
    }
     */

    pool.query(sqlStr, function(err, rows, fields) {
        var res={};
        if (err){
            res.errCode=err.code;
        }else if(rows.length){

            res.data=rows;
            res.code=0;
        }else{

            res.errCode='NO_MATCH_RECORD';

        }
        cb(res);


    });
};

exports.getNewUsers=function(data,cb){
    //todo
    parseUserId(data);
    var sqlStr="SELECT nick,location,gender,birthday " +
        "FROM userinfo,login WHERE "
    "WHERE ";
    var whereArr=[];
    //if(data.lo)
    // console.log('getUserInfo',sqlStr)
    if(whereArr){
        whereArr.unshift('WHERE ');
    }
    var sqlData=Util.filterObj(data,['nick','location','gender','birthday']);

    pool.query(sqlStr, function(err, rows, fields) {
        var res={};
        if (err){
            res.errCode=err.code;
        }else if(rows.length){

            res.data=rows;
            res.code=0;
        }else{

            res.errCode='NO_MATCH_RECORD';

        }
        cb(res);


    });
};

/*

exports.createTeam=function(data,cb){
    parseUserId(data);
    var sqlStr="INSERT INTO team SET ?",

        q={
            owner:data.id,
            status:1
        };
    pool.query(sqlStr,q, function(err, result) {
        var res={};
        if (err){
            res.errCode=err.code;

        }else if( result.affectedRows==1){
            res.code=0;
            pool.query("INSERT INTO userteam SET ?",{
                loginid:data.id,
                teamid:result.insertId
            }, function(err2, result2) {
               // console.log()
            });
        }else{
            res.code=1;
        }
        cb(res);
    })
};

*/

