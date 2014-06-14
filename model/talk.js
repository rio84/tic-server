
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
exports.send=function(data,cb){
    /*
     * id INTEGER PRIMARY KEY AUTO_INCREMENT,
     content TEXT,
     time TIMESTAMP,
     owner INTEGER,
     conversationid INTEGER
     *
     * */
    parseUserId(data);
    var sqlStr="INSERT INTO talk SET ?",

        q={
            content:data.content,
            time:Util.now(),
            sender:data.id,
            conversationid:data.conversationid,
            status:1

        };
    pool.query(sqlStr,q, function(err, result) {
        var res={};
        if (err){
            res.errCode=err.code;

        }else if( result.affectedRows==1){
            res.code=0;
            res.data=q;

        }else{
            res.code=1;
        }
        cb(res);
    })
};


exports.createConversation=function(data,cb){
    /*
    * id INTEGER PRIMARY KEY AUTO_INCREMENT,
     creater INTEGER,
     createTime TIMESTAMP
    * */
    parseUserId(data);

    var sqlStr="CALL p_conversation("+data.teamid+","+data.teamid2+")";
    pool.query(sqlStr, function(err, result) {
        var res={code:1};
        if (err){
            res.errCode=err.code;

        }else{

            res.code=0;
            console.log('p_conversation',result)
            res.data={id:result[0][0].result};

            /*     暂时不用 teamconversation
            //userinfo
            pool.query('INSERT INTO teamconversation SET ?',{
                conversationid:result.insertId,
                teamid:data.teamid

            },function(err2,result2){
               // console.log('insert userinfo',er,result2);
            });
            pool.query('INSERT INTO teamconversation SET ?',{
                conversationid:result.insertId,
                teamid:data.teamid

            },function(err3,result3){
                // console.log('insert userinfo',er,result2);
            });

            */
        }


        cb(res);
    });

 };

exports.queryTalk=function(data,cb){
    // time
    /*
    * timeafter
    * timebefore
    * all
    * */

    var sqlStr="SELECT content,time,owner FROM talk WHERE status=1 AND conversationid ='"+
        data.conversationid+"' ";

    if(data.timeafter){
        sqlStr+=' AND time> '+data.timeafter;
    }
    if(data.timebefore){
        sqlStr+=' AND time< '+data.timebefore;
    }

    sqlStr+=' ORDER BY time DESC'

    pool.query(sqlStr, function(err, rows, fields) {
        var res={};
        if (err){
            res.errCode=err.code;
        }else if(rows.length){

            //res.userId=rows[0].id+rows[0].pin;
            res.data=rows;
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


}

//exports.