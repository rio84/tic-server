exports.filterObj=function(o,keyArr){
    var newObj={};
    if(typeof keyArr=='string'){
        keyArr=keyArr.split(',');
    }
    for(var i= 0,k;k=keyArr[i];i++){
        if(k in o){
            newObj[k]=o[k];
        }
    }

    return newObj;
}

exports.now=function(){
    return Math.floor((new Date).getTime()/1000);
}
exports.dateTS=function(d){
    s= d.toString();
    if(/\D/.test(s)){
        return Math.floor((new Date(s)).getTime()/1000)
    }
    return d;
}
exports.rnd0to9=function(){
    return Math.floor(10*Math.random());
};
exports.rnd=function(m,n){
    return m+Math.floor((n-m+1)*Math.random())
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