exports.rnd0to9=function(){
    return Math.floor(10*Math.random());
};
exports.rndPin=function(){
    var count= 4,r='';
    while(count--){
        r+=this.rnd0to9();
    }
    return r;
};
exports.parseUserId=function(data){
    if(typeof data=='object'){
        if(data.userId){

            var userId=data.userId.toString();

            data.pin=userId.substr(-4);
            data.id=userId.substr(0,userId.length-4);
        }else if(data.id&&data.pin){
            data.userId=data.id+''+data.pin;
        }
        // data.id
        return data;
    }else if(arguments.length==2){
        return arguments[0]+''+arguments[1];
    }
}

exports.now=function(){
    return Math.floor((new Date).getTime()/1000);
}