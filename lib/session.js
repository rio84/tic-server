var SessionMap=[];
var duration=30*60*1000;
//console.log('use sessionmap',SessionMap)
var ts=function(){
    return (new Date).getTime();
}
var charArr="1234567890|-=~_qwertyuiopasdfghjklzxcvbnm".toUpperCase();

var generate=function(){
    var r='',count=24;
    while(count--){
        r+=charArr[Math.floor(charArr.length*Math.random())];
    }

    return r;
    //return Math.floor(charArr.length*Math.random());
}

var Session=function(key){
    var token=generate();
    this.expire=ts()+duration;
    this.token=token;
    this.key=key;
    this.valueOf=function(){
        return token;
    }
    //this.startTime=
}

exports.generate=function(key){
    var session=new Session(key);
    SessionMap.push(session);
   // console.log('use sessionmap generate',SessionMap)
    return {token:session.token,expire:session.expire};

}
exports.validate=function(token){console.log('validate',token,new Date)
    for(var i= 0,s;i<SessionMap.length;i++){
        s=SessionMap[i];
        if(s.token==token && s.expire>ts()){
           return true;
        }
    }
    console.log('not login',SessionMap)
    return false;
   // return key in SessionMap;
}
exports.remove=function(token){
    for(var i= 0,s;i<SessionMap.length;i++){
        s=SessionMap[i];
        if(s==token){
            SessionMap.splice(i,1);
            break;
        }
    }

}

exports.inSession=function(key){
    if(key){
        for(var i= 0,s;s=SessionMap[i];i++){
            if( s.expire<ts()&& s.key==key){
                return true;
            }
        }
    }
    return false;
}
exports.removeByKey=function(key){
    if(key){
        for(var i= 0,s;s=SessionMap[i];i++){
            if( s.expire<ts()&& s.key==key){
                SessionMap.splice(i,1);
                return true;
            }
        }
    }
    return false;

};
setInterval(function(){
    for(var i=0;i<SessionMap.length;i++){
       if( SessionMap[i].expire>=ts()){
           SessionMap.splice(i,1);
           i--;
       }
    }

},10*60*1000);
